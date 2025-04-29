import { db } from "./db/pricing.db";
import { pricingTable, pricingUserTable } from "./db/pricing.schema";
import {
    PricingDto,
    PricingResponse,
    CreatePricingDto,
    UpdatePricingDto,
    PricingUserDto,
    PricingUserResponse,
    CreatePricingUserDto,
    UpdatePricingUserDto,
    CheckPricingUserResponse
} from "./pricing.dto";
import {
    MinLen,
    MaxLen,
    Min,
} from "encore.dev/validate";
import { count, sql, eq, asc, and, or } from 'drizzle-orm';
import { DataResponse, getOffset, paginatedData } from "../../utils";

// Type for database pricing record
type DbPricing = {
    id: number;
    name: string;
    description: string;
    price: string;
    created_at: Date | null;
    updated_at: Date | null;
    type_payment: string;
    sale: string;
};

// Type for database pricing user record
type DbPricingUser = {
    pricing_id: number;
    user_id: number;
    expires_at: Date | null;
    status: string;
    created_at: Date | null;
    updated_at: Date | null;
};

// Convert database pricing record to DTO
function dbPricingToDto(dbPricing: DbPricing): PricingDto {
    return {
        id: dbPricing.id as number & Min<1>,
        name: dbPricing.name as string & MinLen<1> & MaxLen<255>,
        description: dbPricing.description as string & MinLen<1>,
        price: parseFloat(dbPricing.price) as number & Min<0>,
        created_at: dbPricing.created_at || new Date(),
        updated_at: dbPricing.updated_at || new Date(),
        type_payment: dbPricing.type_payment as string & MinLen<1> & MaxLen<255>,
        sale: parseFloat(dbPricing.sale) as number & Min<0>
    };
}

// Convert database pricing user record to DTO
function dbPricingUserToDto(dbPricingUser: DbPricingUser): PricingUserDto {
    return {
        pricing_id: dbPricingUser.pricing_id as number & Min<1>,
        user_id: dbPricingUser.user_id as number & Min<1>,
        expires_at: dbPricingUser.expires_at || new Date(),
        status: dbPricingUser.status as string & MinLen<1> & MaxLen<255>,
        created_at: dbPricingUser.created_at || new Date(),
        updated_at: dbPricingUser.updated_at || new Date()
    };
}

export const PricingService = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count(pricingTable)) as number
        };
    },

    findOne: async (id: number): Promise<PricingResponse> => {
        const [pricing] = await db.select()
            .from(pricingTable)
            .where(eq(pricingTable.id, id))
            .limit(1);

        if (!pricing) {
            return {
                success: false,
                message: "Pricing not found"
            };
        }

        return {
            success: true,
            result: dbPricingToDto(pricing as DbPricing)
        };
    },

    findAll: async (page: number = 1, size: number = 10, search: string = ""): Promise<PricingResponse> => {
        const offset = getOffset(page, size);
        const total = (await PricingService.count()).result as number;

        const whereCondition = search
            ? or(
                sql`${pricingTable.name} ILIKE ${`%${search}%`}`,
                sql`${pricingTable.description} ILIKE ${`%${search}%`}`,
            )
            : undefined;
        const results = await db.select()
            .from(pricingTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(pricingTable.id));

        return {
            success: true,
            result: results.map(pricing => dbPricingToDto(pricing as DbPricing)),
            pagination: paginatedData({ page, size, count: total })
        };
    },

    create: async (data: CreatePricingDto): Promise<PricingResponse> => {
        // Convert number values to strings for database compatibility
        const dbData = {
            ...data,
            price: data.price?.toString(),
            sale: data.sale?.toString()
        };

        const [pricing] = await db.insert(pricingTable)
            .values(dbData)
            .returning();

        return {
            success: true,
            result: dbPricingToDto(pricing as DbPricing)
        };
    },

    update: async (id: number, data: UpdatePricingDto): Promise<PricingResponse> => {
        // Convert number values to strings for database compatibility
        const dbData = {
            ...data,
            price: data.price?.toString(),
            sale: data.sale?.toString()
        };

        const [pricing] = await db.update(pricingTable)
            .set(dbData)
            .where(eq(pricingTable.id, id))
            .returning();

        if (!pricing) {
            return {
                success: false,
                message: "Pricing not found"
            };
        }

        return {
            success: true,
            result: dbPricingToDto(pricing as DbPricing)
        };
    },

    delete: async (id: number): Promise<PricingResponse> => {
        const [pricing] = await db.delete(pricingTable)
            .where(eq(pricingTable.id, id))
            .returning();

        if (!pricing) {
            return {
                success: false,
                message: "Pricing not found"
            };
        }

        return {
            success: true,
            message: "Pricing deleted successfully"
        };
    },
};

export const PricingUserService = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count(pricingUserTable)) as number
        };
    },
    findAll: async (page: number = 1, size: number = 10, search: string = ""): Promise<PricingUserResponse> => {
        const offset = getOffset(page, size);
        const total = (await PricingUserService.count()).result as number;

        const parseNumber = Number(search);

        const whereCondition = search
            ? or(
                eq(pricingUserTable.pricing_id, parseNumber),
                eq(pricingUserTable.user_id, parseNumber),
            )
            : undefined;

        const results = await db.select()
            .from(pricingUserTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(pricingUserTable.pricing_id));

        return {
            success: true,
            result: results.map(user => dbPricingUserToDto(user as DbPricingUser)),
            pagination: paginatedData({ page, size, count: Number(total) })
        };
    },

    findByPricingId: async (pricingId: number, page: number = 1, size: number = 10): Promise<PricingUserResponse> => {
        const offset = getOffset(page, size);
        const total = (await db.select({ count: count() })
            .from(pricingUserTable)
            .where(eq(pricingUserTable.pricing_id, pricingId))
            .then(res => res[0]?.count || 0));

        const results = await db.select()
            .from(pricingUserTable)
            .where(eq(pricingUserTable.pricing_id, pricingId))
            .limit(size)
            .offset(offset)
            .orderBy(asc(pricingUserTable.user_id));

        return {
            success: true,
            result: results.map(user => dbPricingUserToDto(user as DbPricingUser)),
            pagination: paginatedData({ page, size, count: Number(total) })
        };
    },

    findByUserId: async (userId: number, page: number = 1, size: number = 10): Promise<PricingUserResponse> => {
        const offset = getOffset(page, size);
        const total = (await db.select({ count: count() })
            .from(pricingUserTable)
            .where(eq(pricingUserTable.user_id, userId))
            .then(res => res[0]?.count || 0));

        const results = await db.select()
            .from(pricingUserTable)
            .where(eq(pricingUserTable.user_id, userId))
            .limit(size)
            .offset(offset)
            .orderBy(asc(pricingUserTable.pricing_id));

        return {
            success: true,
            result: results.map(user => dbPricingUserToDto(user as DbPricingUser)),
            pagination: paginatedData({ page, size, count: Number(total) })
        };
    },

    findOne: async (pricingId: number, userId: number): Promise<PricingUserResponse> => {
        const [pricingUser] = await db.select()
            .from(pricingUserTable)
            .where(and(
                eq(pricingUserTable.pricing_id, pricingId),
                eq(pricingUserTable.user_id, userId)
            ))
            .limit(1);

        if (!pricingUser) {
            return {
                success: false,
                message: "Pricing user not found"
            };
        }

        return {
            success: true,
            result: dbPricingUserToDto(pricingUser as DbPricingUser)
        };
    },

    create: async (data: CreatePricingUserDto, userId: number): Promise<PricingUserResponse> => {
        const [pricingUser] = await db.insert(pricingUserTable)
            .values({
                ...data,
                user_id: userId
            })
            .returning();

        return {
            success: true,
            result: dbPricingUserToDto(pricingUser as DbPricingUser)
        };
    },

    update: async (pricingId: number, userId: number, data: UpdatePricingUserDto): Promise<PricingUserResponse> => {
        const [pricingUser] = await db.update(pricingUserTable)
            .set(data)
            .where(and(
                eq(pricingUserTable.pricing_id, pricingId),
                eq(pricingUserTable.user_id, userId)
            ))
            .returning();

        if (!pricingUser) {
            return {
                success: false,
                message: "Pricing user not found"
            };
        }

        return {
            success: true,
            result: dbPricingUserToDto(pricingUser as DbPricingUser)
        };
    },

    delete: async (pricingId: number, userId: number): Promise<PricingUserResponse> => {
        const [pricingUser] = await db.delete(pricingUserTable)
            .where(and(
                eq(pricingUserTable.pricing_id, pricingId),
                eq(pricingUserTable.user_id, userId)
            ))
            .returning();

        if (!pricingUser) {
            return {
                success: false,
                message: "Pricing user not found"
            };
        }

        return {
            success: true,
            message: "Pricing user deleted successfully"
        };
    },

    checkPricingUserForOnePricingId: async (pricingId: number, userId: number): Promise<CheckPricingUserResponse> => {
        const [pricingUser] = await db.select()
            .from(pricingUserTable)
            .where(and(
                eq(pricingUserTable.pricing_id, pricingId),
                eq(pricingUserTable.user_id, userId),
            ))
            .limit(1);

        if (!pricingUser) {
            return {
                success: false,
                message: "Pricing user not found"
            };
        }

        // Check if the pricing user is active
        if (pricingUser.status !== "active") {
            return {
                success: false,
                message: "Pricing user is not active"
            };
        }

        // Check if the pricing user is expired
        if (pricingUser.expires_at && pricingUser.expires_at < new Date()) {
            // update the pricing user status to expired
            await db.update(pricingUserTable)
                .set({ status: "expired" })
                .where(eq(pricingUserTable.pricing_id, pricingId));

            return {
                success: false,
                message: "Pricing user is expired"
            };
        }

        return {
            success: true,
            result: pricingUser ? true : false
        };
    },

    checkAllExistPricingUser: async (userId: number): Promise<CheckPricingUserResponse> => {
        const pricingUsers = await db.select()
            .from(pricingUserTable)
            .where(eq(pricingUserTable.user_id, userId));

        if (pricingUsers.length === 0) {
            return {
                success: false,
                message: "Pricing user not found"
            };
        }

        // check if the pricing user is active only one pricing user
        let activePricingUser = false;
        for (const pricingUser of pricingUsers) {
            if (pricingUser.status === "active") {
                activePricingUser = true;
            }
        }

        if (activePricingUser) {
            return {
                success: true,
                result: true
            };
        }

        // check if the pricing user is expired
        let expiredPricingUser = false;
        for (const pricingUser of pricingUsers) {
            if (pricingUser.expires_at && pricingUser.expires_at < new Date()) {
                expiredPricingUser = true;
            }
        }

        if (expiredPricingUser) {
            // update the pricing user status to expired
            await db.update(pricingUserTable)
                .set({ status: "expired" })
                .where(eq(pricingUserTable.user_id, userId));

            return {
                success: false,
                message: "Pricing user is expired"
            };
        }

        return {
            success: true,
            result: pricingUsers.length === 0 ? false : true
        };
    }
};

export default { PricingService, PricingUserService };

import { api, APIError } from "encore.dev/api";
import { PricingService, PricingUserService } from "./pricing.service";
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
import { DataResponse } from "../../utils";
import { getMyAuthData } from "../../dev/auth";
import { Min } from "encore.dev/validate";

export const countPricings = api(
    { expose: true, method: "GET", path: "/pricings/count" },
    async (): Promise<DataResponse> => {
        return await PricingService.count();
    }
)

export const getPricings = api(
    { expose: true, method: "GET", path: "/pricings" },
    async ({ page = 1, size = 10, search = "" }: { page?: number, size?: number, search?: string }): Promise<PricingResponse> => {
        return await PricingService.findAll(page, size, search);
    }
)

export const getPricing = api(
    { expose: true, method: "GET", path: "/pricings/:id" },
    async ({ id }: { id: number }): Promise<PricingResponse> => {
        return await PricingService.findOne(id);
    }
)

export const createPricing = api(
    { expose: true, method: "POST", path: "/pricings" },
    async (body: CreatePricingDto): Promise<PricingResponse> => {
        return await PricingService.create(body);
    }
)

export const updatePricing = api(
    { expose: true, method: "PUT", path: "/pricings/:id" },
    async (body: UpdatePricingDto): Promise<PricingResponse> => {
        if (!body.id) {
            return {
                success: false,
                message: "Id is required"
            };
        }
        return await PricingService.update(body.id, body);
    }
)

export const deletePricing = api(
    { expose: true, method: "DELETE", path: "/pricings/:id" },
    async ({ id }: { id: number }): Promise<PricingResponse> => {
        return await PricingService.delete(id);
    }
)

// Pricing User Endpoints
export const countPricingUsers = api(
    { expose: true, method: "GET", path: "/pricing-users/count" },
    async (): Promise<DataResponse> => {
        return await PricingUserService.count();
    }
)

export const getPricingUsersByPricingId = api(
    { expose: true, method: "GET", path: "/pricing-users/pricing/:pricingId" },
    async ({ pricingId, page, size }: { pricingId: number, page?: number, size?: number }): Promise<PricingUserResponse> => {
        return await PricingUserService.findByPricingId(pricingId, page, size);
    }
)

export const getPricingUsersByUserAuth = api(
    { expose: true, method: "GET", path: "/pricing-users/user", auth: true },
    async ({ page, size }: { page: number, size: number }): Promise<PricingUserResponse> => {
        const authData = getMyAuthData();
        if (!authData) {
            return {
                success: false,
                message: "Unauthorized"
            };
        }
        return await PricingUserService.findByUserId(Number(authData.userID) as number & Min<1>, page > 0 ? page : 1, size > 0 ? size : 10);
    }
)

export const getPricingUsersByUserId = api(
    { expose: true, method: "GET", path: "/pricing-users/user/:userId" },
    async ({ userId, page, size }: { userId: number, page: number, size: number }): Promise<PricingUserResponse> => {
        return await PricingUserService.findByUserId(userId, page > 0 ? page : 1, size > 0 ? size : 10);
    }
)

export const getPricingUser = api(
    { expose: true, method: "GET", path: "/pricing-users/:pricingId/:userId" },
    async ({ pricingId, userId }: { pricingId: number, userId: number }): Promise<PricingUserResponse> => {
        return await PricingUserService.findOne(pricingId, userId);
    }
)

export const createPricingUserAuth = api(
    { expose: true, method: "POST", path: "/pricing-users", auth: true },
    async (body: CreatePricingUserDto): Promise<PricingUserResponse> => {
        const authData = getMyAuthData();
        if (!authData) {
            return {
                success: false,
                message: "Unauthorized"
            };
        }
        return await PricingUserService.create(body, Number(authData.userID) as number & Min<1>);
    }
)

export const createPricingUserId = api(
    { expose: true, method: "POST", path: "/pricing-user-id" },
    async (body: { pricing_id: number & Min<1>, user_id: number & Min<1> }): Promise<PricingUserResponse> => {
        return await PricingUserService.create(body, body.user_id);
    }
)

export const updatePricingUser = api(
    { expose: true, method: "PUT", path: "/pricing-users/:pricingId/:userId" },
    async ({ pricingId, userId, ...data }: { pricingId: number, userId: number } & UpdatePricingUserDto): Promise<PricingUserResponse> => {
        return await PricingUserService.update(pricingId, userId, data);
    }
)

export const updatePricingUserAuth = api(
    { expose: true, method: "PUT", path: "/pricing-users/:pricingId", auth: true },
    async ({ pricingId, ...data }: { pricingId: number } & UpdatePricingUserDto): Promise<PricingUserResponse> => {
        const authData = getMyAuthData();
        if (!authData) {
            return {
                success: false,
                message: "Unauthorized"
            };
        }
        return await PricingUserService.update(pricingId, Number(authData.userID) as number & Min<1>, data);
    }
)

export const deletePricingUser = api(
    { expose: true, method: "DELETE", path: "/pricing-users/:pricingId/:userId" },
    async ({ pricingId, userId }: { pricingId: number, userId: number }): Promise<PricingUserResponse> => {
        return await PricingUserService.delete(pricingId, userId);
    }
)

export const deletePricingUserAuth = api(
    { expose: true, method: "DELETE", path: "/pricing-users/:pricingId", auth: true },
    async ({ pricingId }: { pricingId: number }): Promise<PricingUserResponse> => {
        const authData = getMyAuthData();
        if (!authData) {
            return {
                success: false,
                message: "Unauthorized"
            };
        }
        return await PricingUserService.delete(pricingId, Number(authData.userID) as number & Min<1>);
    }
)

export const checkPricingUserId = api(
    { expose: true, method: "GET", path: "/pricing-users/check/:pricingId/:userId" },
    async ({ pricingId, userId }: { pricingId: number, userId: number }): Promise<CheckPricingUserResponse> => {
        return await PricingUserService.checkPricingUserForOnePricingId(pricingId, userId);
    }
)

export const checkPricingUserAuth = api(
    { expose: true, method: "GET", path: "/pricing-users/check/:pricingId", auth: true },
    async ({ pricingId }: { pricingId: number }): Promise<CheckPricingUserResponse> => {
        const authData = getMyAuthData();
        if (!authData) {
            return {
                success: false,
                message: "Unauthorized"
            };
        }
        return await PricingUserService.checkPricingUserForOnePricingId(pricingId, Number(authData.userID) as number & Min<1>);
    }
)

export const checkAllPricingUserId = api(
    { expose: true, method: "GET", path: "/pricing-users/check-all-exist/:userId", auth: true },
    async ({ userId }: { userId: number }): Promise<CheckPricingUserResponse> => {
        const authData = getMyAuthData();
        if (!authData) {
            return {
                success: false,
                message: "Unauthorized"
            };
        }
        return await PricingUserService.checkAllExistPricingUser(userId);
    }
)

export const checkAllPricingUserAuth = api(
    { expose: true, method: "GET", path: "/pricing-users/check-all-exist", auth: true },
    async (): Promise<CheckPricingUserResponse> => {
        const authData = getMyAuthData();
        if (!authData) {
            return {
                success: false,
                message: "Unauthorized"
            };
        }
        return await PricingUserService.checkAllExistPricingUser(Number(authData.userID) as number & Min<1>);
    }
)

export const getAllPricingUser = api(
    { expose: true, method: "GET", path: "/pricing-users/all" },
    async ({ page = 1, size = 10, search = "" }: { page?: number, size?: number, search?: string }): Promise<PricingUserResponse> => {
        return await PricingUserService.findAll(page, size, search);
    }
)








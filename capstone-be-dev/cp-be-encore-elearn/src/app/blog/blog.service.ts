import { db } from "./db/blog.db";
import { blogTable } from "./db/blog.schema";
import {
    BlogDto,
    BlogResponse,
    CreateBlogDto,
    UpdateBlogDto
} from "./blog.dto";
import { count, sql, eq, asc, or } from 'drizzle-orm';
import { DataResponse, getOffset, paginatedData } from "../../utils";

export const BlogService = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count(blogTable)) as number
        };
    },

    findOne: async (id: number): Promise<BlogResponse> => {
        const [blog] = await db.select()
            .from(blogTable)
            .where(eq(blogTable.id, id))
            .limit(1);

        if (!blog) {
            return {
                success: false,
                message: "Blog not found"
            };
        }

        return {
            success: true,
            result: blog as BlogDto
        };
    },

    findAll: async (page: number = 1, size: number = 10, search: string = ""): Promise<BlogResponse> => {
        const offset = getOffset(page, size);
        const total = (await BlogService.count()).result as number;

        const whereCondition = search
            ? or(
                sql`${blogTable.metadata}->>'title' ILIKE ${`%${search}%`}`,
                sql`${blogTable.metadata}->>'description' ILIKE ${`%${search}%`}`,
            )
            : undefined;

        const results = await db.select()
            .from(blogTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(blogTable.id));

        return {
            success: true,
            result: results as BlogDto[],
            pagination: paginatedData({ page, size, count: total })
        };
    },

    create: async (data: CreateBlogDto): Promise<BlogResponse> => {
        const [blog] = await db.insert(blogTable)
            .values(data)
            .returning();

        return {
            success: true,
            result: blog as BlogDto
        };
    },

    update: async (id: number, data: UpdateBlogDto): Promise<BlogResponse> => {
        const [blog] = await db.update(blogTable)
            .set(data)
            .where(eq(blogTable.id, id))
            .returning();

        if (!blog) {
            return {
                success: false,
                message: "Blog not found"
            };
        }

        return {
            success: true,
            result: blog as BlogDto
        };
    },

    delete: async (id: number): Promise<BlogResponse> => {
        const [blog] = await db.delete(blogTable)
            .where(eq(blogTable.id, id))
            .returning();

        if (!blog) {
            return {
                success: false,
                message: "Blog not found"
            };
        }

        return {
            success: true,
            message: "Blog deleted successfully"
        };
    },
};

export default BlogService;

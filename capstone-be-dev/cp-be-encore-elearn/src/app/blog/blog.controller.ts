import { api, APIError } from "encore.dev/api";
import { BlogService } from "./blog.service";
import {
    BlogDto,
    BlogResponse,
    CreateBlogDto,
    UpdateBlogDto
} from "./blog.dto";
import { DataResponse } from "../../utils";

export const countBlogs = api(
    { expose: true, method: "GET", path: "/blogs/count" },
    async (): Promise<DataResponse> => {
        return await BlogService.count();
    }
)

export const getBlogs = api(
    { expose: true, method: "GET", path: "/blogs" },
    async ({ page = 1, size = 10, search = "" }: { page?: number, size?: number, search?: string }): Promise<BlogResponse> => {
        return await BlogService.findAll(page, size, search);
    }
)

export const getBlog = api(
    { expose: true, method: "GET", path: "/blogs/:id" },
    async ({ id }: { id: number }): Promise<BlogResponse> => {
        return await BlogService.findOne(id);
    }
)

export const createBlog = api(
    { expose: true, method: "POST", path: "/blogs" },
    async (body: CreateBlogDto): Promise<BlogResponse> => {
        return await BlogService.create(body);
    }
)

export const updateBlog = api(
    { expose: true, method: "PUT", path: "/blogs/:id" },
    async (body: UpdateBlogDto): Promise<BlogResponse> => {
        if (!body.id) {
            return {
                success: false,
                message: "Id is required"
            };
        }
        return await BlogService.update(body.id, body);
    }
)

export const deleteBlog = api(
    { expose: true, method: "DELETE", path: "/blogs/:id" },
    async ({ id }: { id: number }): Promise<BlogResponse> => {
        return await BlogService.delete(id);
    }
)

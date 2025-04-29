import os
import argparse
from typing import List

def create_file(path: str, content: str = "") -> None:
    """Tạo file với nội dung cho trước"""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def create_module_structure(name: str, base_path: str = "./src/app") -> None:
    """Tạo cấu trúc module API với tên được chỉ định"""
    
    # Tạo thư mục gốc cho module
    module_path = os.path.join(base_path, name)
    os.makedirs(module_path, exist_ok=True)
    
    # Tạo thư mục db và migrations
    db_path = os.path.join(module_path, "db")
    migrations_path = os.path.join(db_path, "migrations")
    os.makedirs(migrations_path, exist_ok=True)

    # Template cho các file
    templates = {
        f"{name}.dto.ts": """import { DataResponse, Paginated } from "../../utils";
import {
    MinLen,
    MaxLen,
    Min,
} from "encore.dev/validate"

export interface {Entity}Dto {
    id: number & (Min<1>);
    created_at: Date;
    updated_at: Date;
}

export interface Create{Entity}Dto extends Omit<{Entity}Dto, "id"> { }

export interface Update{Entity}Dto extends Partial<{Entity}Dto> { }

export interface {Entity}Response extends Omit<DataResponse, "result"> {
    result?: {Entity}Dto[] | {Entity}Dto;
    pagination?: Paginated;
}
""".replace("{Entity}", name.capitalize()),

        f"db/{name}.db.ts": """import { SQLDatabase } from "encore.dev/storage/sqldb";
import { drizzle } from 'drizzle-orm/node-postgres';

const DB = new SQLDatabase('{name}_db', {
    migrations: './migrations',
});

const db = drizzle(DB.connectionString)

export { db };
""".replace("{name}", name.lower()),

        f"db/{name}.schema.ts": """import * as p from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const {name}Table = p.pgTable("{name}s", {
    id: p.serial().primaryKey(),
    created_at: p.timestamp().default(sql`CURRENT_TIMESTAMP`),
    updated_at: p.timestamp().default(sql`CURRENT_TIMESTAMP`),
});
""".replace("{name}", name.lower()),

        f"{name}.controller.ts": """import { api, APIError } from "encore.dev/api";
import { {Entity}Service } from "./{name}.service";
import {
    {Entity}Dto,
    {Entity}Response,
    Create{Entity}Dto,
    Update{Entity}Dto
} from "./{name}.dto";
import { DataResponse } from "../../utils";

export const count{Entity}s = api(
    { expose: true, method: "GET", path: "/{name}s/count" },
    async (): Promise<DataResponse> => {
        return await {Entity}Service.count();
    }
)

export const get{Entity}s = api(
    { expose: true, method: "GET", path: "/{name}s" },
    async (): Promise<{Entity}Response> => {
        return await {Entity}Service.findAll();
    }
)

export const get{Entity} = api(
    { expose: true, method: "GET", path: "/{name}s/:id" },
    async ({ id }: { id: number }): Promise<{Entity}Response> => {
        return await {Entity}Service.findOne(id);
    }
)

export const create{Entity} = api(
    { expose: true, method: "POST", path: "/{name}s" },
    async (body: Create{Entity}Dto): Promise<{Entity}Response> => {
        return await {Entity}Service.create(body);
    }
)

export const update{Entity} = api(
    { expose: true, method: "PUT", path: "/{name}s/:id" },
    async (body: Update{Entity}Dto): Promise<{Entity}Response> => {
        if (!body.id) {
            return {
                success: false,
                message: "Id is required"
            };
        }
        return await {Entity}Service.update(body.id, body);
    }
)

export const delete{Entity} = api(
    { expose: true, method: "DELETE", path: "/{name}s/:id" },
    async ({ id }: { id: number }): Promise<{Entity}Response> => {
        return await {Entity}Service.delete(id);
    }
)
""".replace("{Entity}", name.capitalize()).replace("{name}", name.lower()),

        f"{name}.service.ts": """import { db } from "./db/{name}.db";
import { {name}Table } from "./db/{name}.schema";
import {
    {Entity}Dto,
    {Entity}Response,
    Create{Entity}Dto,
    Update{Entity}Dto
} from "./{name}.dto";
import { count, sql, eq, asc } from 'drizzle-orm';
import { DataResponse, getOffset, paginatedData } from "../../utils";

export const {Entity}Service = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count({name}Table)) as number
        };
    },

    findOne: async (id: number): Promise<{Entity}Response> => {
        const [{name}] = await db.select()
            .from({name}Table)
            .where(eq({name}Table.id, id))
            .limit(1);

        if (!{name}) {
            return {
                success: false,
                message: "{Entity} not found"
            };
        }

        return {
            success: true,
            result: {name} as {Entity}Dto
        };
    },

    findAll: async (page: number = 1, size: number = 10): Promise<{Entity}Response> => {
        const offset = getOffset(page, size);
        const total = (await {Entity}Service.count()).result as number;

        const results = await db.select()
            .from({name}Table)
            .limit(size)
            .offset(offset)
            .orderBy(asc({name}Table.id));

        return {
            success: true,
            result: results as {Entity}Dto[],
            pagination: paginatedData({ page, size, count: total })
        };
    },

    create: async (data: Create{Entity}Dto): Promise<{Entity}Response> => {
        const [{name}] = await db.insert({name}Table)
            .values(data)
            .returning();

        return {
            success: true,
            result: {name} as {Entity}Dto
        };
    },

    update: async (id: number, data: Update{Entity}Dto): Promise<{Entity}Response> => {
        const [{name}] = await db.update({name}Table)
            .set(data)
            .where(eq({name}Table.id, id))
            .returning();

        if (!{name}) {
            return {
                success: false,
                message: "{Entity} not found"
            };
        }

        return {
            success: true,
            result: {name} as {Entity}Dto
        };
    },

    delete: async (id: number): Promise<{Entity}Response> => {
        const [{name}] = await db.delete({name}Table)
            .where(eq({name}Table.id, id))
            .returning();

        if (!{name}) {
            return {
                success: false,
                message: "{Entity} not found"
            };
        }

        return {
            success: true,
            message: "{Entity} deleted successfully"
        };
    },
};

export default {Entity}Service;
""".replace("{Entity}", name.capitalize()).replace("{name}", name.lower()),

        "db/migrations/1_init.up.sql": """CREATE TABLE {name}s (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_{name}s_id ON {name}s(id);
""".replace("{name}", name.lower()),
        
        "encore.service.ts": """import { Service } from "encore.dev/service";

export default new Service("{name}");
""".replace("{name}", name.lower()),

        "index.ts": """export * from "./{name}.controller";
export * from "./{name}.service";
export * from "./{name}.dto";
export * from "./db/{name}.schema";
""".replace("{name}", name.lower())
    }

    # Tạo các file từ template
    for file_path, content in templates.items():
        full_path = os.path.join(module_path, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        create_file(full_path, content)

    print(f"✅ Đã tạo module basic api '{name}' thành công!")

def main():
    parser = argparse.ArgumentParser(description='Tạo cấu trúc module API mới')
    parser.add_argument('name', help='Tên của module cần tạo')
    parser.add_argument('--path', default='./src/app', help='Đường dẫn cơ sở (mặc định: ./src/app)')
    
    args = parser.parse_args()
    create_module_structure(args.name, args.path)

if __name__ == "__main__":
    main() 
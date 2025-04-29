"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CreateUserRoleDto, UpdateUserRoleDto, UserRoleDto } from "@/lib/actions/role/role.type"

// Schema validation
const userRoleSchema = z.object({
    userId: z.coerce.number().min(1, "ID người dùng phải lớn hơn hoặc bằng 1"),
    roleId: z.coerce.number().min(1, "ID vai trò phải lớn hơn hoặc bằng 1"),
})

type UserRoleFormValues = z.infer<typeof userRoleSchema>

type UserRoleFormProps = {
    mode: 'create' | 'edit';
    userRole?: UserRoleDto;
    isLoading: boolean;
    onSubmit: (data: CreateUserRoleDto | UpdateUserRoleDto) => void;
    onCancel: () => void;
    submitButtonText?: string;
    cancelButtonText?: string;
}

export function UserRoleForm({
    mode,
    userRole,
    isLoading,
    onSubmit,
    onCancel,
    submitButtonText = "Lưu",
    cancelButtonText = "Hủy",
}: UserRoleFormProps) {
    const form = useForm<UserRoleFormValues>({
        resolver: zodResolver(userRoleSchema),
        defaultValues: {
            userId: userRole?.userId || 0,
            roleId: userRole?.roleId || 0,
        },
    })

    const handleSubmit = (values: UserRoleFormValues) => {
        onSubmit(values as CreateUserRoleDto)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Người dùng</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập ID người dùng" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="roleId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Vai trò</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập ID vai trò" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelButtonText}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="relative"
                    >
                        {isLoading ? "Đang xử lý..." : submitButtonText}
                        {isLoading && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
} 
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
import { Textarea } from "@/components/ui/textarea"
import { RoleDto, CreateRoleDto, UpdateRoleDto } from "@/lib/actions/role/role.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Schema cho form vai trò
const createRoleSchema = z.object({
    name: z.string().min(1, "Tên vai trò không được để trống").max(255, "Tên vai trò không được vượt quá 255 ký tự"),
    description: z.string().min(1, "Mô tả không được để trống").max(500, "Mô tả không được vượt quá 500 ký tự"),
})

type RoleFormValues = z.infer<typeof createRoleSchema>

type RoleFormProps = {
    mode: 'create' | 'edit';
    role?: RoleDto;
    isLoading: boolean;
    onSubmit: (data: CreateRoleDto | UpdateRoleDto) => void;
    onCancel: () => void;
    submitButtonText?: string;
    cancelButtonText?: string;
}

export function RoleForm({
    mode,
    role,
    isLoading,
    onSubmit,
    onCancel,
    submitButtonText = "Lưu",
    cancelButtonText = "Hủy",
}: RoleFormProps) {
    const form = useForm<RoleFormValues>({
        resolver: zodResolver(createRoleSchema),
        defaultValues: {
            name: role?.name || "",
            description: role?.description || "",
        }
    })

    const handleSubmit = (data: RoleFormValues) => {
        onSubmit(data as CreateRoleDto | UpdateRoleDto);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên vai trò <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tên vai trò" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mô tả <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Nhập mô tả vai trò"
                                        className="resize-none"
                                        rows={4}
                                        {...field}
                                    />
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
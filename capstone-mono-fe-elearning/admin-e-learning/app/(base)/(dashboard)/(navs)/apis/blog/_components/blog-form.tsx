"use client"

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AlertDialogFooter } from '@/components/ui/alert-dialog'
import { BlogDto, CreateBlogDto, UpdateBlogDto } from '@/lib/actions/blog'

// Định nghĩa schema cho form
const formSchema = z.object({
    slug: z.string().min(1, "Slug không được để trống").max(100, "Slug không được quá 100 ký tự"),
    content: z.string().min(1, "Nội dung không được để trống"),
    metadata: z.object({
        title: z.string().min(1, "Tiêu đề không được để trống"),
        description: z.string().min(1, "Mô tả không được để trống"),
        author: z.string().min(1, "Tác giả không được để trống"),
        publishedTime: z.string(),
        updatedTime: z.string(),
        tags: z.string(),
        privilege: z.enum(["free", "registered"]),
        isPublished: z.boolean(),
        imageAuthor: z.string(),
        thumbnail: z.string(),
    }),
})

interface BlogFormProps {
    mode: 'create' | 'edit';
    blog?: BlogDto;
    isLoading: boolean;
    onSubmit: (data: CreateBlogDto | UpdateBlogDto) => Promise<void>;
    onCancel: () => void;
    submitButtonText: string;
}

export function BlogForm({ mode, blog, isLoading, onSubmit, onCancel, submitButtonText }: BlogFormProps) {
    // Khởi tạo form với giá trị mặc định khi chỉnh sửa
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: mode === 'edit' && blog
            ? {
                slug: blog.slug,
                content: blog.content,
                metadata: {
                    ...blog.metadata,
                    publishedTime: new Date(blog.metadata.publishedTime).toISOString().slice(0, 16),
                    updatedTime: new Date(blog.metadata.updatedTime).toISOString().slice(0, 16),
                    tags: blog.metadata.tags.join(', '),
                },
            }
            : {
                slug: '',
                content: '',
                metadata: {
                    title: '',
                    description: '',
                    author: '',
                    publishedTime: new Date().toISOString().slice(0, 16),
                    updatedTime: new Date().toISOString().slice(0, 16),
                    tags: '',
                    privilege: 'free',
                    isPublished: false,
                    imageAuthor: '',
                    thumbnail: '',
                },
            },
    });

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        const transformedValues = {
            ...values,
            metadata: {
                ...values.metadata,
                tags: values.metadata.tags.split(',').map(tag => tag.trim()),
                publishedTime: new Date(values.metadata.publishedTime),
                updatedTime: new Date(values.metadata.updatedTime),
            },
        };
        await onSubmit(transformedValues as unknown as CreateBlogDto | UpdateBlogDto);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="metadata.title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tiêu đề</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tiêu đề bài viết" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="slug-cua-bai-viet" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="metadata.description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Nhập mô tả ngắn gọn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nội dung</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Nhập nội dung bài viết" rows={10} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="metadata.author"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tác giả</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tên tác giả" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="metadata.tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thẻ (tags)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Các thẻ, phân cách bằng dấu phẩy" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="metadata.publishedTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày đăng</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="metadata.updatedTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày cập nhật</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="metadata.thumbnail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ảnh đại diện (thumbnail)</FormLabel>
                                <FormControl>
                                    <Input placeholder="URL ảnh đại diện" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="metadata.imageAuthor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ảnh tác giả</FormLabel>
                                <FormControl>
                                    <Input placeholder="URL ảnh tác giả" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="metadata.privilege"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Quyền truy cập</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="free" id="free" />
                                            <FormLabel htmlFor="free" className="font-normal">
                                                Miễn phí
                                            </FormLabel>
                                        </div>
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="registered" id="registered" />
                                            <FormLabel htmlFor="registered" className="font-normal">
                                                Người dùng đã đăng ký
                                            </FormLabel>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="metadata.isPublished"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Trạng thái xuất bản
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <AlertDialogFooter>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Hủy
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : submitButtonText}
                    </Button>
                </AlertDialogFooter>
            </form>
        </Form>
    )
} 
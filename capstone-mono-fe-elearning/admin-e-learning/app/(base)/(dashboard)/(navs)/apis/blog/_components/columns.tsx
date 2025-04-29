"use client"

import React, { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { deleteBlog, updateBlog } from "@/lib/actions/blog"
import { toast } from "sonner"
import { BlogForm } from "./blog-form"
import { BlogDto, UpdateBlogDto } from "@/lib/actions/blog"

export interface Blog {
    id: number
    slug: string
    content: string
    metadata: {
        title: string
        description: string
        author: string
        publishedTime: Date
        updatedTime: Date
        tags: string[]
        privilege: "free" | "registered"
        isPublished: boolean
        imageAuthor: string
        thumbnail: string
    }
}

// Component cho Action Cell
const ActionCell = ({ row }: { row: any }) => {
    const blog = row.original as Blog
    const router = useRouter()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const response = await deleteBlog(blog.id)

            if (response.success) {
                toast.success("Xóa bài viết thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Xóa bài viết thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa bài viết")
            console.error(error)
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
            setIsPopoverOpen(false)
        }
    }

    const onSubmit = async (data: UpdateBlogDto) => {
        try {
            setIsLoading(true)
            const response = await updateBlog(blog.id, data)

            if (response.success) {
                toast.success("Cập nhật bài viết thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Cập nhật bài viết thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật bài viết")
            console.error(error)
        } finally {
            setIsLoading(false)
            setIsEditFormOpen(false)
            setIsPopoverOpen(false)
        }
    }

    return (
        <>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="end">
                    <div className="flex items-center justify-between p-2 border-b">
                        <p className="font-medium text-sm">Hành động</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setIsPopoverOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-2 space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                                setIsEditFormOpen(true);
                                setIsPopoverOpen(false);
                            }}
                        >
                            <Pencil className="h-4 w-4 mr-2" /> Chỉnh sửa
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm text-destructive"
                            onClick={() => {
                                setIsDeleteDialogOpen(true);
                                setIsPopoverOpen(false);
                            }}
                        >
                            <Trash className="h-4 w-4 mr-2" /> Xóa
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Form chỉnh sửa */}
            <AlertDialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
                <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Chỉnh sửa bài viết</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cập nhật thông tin cho bài viết {blog.metadata.title}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <BlogForm
                        mode="edit"
                        blog={blog as BlogDto}
                        isLoading={isLoading}
                        onSubmit={onSubmit}
                        onCancel={() => setIsEditFormOpen(false)}
                        submitButtonText="Lưu thay đổi"
                    />
                </AlertDialogContent>
            </AlertDialog>

            {/* Dialog xác nhận xóa */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Bài viết {blog.metadata.title} sẽ bị xóa vĩnh viễn khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isLoading ? "Đang xóa..." : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export const columns: ColumnDef<Blog>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    {
        accessorKey: "metadata.title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tiêu đề
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="font-medium">{row.original.metadata.title}</div>
        ),
    },
    {
        accessorKey: "metadata.author",
        header: "Tác giả",
        cell: ({ row }) => <div>{row.original.metadata.author}</div>,
    },
    {
        accessorKey: "metadata.publishedTime",
        header: "Ngày đăng",
        cell: ({ row }) => {
            const date = new Date(row.original.metadata.publishedTime)
            return <div>{date.toLocaleDateString('vi-VN')}</div>
        },
    },
    {
        accessorKey: "metadata.isPublished",
        header: "Trạng thái",
        cell: ({ row }) => {
            const isPublished = row.original.metadata.isPublished
            return (
                <Badge variant={isPublished ? "default" : "outline"}>
                    {isPublished ? "Đã đăng" : "Bản nháp"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "metadata.privilege",
        header: "Quyền truy cập",
        cell: ({ row }) => {
            const privilege = row.original.metadata.privilege
            return (
                <Badge variant={privilege === "registered" ? "secondary" : "outline"}>
                    {privilege === "registered" ? "Người dùng đã đăng ký" : "Miễn phí"}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ActionCell,
    },
] 
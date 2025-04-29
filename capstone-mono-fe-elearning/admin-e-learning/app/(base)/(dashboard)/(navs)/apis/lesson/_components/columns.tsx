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
import { deleteLesson, updateLesson } from "@/lib/actions/lesson"
import { toast } from "sonner"
import { LessonForm } from "./lesson-form"
import { LessonDto, UpdateLessonDto, LessonMetadataDto } from "@/lib/actions/lesson/lesson.type"

export interface Lesson {
    id: number
    slug: string
    content: string
    metadata: LessonMetadataDto
}

// Component cho Action Cell
const ActionCell = ({ row }: { row: any }) => {
    const lesson = row.original as Lesson
    const router = useRouter()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const response = await deleteLesson(lesson.id)

            if (response.success) {
                toast.success("Xóa bài học thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Xóa bài học thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa bài học")
            console.error(error)
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
            setIsPopoverOpen(false)
        }
    }

    const onSubmit = async (data: UpdateLessonDto) => {
        try {
            setIsLoading(true)
            const response = await updateLesson(lesson.id, data)

            if (response.success) {
                toast.success("Cập nhật bài học thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Cập nhật bài học thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật bài học")
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
                        <AlertDialogTitle>Chỉnh sửa bài học</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cập nhật thông tin cho bài học {lesson.metadata.title}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <LessonForm
                        mode="edit"
                        lesson={lesson as LessonDto}
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
                            Hành động này không thể hoàn tác. Bài học {lesson.metadata.title} sẽ bị xóa vĩnh viễn khỏi hệ thống.
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

export const columns: ColumnDef<Lesson>[] = [
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
        cell: ({ row }) => <div className="font-medium">{row.original.metadata.title}</div>,
    },
    {
        accessorKey: "metadata.chapter_name",
        header: "Tên chương",
        cell: ({ row }) => <div>{row.original.metadata.chapter_name}</div>,
    },
    {
        accessorKey: "metadata.author",
        header: "Tác giả",
        cell: ({ row }) => <div>{row.original.metadata.author}</div>,
    },
    {
        accessorKey: "metadata.difficulty",
        header: "Độ khó",
        cell: ({ row }) => <div>{row.original.metadata.difficulty}</div>,
    },
    {
        accessorKey: "metadata.isPublished",
        header: "Trạng thái",
        cell: ({ row }) => (
            <Badge variant={row.original.metadata.isPublished ? "default" : "outline"}>
                {row.original.metadata.isPublished ? "Đã đăng" : "Chưa đăng"}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ActionCell,
    },
] 
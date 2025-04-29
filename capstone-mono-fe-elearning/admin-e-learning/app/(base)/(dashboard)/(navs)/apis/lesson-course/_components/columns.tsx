"use client"

import React, { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash, X } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { deleteLessonCourse, updateLessonCourse } from "@/lib/actions/lesson"
import { toast } from "sonner"
import { LessonCourseForm } from "./lesson-course-form"
import { LessonCourseDto, UpdateLessonCourseDto } from "@/lib/actions/lesson/lesson.type"

export interface LessonCourse {
    lesson_id: number
    course_id: number
}

// Component cho Action Cell
const ActionCell = ({ row }: { row: any }) => {
    const lessonCourse = row.original as LessonCourse
    const router = useRouter()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const response = await deleteLessonCourse(lessonCourse.lesson_id, lessonCourse.course_id)

            if (response.success) {
                toast.success("Xóa liên kết bài học - khóa học thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Xóa liên kết bài học - khóa học thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa liên kết bài học - khóa học")
            console.error(error)
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
            setIsPopoverOpen(false)
        }
    }

    const onSubmit = async (data: UpdateLessonCourseDto) => {
        try {
            setIsLoading(true)
            const response = await updateLessonCourse(
                lessonCourse.lesson_id,
                lessonCourse.course_id,
                data
            )

            if (response.success) {
                toast.success("Cập nhật liên kết bài học - khóa học thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Cập nhật liên kết bài học - khóa học thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật liên kết bài học - khóa học")
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
                        <AlertDialogTitle>Chỉnh sửa liên kết bài học - khóa học</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cập nhật thông tin cho liên kết bài học ID: {lessonCourse.lesson_id} -
                            khóa học ID: {lessonCourse.course_id}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <LessonCourseForm
                        mode="edit"
                        lessonCourse={lessonCourse as LessonCourseDto}
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
                            Hành động này không thể hoàn tác. Liên kết bài học ID: {lessonCourse.lesson_id} -
                            khóa học ID: {lessonCourse.course_id} sẽ bị xóa vĩnh viễn khỏi hệ thống.
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

export const columns: ColumnDef<LessonCourse>[] = [
    {
        accessorKey: "lesson_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID Bài học
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.original.lesson_id}</div>,
    },
    {
        accessorKey: "course_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID Khóa học
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.original.course_id}</div>,
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ActionCell,
    },
] 
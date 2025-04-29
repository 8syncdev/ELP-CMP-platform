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
import { deleteEnrollment, updateEnrollment } from "@/lib/actions/enrollment"
import { toast } from "sonner"
import { EnrollmentForm } from "./enrollment-form"
import { EnrollmentDto, UpdateEnrollmentDto, EnrollmentStatus } from "@/lib/actions/enrollment/enrollment.type"

export interface Enrollment {
    id: number
    user_id: number
    course_id: number
    status: EnrollmentStatus
    expires_at: Date
    created_at: Date
    updated_at: Date
}

// Component cho Action Cell
const ActionCell = ({ row }: { row: any }) => {
    const enrollment = row.original as Enrollment
    const router = useRouter()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const response = await deleteEnrollment(enrollment.id)

            if (response.success) {
                toast.success("Xóa đăng ký thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Xóa đăng ký thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa đăng ký")
            console.error(error)
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
            setIsPopoverOpen(false)
        }
    }

    const onSubmit = async (data: UpdateEnrollmentDto) => {
        try {
            setIsLoading(true)
            const response = await updateEnrollment(enrollment.id, data)

            if (response.success) {
                toast.success("Cập nhật đăng ký thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Cập nhật đăng ký thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật đăng ký")
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                        <AlertDialogTitle>Chỉnh sửa đăng ký</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cập nhật thông tin cho đăng ký ID: {enrollment.id}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <EnrollmentForm
                        mode="edit"
                        enrollment={enrollment as EnrollmentDto}
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
                            Hành động này không thể hoàn tác. Đăng ký ID: {enrollment.id} sẽ bị xóa vĩnh viễn khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 relative"
                        >
                            {isLoading ? (
                                <>
                                    <span className="opacity-0">Xóa</span>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-4 w-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin"></div>
                                    </div>
                                </>
                            ) : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

// Hàm hiển thị trạng thái đăng ký
const StatusCell = ({ value }: { value: EnrollmentStatus }) => {
    let color: "default" | "secondary" | "destructive" | "outline" = "outline"
    let label = ""

    switch (value) {
        case "active":
            color = "default"
            label = "Đang hoạt động"
            break
        case "pending":
            color = "secondary"
            label = "Đang chờ"
            break
        case "expired":
            color = "destructive"
            label = "Hết hạn"
            break
        case "cancelled":
            color = "outline"
            label = "Đã hủy"
            break
    }

    return <Badge variant={color} className="justify-center w-full transition-all duration-200 animate-in fade-in-50">{label}</Badge>
}

// Hàm định dạng ngày tháng
const DateCell = ({ value }: { value: Date }) => {
    const date = new Date(value)
    return <div className="text-center text-sm transition-all duration-200 animate-in fade-in-50">{date.toLocaleDateString('vi-VN')}</div>
}

// Hàm hiển thị ID đơn giản
const IdCell = ({ value }: { value: number }) => {
    return <div className="text-center font-medium text-sm bg-muted/30 py-1 rounded-md transition-all duration-200 animate-in fade-in-50">{value}</div>
}

export const columns: ColumnDef<Enrollment>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <IdCell value={row.original.id} />,
    },
    {
        accessorKey: "user_id",
        header: "ID Người dùng",
        cell: ({ row }) => <IdCell value={row.original.user_id} />,
    },
    {
        accessorKey: "course_id",
        header: "ID Khóa học",
        cell: ({ row }) => <IdCell value={row.original.course_id} />,
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <StatusCell value={row.original.status} />,
    },
    {
        accessorKey: "expires_at",
        header: "Ngày hết hạn",
        cell: ({ row }) => <DateCell value={row.original.expires_at} />,
    },
    {
        accessorKey: "created_at",
        header: "Ngày tạo",
        cell: ({ row }) => <DateCell value={row.original.created_at} />,
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ActionCell,
    },
] 
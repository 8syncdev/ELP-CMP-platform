"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash, X, Calendar, Mail, Phone, User as UserIcon } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { UsersDto, UpdateUsersDto } from "@/lib/actions/user/user.type"
import { useState } from "react"
import { deleteUser, updateUser } from "@/lib/actions/user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
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
import { UserForm } from "./user-form"

// Mở rộng UsersDto để thêm trường role
export type User = UsersDto & {
    // Xóa trường role vì không cần thiết nữa
}

// Component cho Action Cell
const ActionCell = ({ row }: { row: any }) => {
    const user = row.original as User
    const router = useRouter()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const response = await deleteUser(user.id)

            if (response.success) {
                toast.success("Xóa người dùng thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Xóa người dùng thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa người dùng")
            console.error(error)
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
            setIsPopoverOpen(false)
        }
    }

    const onSubmit = async (data: UpdateUsersDto) => {
        try {
            setIsLoading(true)
            // Loại bỏ trường username nếu không thay đổi
            if (data.username === user.username) {
                delete data.username;
            }
            // Loại bỏ trường password nếu trống
            if (!data.password) {
                delete data.password;
            }

            const response = await updateUser(user.id, data)

            if (response.success) {
                toast.success("Cập nhật người dùng thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Cập nhật người dùng thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật người dùng")
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
                        <AlertDialogTitle>Chỉnh sửa người dùng</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cập nhật thông tin cho người dùng {user.username}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <UserForm
                        mode="edit"
                        user={user}
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
                            Hành động này không thể hoàn tác. Người dùng {user.username} sẽ bị xóa vĩnh viễn khỏi hệ thống.
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

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "username",
        header: "Tên người dùng",
        cell: ({ row }) => {
            const user = row.original
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.full_name || user.username} />
                        <AvatarFallback>{(user.full_name || user.username).charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{user.full_name || user.username}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            return <div className="text-sm">{row.original.email}</div>
        },
    },
    {
        accessorKey: "phone",
        header: "Số điện thoại",
        cell: ({ row }) => {
            return <div className="text-sm">{row.original.phone}</div>
        },
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const user = row.original
            let status = "active"

            if (user.is_deleted) {
                status = "inactive"
            } else if (user.is_blocked || user.is_suspended || !user.is_active) {
                status = "inactive"
            }

            return (
                <Badge variant={status === "active" ? "default" : "destructive"}>
                    {status === "active" ? "Hoạt động" : "Không hoạt động"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: "Ngày tạo",
        cell: ({ row }) => {
            const date = row.original.created_at ? new Date(row.original.created_at) : new Date()
            return <div>{date.toLocaleDateString("vi-VN")}</div>
        },
    },
    {
        id: "actions",
        cell: ActionCell
    },
] 
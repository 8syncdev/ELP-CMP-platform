"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash, X, UserCheck } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { UserRoleDto } from "@/lib/actions/role/role.type"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteUserRole, updateUserRole, createUserRole } from "@/lib/actions/role"
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
import { UserRoleForm } from "./user-role-form"
import { Min } from "@/lib/actions/base.dto"

// Mở rộng UserRoleDto nếu cần
export type UserRole = UserRoleDto & {
    // Các trường bổ sung nếu cần
}

// Component cho Action Cell
const ActionCell = ({ row }: { row: any }) => {
    const userRole = row.original as UserRole
    const router = useRouter()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const response = await deleteUserRole(userRole.userId, userRole.roleId)

            if (response.success) {
                toast.success("Xóa vai trò người dùng thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Xóa vai trò người dùng thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa vai trò người dùng")
            console.error(error)
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
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
                    <div className="p-2 flex flex-col gap-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm"
                            onClick={() => {
                                setIsEditFormOpen(true)
                                setIsPopoverOpen(false)
                            }}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm text-destructive"
                            onClick={() => {
                                setIsDeleteDialogOpen(true)
                                setIsPopoverOpen(false)
                            }}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Xóa
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Form chỉnh sửa */}
            <AlertDialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
                <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Chỉnh sửa vai trò người dùng</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cập nhật thông tin vai trò cho người dùng ID: {userRole.userId}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <UserRoleForm
                        mode="edit"
                        userRole={userRole}
                        isLoading={isLoading}
                        onSubmit={async (data) => {
                            try {
                                if (data.userId !== userRole.userId || data.roleId !== userRole.roleId) {
                                    setIsLoading(true)
                                    // Xóa bản ghi cũ
                                    const deleteResponse = await deleteUserRole(userRole.userId, userRole.roleId)

                                    if (deleteResponse.success) {
                                        // Tạo bản ghi mới
                                        const createResponse = await createUserRole({
                                            userId: data.userId as number & Min<1>,
                                            roleId: data.roleId as number & Min<1>
                                        })

                                        if (createResponse.success) {
                                            toast.success("Cập nhật vai trò người dùng thành công")
                                            setIsEditFormOpen(false)
                                            router.refresh()
                                        } else {
                                            toast.error(createResponse.message || "Cập nhật vai trò người dùng thất bại")
                                        }
                                    } else {
                                        toast.error(deleteResponse.message || "Không thể xóa vai trò người dùng hiện tại")
                                    }
                                } else {
                                    toast.info("Không có thay đổi nào được thực hiện")
                                    setIsEditFormOpen(false)
                                }
                            } catch (error) {
                                toast.error("Đã xảy ra lỗi khi cập nhật vai trò người dùng")
                                console.error(error)
                            } finally {
                                setIsLoading(false)
                            }
                        }}
                        onCancel={() => setIsEditFormOpen(false)}
                        submitButtonText="Cập nhật"
                    />
                </AlertDialogContent>
            </AlertDialog>

            {/* Hộp thoại xác nhận xóa */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa vai trò của người dùng. Bạn không thể hoàn tác sau khi xóa.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
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

export const columns: ColumnDef<UserRole>[] = [
    {
        accessorKey: "userId",
        header: "ID Người dùng",
        cell: ({ row }) => {
            return <Badge variant="outline">{row.original.userId}</Badge>
        },
    },
    {
        accessorKey: "roleId",
        header: "ID Vai trò",
        cell: ({ row }) => {
            return <Badge variant="outline">{row.original.roleId}</Badge>
        },
    },
    {
        id: "actions",
        cell: ActionCell
    },
] 
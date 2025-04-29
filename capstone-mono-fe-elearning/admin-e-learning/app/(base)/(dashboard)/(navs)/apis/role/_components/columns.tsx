"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash, X, Users } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { RoleDto } from "@/lib/actions/role/role.type"
import { useState } from "react"
import { deleteRole, updateRole } from "@/lib/actions/role"
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
import { RoleForm } from "./role-form"

// Component cho Action Cell
const ActionCell = ({ row }: { row: any }) => {
    const role = row.original as RoleDto
    const router = useRouter()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const response = await deleteRole(role.id)

            if (response.success) {
                toast.success("Xóa vai trò thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Xóa vai trò thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa vai trò")
            console.error(error)
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
            setIsPopoverOpen(false)
        }
    }

    const onSubmit = async (data: any) => {
        try {
            setIsLoading(true)
            const response = await updateRole(role.id, data)

            if (response.success) {
                toast.success("Cập nhật vai trò thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Cập nhật vai trò thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật vai trò")
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
                        <AlertDialogTitle>Chỉnh sửa vai trò</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cập nhật thông tin cho vai trò {role.name}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <RoleForm
                        mode="edit"
                        role={role}
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
                            Hành động này không thể hoàn tác. Vai trò {role.name} sẽ bị xóa vĩnh viễn khỏi hệ thống.
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

export const columns: ColumnDef<RoleDto>[] = [
    {
        accessorKey: "name",
        header: "Tên vai trò",
        cell: ({ row }) => {
            const role = row.original
            return (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md flex items-center justify-center bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium">{role.name}</p>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => {
            return <div className="text-sm max-w-[300px] truncate">{row.original.description}</div>
        },
    },
    {
        accessorKey: "id",
        header: "ID Vai trò",
        cell: ({ row }) => {
            return <Badge variant="outline">{row.original.id}</Badge>
        },
    },
    {
        id: "actions",
        cell: ActionCell
    },
] 
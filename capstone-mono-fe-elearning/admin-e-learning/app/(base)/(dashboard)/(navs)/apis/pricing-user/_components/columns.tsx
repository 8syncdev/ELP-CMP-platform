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
import { deletePricingUser, updatePricingUser } from "@/lib/actions/pricing"
import { toast } from "sonner"
import { PricingUserForm } from "./pricing-user-form"
import { PricingUserDto, UpdatePricingUserDto } from "@/lib/actions/pricing"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export interface PricingUser {
    pricing_id: number
    user_id: number
    expires_at: Date
    status: string
    created_at: Date
    updated_at: Date
    // Additional properties from related pricing
    pricing_name?: string
    user_name?: string
}

// Component for Action Cell
const ActionCell = ({ row }: { row: any }) => {
    const pricingUser = row.original as PricingUser
    const router = useRouter()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setIsLoading(true)
            const response = await deletePricingUser(pricingUser.pricing_id, pricingUser.user_id)

            if (response.success) {
                toast.success("Xóa đăng ký gói giá thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Xóa đăng ký gói giá thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa đăng ký gói giá")
            console.error(error)
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
            setIsPopoverOpen(false)
        }
    }

    const onSubmit = async (data: UpdatePricingUserDto) => {
        try {
            setIsLoading(true)
            const response = await updatePricingUser(
                pricingUser.pricing_id,
                pricingUser.user_id,
                data
            )

            if (response.success) {
                toast.success("Cập nhật đăng ký gói giá thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Cập nhật đăng ký gói giá thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật đăng ký gói giá")
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

            {/* Edit Form */}
            <AlertDialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
                <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Chỉnh sửa đăng ký gói giá</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cập nhật thông tin đăng ký gói giá cho người dùng
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <PricingUserForm
                        mode="edit"
                        pricingUser={pricingUser as PricingUserDto}
                        isLoading={isLoading}
                        onSubmit={onSubmit}
                        onCancel={() => setIsEditFormOpen(false)}
                        submitButtonText="Lưu thay đổi"
                    />
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Đăng ký gói giá này sẽ bị xóa vĩnh viễn khỏi hệ thống.
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

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyle = () => {
        switch (status) {
            case "active":
                return "bg-green-50 text-green-700 border-green-300 hover:bg-green-100";
            case "inactive":
                return "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100";
            case "expired":
                return "bg-red-50 text-red-700 border-red-300 hover:bg-red-100";
            case "pending":
                return "bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100";
            default:
                return "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100";
        }
    };

    const getStatusLabel = () => {
        switch (status) {
            case "active":
                return "Hoạt động";
            case "inactive":
                return "Không hoạt động";
            case "expired":
                return "Hết hạn";
            case "pending":
                return "Đang chờ";
            default:
                return status;
        }
    };

    return (
        <Badge variant="outline" className={getStatusStyle()}>
            {getStatusLabel()}
        </Badge>
    );
};

export const columns: ColumnDef<PricingUser>[] = [
    {
        accessorKey: "pricing_id",
        header: "ID Gói Giá",
        cell: ({ row }) => <div className="font-medium">{row.original.pricing_id}</div>,
    },
    {
        accessorKey: "user_id",
        header: "ID Người dùng",
        cell: ({ row }) => <div className="font-medium">{row.original.user_id}</div>,
    },
    {
        accessorKey: "expires_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ngày hết hạn
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>
            {row.original.expires_at ?
                format(new Date(row.original.expires_at), 'dd/MM/yyyy', { locale: vi }) :
                "N/A"}
        </div>,
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
        accessorKey: "created_at",
        header: "Ngày tạo",
        cell: ({ row }) => <div>
            {format(new Date(row.original.created_at), 'dd/MM/yyyy', { locale: vi })}
        </div>,
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell row={row} />,
    },
] 
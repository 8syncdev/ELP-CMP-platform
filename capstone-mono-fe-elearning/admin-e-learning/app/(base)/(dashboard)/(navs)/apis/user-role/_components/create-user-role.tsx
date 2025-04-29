"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { createUserRole, CreateUserRoleDto, UpdateUserRoleDto } from "@/lib/actions/role"
import { UserRoleForm } from "./user-role-form"
import { useRouter } from "next/navigation"

export function CreateUserRole() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (data: CreateUserRoleDto | UpdateUserRoleDto) => {
        try {
            setIsLoading(true)
            const response = await createUserRole(data as CreateUserRoleDto)

            if (response.success) {
                toast.success("Tạo vai trò người dùng thành công")
                setIsDialogOpen(false)
                router.refresh()
            } else {
                toast.error(response.message || "Tạo vai trò người dùng thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tạo vai trò người dùng")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm vai trò người dùng
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Thêm vai trò người dùng mới</DialogTitle>
                </DialogHeader>

                <UserRoleForm
                    mode="create"
                    isLoading={isLoading}
                    onSubmit={onSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                    submitButtonText="Tạo vai trò người dùng"
                />
            </DialogContent>
        </Dialog>
    )
} 
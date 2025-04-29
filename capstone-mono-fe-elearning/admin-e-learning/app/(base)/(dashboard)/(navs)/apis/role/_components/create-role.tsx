"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { createRole, CreateRoleDto, UpdateRoleDto } from "@/lib/actions/role"
import { RoleForm } from "./role-form"
import { useRouter } from "next/navigation"

export function CreateRole() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (data: CreateRoleDto | UpdateRoleDto) => {
        try {
            setIsLoading(true)
            const response = await createRole(data as CreateRoleDto)
            if (response.success) {
                toast.success("Vai trò đã được tạo thành công")
                setIsDialogOpen(false)
                router.refresh()
            } else {
                toast.error(response.message || "Tạo vai trò thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tạo vai trò")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-right-5 duration-300">
                    <Plus className="h-4 w-4" /> Thêm vai trò
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                <DialogHeader>
                    <DialogTitle>Tạo vai trò mới</DialogTitle>
                </DialogHeader>

                <RoleForm
                    mode="create"
                    isLoading={isLoading}
                    onSubmit={onSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                    submitButtonText="Tạo vai trò"
                />
            </DialogContent>
        </Dialog>
    )
} 
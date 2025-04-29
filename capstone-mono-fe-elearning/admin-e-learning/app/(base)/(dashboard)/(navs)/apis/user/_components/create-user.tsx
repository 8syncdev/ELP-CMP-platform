"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { createUser, CreateUsersDto, UpdateUsersDto } from "@/lib/actions/user"
import { UserForm } from "./user-form"
import { useRouter } from "next/navigation"

export function CreateUser() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (data: CreateUsersDto | UpdateUsersDto) => {
        try {
            setIsLoading(true)
            const response = await createUser(data as CreateUsersDto)
            if (response.success) {
                toast.success("Người dùng đã được tạo thành công")
                setIsDialogOpen(false)
                router.refresh()
            } else {
                toast.error(response.message || "Tạo người dùng thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tạo người dùng")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-right-5 duration-300">
                    <Plus className="h-4 w-4" /> Thêm người dùng
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                <DialogHeader>
                    <DialogTitle>Tạo người dùng mới</DialogTitle>
                </DialogHeader>

                <UserForm
                    mode="create"
                    isLoading={isLoading}
                    onSubmit={onSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                    submitButtonText="Tạo người dùng"
                />
            </DialogContent>
        </Dialog>
    )
} 
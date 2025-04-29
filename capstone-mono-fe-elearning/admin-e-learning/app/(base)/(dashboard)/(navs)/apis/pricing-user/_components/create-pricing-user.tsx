"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { PricingUserForm } from './pricing-user-form'
import { createPricingUserId, UpdatePricingUserDto } from '@/lib/actions/pricing'

export function CreatePricingUser() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data: UpdatePricingUserDto) => {
        try {
            setIsLoading(true)
            if (typeof data.pricing_id !== 'number' || typeof data.user_id !== 'number') {
                toast.error('Vui lòng chọn gói giá và người dùng')
                setIsLoading(false)
                return
            }

            const response = await createPricingUserId(data.pricing_id, data.user_id)

            if (response.success) {
                toast.success('Đăng ký gói giá thành công')
                router.refresh()
                setIsOpen(false)
            } else {
                toast.error(response.message || 'Đăng ký gói giá thất bại')
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi đăng ký gói giá')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Thêm đăng ký gói giá
            </Button>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Đăng ký gói giá mới</AlertDialogTitle>
                        <AlertDialogDescription>
                            Chọn gói giá và người dùng để tạo đăng ký mới
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <PricingUserForm
                        mode="create"
                        isLoading={isLoading}
                        onSubmit={onSubmit}
                        onCancel={() => setIsOpen(false)}
                        submitButtonText="Tạo đăng ký"
                    />
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
} 
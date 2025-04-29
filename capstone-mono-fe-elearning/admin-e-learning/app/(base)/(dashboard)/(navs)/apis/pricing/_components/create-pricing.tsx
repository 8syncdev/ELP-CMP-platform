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
import { PricingForm } from './pricing-form'
import { createPricing } from '@/lib/actions/pricing'
import { CreatePricingDto, UpdatePricingDto } from '@/lib/actions/pricing'

export function CreatePricing() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data: CreatePricingDto | UpdatePricingDto) => {
        try {
            setIsLoading(true)
            const response = await createPricing(data as CreatePricingDto)

            if (response.success) {
                toast.success('Tạo gói giá thành công')
                router.refresh()
                setIsOpen(false)
            } else {
                toast.error(response.message || 'Tạo gói giá thất bại')
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi tạo gói giá')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Thêm gói giá
            </Button>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tạo gói giá mới</AlertDialogTitle>
                        <AlertDialogDescription>
                            Nhập thông tin cho gói giá mới
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <PricingForm
                        mode="create"
                        isLoading={isLoading}
                        onSubmit={onSubmit}
                        onCancel={() => setIsOpen(false)}
                        submitButtonText="Tạo gói giá"
                    />
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
} 
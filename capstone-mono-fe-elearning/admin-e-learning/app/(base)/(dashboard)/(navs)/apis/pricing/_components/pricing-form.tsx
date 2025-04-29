"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { PricingDto, CreatePricingDto, UpdatePricingDto } from '@/lib/actions/pricing'

// Validation schema
const pricingSchema = z.object({
    name: z.string().min(1, 'Tên gói giá không được để trống').max(255, 'Tên gói giá tối đa 255 ký tự'),
    description: z.string().min(1, 'Mô tả không được để trống'),
    price: z.coerce.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
    type_payment: z.string().min(1, 'Loại thanh toán không được để trống').max(255, 'Loại thanh toán tối đa 255 ký tự'),
    sale: z.coerce.number().min(0, 'Giảm giá phải lớn hơn hoặc bằng 0').max(100, 'Giảm giá không được vượt quá 100%'),
})

interface PricingFormProps {
    mode: 'create' | 'edit'
    pricing?: PricingDto
    isLoading: boolean
    onSubmit: (data: CreatePricingDto | UpdatePricingDto) => Promise<void>
    onCancel: () => void
    submitButtonText: string
}

export function PricingForm({
    mode,
    pricing,
    isLoading,
    onSubmit,
    onCancel,
    submitButtonText,
}: PricingFormProps) {
    const form = useForm<z.infer<typeof pricingSchema>>({
        resolver: zodResolver(pricingSchema),
        defaultValues: {
            name: pricing?.name || '',
            description: pricing?.description || '',
            price: pricing?.price || 0,
            type_payment: pricing?.type_payment || '',
            sale: pricing?.sale || 0,
        },
    })

    const handleSubmit = async (values: z.infer<typeof pricingSchema>) => {
        if (mode === 'edit' && pricing) {
            await onSubmit({
                id: pricing.id,
                ...values,
            } as UpdatePricingDto)
        } else {
            await onSubmit(values as unknown as CreatePricingDto)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên gói giá</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập tên gói giá" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Nhập mô tả về gói giá"
                                    className="resize-none"
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giá</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập giá"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sale"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giảm giá (%)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập % giảm giá"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="type_payment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Loại thanh toán</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại thanh toán" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="monthly">Hàng tháng</SelectItem>
                                    <SelectItem value="yearly">Hàng năm</SelectItem>
                                    <SelectItem value="lifetime">Trọn đời</SelectItem>
                                    <SelectItem value="one_time">Một lần</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : submitButtonText}
                    </Button>
                </div>
            </form>
        </Form>
    )
} 
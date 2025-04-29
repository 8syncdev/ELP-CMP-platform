"use client"

import React, { useState, useEffect } from 'react'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { vi } from 'date-fns/locale'
import { PricingUserDto, UpdatePricingUserDto, getPricings, PricingDto } from '@/lib/actions/pricing'
import { getUsers, UsersDto } from '@/lib/actions/user'

// Validation schema
const pricingUserSchema = z.object({
    pricing_id: z.coerce.number().min(1, 'ID gói giá không hợp lệ'),
    user_id: z.coerce.number().min(1, 'ID người dùng không hợp lệ'),
    expires_at: z.date({
        required_error: "Vui lòng chọn ngày hết hạn",
    }),
    status: z.enum(["active", "inactive", "expired", "pending"], {
        required_error: "Vui lòng chọn trạng thái",
    }),
})

interface PricingUserFormProps {
    mode: 'create' | 'edit'
    pricingUser?: PricingUserDto
    isLoading: boolean
    onSubmit: (data: UpdatePricingUserDto) => Promise<void>
    onCancel: () => void
    submitButtonText: string
}

export function PricingUserForm({
    mode,
    pricingUser,
    isLoading,
    onSubmit,
    onCancel,
    submitButtonText,
}: PricingUserFormProps) {
    const [pricings, setPricings] = useState<PricingDto[]>([])
    const [users, setUsers] = useState<UsersDto[]>([])
    const [isLoadingData, setIsLoadingData] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pricingsResponse, usersResponse] = await Promise.all([
                    getPricings(),
                    getUsers(1, 100),
                ])

                setPricings((pricingsResponse.result as PricingDto[]) || [])
                setUsers((usersResponse.result as UsersDto[]) || [])
            } catch (error) {
                console.error('Error fetching form data:', error)
            } finally {
                setIsLoadingData(false)
            }
        }

        fetchData()
    }, [])

    const form = useForm<z.infer<typeof pricingUserSchema>>({
        resolver: zodResolver(pricingUserSchema),
        defaultValues: {
            pricing_id: pricingUser?.pricing_id || 0,
            user_id: pricingUser?.user_id || 0,
            expires_at: pricingUser?.expires_at ? new Date(pricingUser.expires_at) : new Date(),
            status: (pricingUser?.status as "active" | "inactive" | "expired" | "pending") || "pending",
        },
    })

    const handleSubmit = async (values: z.infer<typeof pricingUserSchema>) => {
        await onSubmit(values as unknown as UpdatePricingUserDto)
    }

    if (isLoadingData) {
        return <div className="text-center py-4">Đang tải dữ liệu...</div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="pricing_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gói giá</FormLabel>
                            <Select
                                disabled={mode === 'edit'}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                defaultValue={field.value.toString()}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn gói giá" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {pricings.map((pricing) => (
                                        <SelectItem key={pricing.id} value={pricing.id.toString()}>
                                            {pricing.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Người dùng</FormLabel>
                            <Select
                                disabled={mode === 'edit'}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                defaultValue={field.value.toString()}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn người dùng" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.full_name || user.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="expires_at"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Ngày hết hạn</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "dd/MM/yyyy", { locale: vi })
                                            ) : (
                                                <span>Chọn ngày</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Trạng thái</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="active">Hoạt động</SelectItem>
                                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                                    <SelectItem value="expired">Hết hạn</SelectItem>
                                    <SelectItem value="pending">Đang chờ</SelectItem>
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
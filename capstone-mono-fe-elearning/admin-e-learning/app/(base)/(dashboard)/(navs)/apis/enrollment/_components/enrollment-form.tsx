"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { createEnrollment, updateEnrollment } from "@/lib/actions/enrollment"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { EnrollmentDto, EnrollmentStatus } from "@/lib/actions/enrollment/enrollment.type"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Min } from "@/lib/actions/base.dto"

// Định nghĩa schema validation
const formSchema = z.object({
    user_id: z.coerce.number().int().positive({
        message: "ID người dùng phải là số nguyên dương",
    }),
    course_id: z.coerce.number().int().positive({
        message: "ID khóa học phải là số nguyên dương",
    }),
    status: z.enum(["pending", "active", "expired", "cancelled"], {
        required_error: "Vui lòng chọn trạng thái",
    }),
    expires_at: z.date({
        required_error: "Vui lòng chọn ngày hết hạn",
    }),
})

interface EnrollmentFormProps {
    mode: "create" | "edit"
    enrollment?: EnrollmentDto
    isLoading?: boolean
    onCancel: () => void
    onSubmit?: (data: any) => void
    submitButtonText?: string
}

export function EnrollmentForm({
    mode,
    enrollment,
    isLoading = false,
    onCancel,
    onSubmit,
    submitButtonText = "Tạo mới",
}: EnrollmentFormProps) {
    const router = useRouter()

    // Khởi tạo form với giá trị mặc định
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: enrollment ? {
            user_id: enrollment.user_id,
            course_id: enrollment.course_id,
            status: enrollment.status,
            expires_at: new Date(enrollment.expires_at),
        } : {
            user_id: 0,
            course_id: 0,
            status: "pending" as EnrollmentStatus,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày sau
        },
    })

    // Xử lý khi submit form
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (mode === "create") {
            try {
                // Gọi API tạo mới
                const response = await createEnrollment({
                    ...values,
                    user_id: values.user_id as number & Min<1>,
                    course_id: values.course_id as number & Min<1>,
                    created_at: new Date(),
                    updated_at: new Date()
                })

                if (response.success) {
                    toast.success("Tạo đăng ký thành công")
                    router.refresh()
                    onCancel()
                } else {
                    toast.error(response.message || "Tạo đăng ký thất bại")
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi tạo đăng ký")
                console.error(error)
            }
        } else if (mode === "edit" && onSubmit) {
            // Xử lý chức năng edit
            onSubmit(values)
        }
    }

    const statusOptions = [
        { value: "pending", label: "Đang chờ" },
        { value: "active", label: "Đang hoạt động" },
        { value: "expired", label: "Hết hạn" },
        { value: "cancelled", label: "Đã hủy" },
    ]

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="user_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Người dùng</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Nhập ID người dùng"
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="course_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Khóa học</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Nhập ID khóa học"
                                        disabled={isLoading}
                                    />
                                </FormControl>
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
                                    disabled={isLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
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
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                disabled={isLoading}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: vi })
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
                                            initialFocus
                                            disabled={isLoading}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="relative"
                    >
                        {isLoading ? (
                            <>
                                <span className="opacity-0">{submitButtonText}</span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                </div>
                            </>
                        ) : submitButtonText}
                    </Button>
                </div>
            </form>
        </Form>
    )
} 
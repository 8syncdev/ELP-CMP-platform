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
import { Input } from "@/components/ui/input"
import { createLessonCourse, updateLessonCourse } from "@/lib/actions/lesson"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LessonCourseDto } from "@/lib/actions/lesson/lesson.type"

// Định nghĩa schema validation
const formSchema = z.object({
    lesson_id: z.coerce.number().int().positive({
        message: "ID bài học phải là số nguyên dương",
    }),
    course_id: z.coerce.number().int().positive({
        message: "ID khóa học phải là số nguyên dương",
    }),
})

interface LessonCourseFormProps {
    mode: "create" | "edit"
    lessonCourse?: LessonCourseDto
    isLoading?: boolean
    onCancel: () => void
    onSubmit?: (data: any) => void
    submitButtonText?: string
}

export function LessonCourseForm({
    mode,
    lessonCourse,
    isLoading = false,
    onCancel,
    onSubmit,
    submitButtonText = "Tạo mới",
}: LessonCourseFormProps) {
    const router = useRouter()

    // Khởi tạo form với giá trị mặc định
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lesson_id: lessonCourse ? lessonCourse.lesson_id : 0,
            course_id: lessonCourse ? lessonCourse.course_id : 0,
        },
    })

    // Xử lý khi submit form
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (mode === "create") {
            try {
                // Gọi API tạo mới
                const response = await createLessonCourse(values)

                if (response.success) {
                    toast.success("Tạo liên kết bài học - khóa học thành công")
                    router.refresh()
                    onCancel()
                } else {
                    toast.error(response.message || "Tạo liên kết bài học - khóa học thất bại")
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi tạo liên kết bài học - khóa học")
                console.error(error)
            }
        } else if (mode === "edit" && onSubmit) {
            // Xử lý chức năng edit
            onSubmit(values)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="lesson_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Bài học</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Nhập ID bài học"
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
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : submitButtonText}
                    </Button>
                </div>
            </form>
        </Form>
    )
} 
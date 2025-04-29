"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseDto, CreateCourseDto, UpdateCourseDto } from "@/lib/actions/course/course.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Hàm tạo slug từ tên
const generateSlug = (text: string) => {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
}

// Schema cho form tạo khóa học
const createCourseSchema = z.object({
    slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự").max(100, "Slug không được vượt quá 100 ký tự"),
    content: z.string().default(""),
    metadata: z.object({
        name: z.string().min(5, "Tên khóa học phải có ít nhất 5 ký tự").max(100, "Tên khóa học không được vượt quá 100 ký tự"),
        description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
        instructor_name: z.string().min(3, "Tên giảng viên phải có ít nhất 3 ký tự"),
        instructor_contact: z.string().default(""),
        instructor_email: z.string().email("Email không hợp lệ").max(100, "Email không được vượt quá 100 ký tự"),
        instructor_avatar: z.string().default(""),
        duration: z.string().default(""),
        level: z.enum(["Foundation", "Medium", "Advance"]).default("Foundation"),
        type: z.enum(["website", "zoom", "youtube"]).default("website"),
        original_price: z.coerce.number().min(0, "Giá không được âm"),
        discounted_price: z.coerce.number().min(0, "Giá không được âm").default(0),
        thumbnail: z.string().default(""),
        published_at: z.string().default(""),
        is_published: z.boolean().default(false),
    })
})

// Schema cho form chỉnh sửa (optional fields)
const editCourseSchema = z.object({
    slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự").max(100, "Slug không được vượt quá 100 ký tự"),
    content: z.string().optional(),
    metadata: z.object({
        name: z.string().min(5, "Tên khóa học phải có ít nhất 5 ký tự").max(100, "Tên khóa học không được vượt quá 100 ký tự"),
        description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
        instructor_name: z.string().min(3, "Tên giảng viên phải có ít nhất 3 ký tự"),
        instructor_contact: z.string().optional(),
        instructor_email: z.string().email("Email không hợp lệ").max(100, "Email không được vượt quá 100 ký tự"),
        instructor_avatar: z.string().optional(),
        duration: z.string().optional(),
        level: z.enum(["Foundation", "Medium", "Advance"]).default("Foundation"),
        type: z.enum(["website", "zoom", "youtube"]).default("website"),
        original_price: z.coerce.number().min(0, "Giá không được âm"),
        discounted_price: z.coerce.number().min(0, "Giá không được âm").optional(),
        thumbnail: z.string().optional(),
        published_at: z.string().optional(),
        is_published: z.boolean().optional(),
    })
})

type CreateCourseFormValues = z.infer<typeof createCourseSchema>
type EditCourseFormValues = z.infer<typeof editCourseSchema>

type CourseFormProps = {
    mode: 'create' | 'edit';
    course?: CourseDto;
    isLoading: boolean;
    onSubmit: (data: CreateCourseDto | UpdateCourseDto) => void;
    onCancel: () => void;
    submitButtonText?: string;
    cancelButtonText?: string;
    showFooter?: boolean;
}

export function CourseForm({
    mode,
    course,
    isLoading,
    onSubmit,
    onCancel,
    submitButtonText = "Lưu",
    cancelButtonText = "Hủy",
    showFooter = true
}: CourseFormProps) {
    const [thumbnailPreview, setThumbnailPreview] = useState(course?.metadata.thumbnail || "")

    // Chuyển đổi giá trị level và type cũ sang giá trị mới
    const mapLevelValue = (value: string): "Foundation" | "Medium" | "Advance" => {
        if (value === "Beginner") return "Foundation"
        if (value === "Intermediate") return "Medium"
        if (value === "Advanced") return "Advance"
        return value as "Foundation" | "Medium" | "Advance"
    }

    const mapTypeValue = (value: string): "website" | "zoom" | "youtube" => {
        if (value === "Online") return "website"
        if (value === "Offline") return "zoom"
        if (value === "Hybrid") return "youtube"
        return value as "website" | "zoom" | "youtube"
    }

    const form = useForm<CreateCourseFormValues | EditCourseFormValues>({
        resolver: zodResolver(mode === 'create' ? createCourseSchema : editCourseSchema),
        defaultValues: {
            slug: course?.slug || "",
            content: course?.content || "",
            metadata: {
                name: course?.metadata.name || "",
                description: course?.metadata.description || "",
                instructor_name: course?.metadata.instructor_name || "",
                instructor_contact: course?.metadata.instructor_contact || "",
                instructor_email: course?.metadata.instructor_email || "",
                instructor_avatar: course?.metadata.instructor_avatar || "",
                duration: course?.metadata.duration || "",
                level: course?.metadata.level ? mapLevelValue(course.metadata.level) : "Foundation",
                type: course?.metadata.type ? mapTypeValue(course.metadata.type) : "website",
                original_price: course?.metadata.original_price || 0,
                discounted_price: course?.metadata.discounted_price || 0,
                thumbnail: course?.metadata.thumbnail || "",
                published_at: course?.metadata.published_at || new Date().toISOString(),
                is_published: course?.metadata.is_published || false,
            }
        }
    })

    // Xem trước thumbnail khi nhập URL
    const watchThumbnail = form.watch("metadata.thumbnail")
    const watchName = form.watch("metadata.name")

    // Tự động tạo slug khi tên khóa học thay đổi
    useEffect(() => {
        if (mode === 'create' && watchName) {
            form.setValue("slug", generateSlug(watchName))
        }
    }, [watchName, form, mode])

    useEffect(() => {
        if (watchThumbnail !== thumbnailPreview) {
            setThumbnailPreview(watchThumbnail || "")
        }
    }, [watchThumbnail, thumbnailPreview])

    const handleSubmit = (data: CreateCourseFormValues | EditCourseFormValues) => {
        onSubmit(data as CreateCourseDto | UpdateCourseDto)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                        <TabsTrigger value="instructor">Giảng viên</TabsTrigger>
                        <TabsTrigger value="details">Chi tiết khóa học</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4 animate-in fade-in-0 slide-in-from-left-3 duration-200">
                        {/* Hiển thị thumbnail preview */}
                        {thumbnailPreview && (
                            <div className="w-full aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                                <img
                                    src={thumbnailPreview}
                                    alt={course?.metadata.name || watchName || "Thumbnail"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://placehold.co/600x400?text=No+Image"
                                    }}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="metadata.name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên khóa học <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập tên khóa học" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ten-khoa-hoc"
                                                    {...field}
                                                    disabled={true}
                                                    className="bg-muted"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Slug được tạo tự động từ tên khóa học
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="metadata.description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mô tả <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Nhập mô tả khóa học"
                                                    {...field}
                                                    rows={5}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="metadata.thumbnail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thumbnail URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập URL hình ảnh thumbnail" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                URL hình ảnh thumbnail cho khóa học
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="instructor" className="space-y-4 animate-in fade-in-0 slide-in-from-left-3 duration-200">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="metadata.instructor_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên giảng viên <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập tên giảng viên" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="metadata.instructor_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email giảng viên <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập email giảng viên" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="metadata.instructor_contact"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Liên hệ giảng viên</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập thông tin liên hệ" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="metadata.instructor_avatar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Avatar giảng viên</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập URL avatar giảng viên" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4 animate-in fade-in-0 slide-in-from-left-3 duration-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="metadata.level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cấp độ</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn cấp độ khóa học" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Foundation">Foundation</SelectItem>
                                                    <SelectItem value="Medium">Medium</SelectItem>
                                                    <SelectItem value="Advance">Advance</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="metadata.type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Loại khóa học</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn loại khóa học" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="website">Website</SelectItem>
                                                    <SelectItem value="zoom">Zoom</SelectItem>
                                                    <SelectItem value="youtube">Youtube</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="metadata.duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Thời lượng</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ví dụ: 8 tuần, 24 giờ..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="metadata.original_price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Giá gốc <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Nhập giá gốc" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="metadata.discounted_price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Giá ưu đãi</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Nhập giá ưu đãi" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="metadata.is_published"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Trạng thái đăng</FormLabel>
                                                <FormDescription>
                                                    Khóa học sẽ {field.value ? "" : "không"} được hiển thị công khai
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nội dung khóa học</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Nhập nội dung chi tiết khóa học"
                                                    {...field}
                                                    rows={8}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {showFooter && (
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                            {cancelButtonText}
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Đang xử lý..." : submitButtonText}
                        </Button>
                    </div>
                )}
            </form>
        </Form>
    )
} 
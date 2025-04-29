"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LessonDto, CreateLessonDto, UpdateLessonDto } from "@/lib/actions/lesson/lesson.type"
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
import { getChaptersByCoursesSlug } from "@/lib/actions/lesson"

// Hàm tạo slug từ tiêu đề
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

// Schema cho form tạo bài học
const createLessonSchema = z.object({
    slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự").max(100, "Slug không được vượt quá 100 ký tự"),
    content: z.string().default(""),
    metadata: z.object({
        title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").max(100, "Tiêu đề không được vượt quá 100 ký tự"),
        description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
        chapter_name: z.string().min(3, "Tên chương phải có ít nhất 3 ký tự"),
        chapter_slug: z.string().min(3, "Slug chương phải có ít nhất 3 ký tự"),
        author: z.string().min(2, "Tên tác giả phải có ít nhất 2 ký tự"),
        publishedTime: z.string().default(new Date().toISOString()),
        lastModifiedTime: z.string().default(new Date().toISOString()),
        tags: z.array(z.string()).default([]),
        category: z.string().default(""),
        difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
        language: z.array(z.string()).default(["Vietnamese"]),
        privilege: z.string().default("public"),
        isPublished: z.boolean().default(false),
        imageAuthor: z.string().default(""),
        thumbnail: z.string().default(""),
    })
})

// Schema cho form chỉnh sửa (optional fields)
const editLessonSchema = z.object({
    slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự").max(100, "Slug không được vượt quá 100 ký tự"),
    content: z.string().optional(),
    metadata: z.object({
        title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").max(100, "Tiêu đề không được vượt quá 100 ký tự"),
        description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
        chapter_name: z.string().min(3, "Tên chương phải có ít nhất 3 ký tự"),
        chapter_slug: z.string().min(3, "Slug chương phải có ít nhất 3 ký tự"),
        author: z.string().min(2, "Tên tác giả phải có ít nhất 2 ký tự"),
        publishedTime: z.string().optional(),
        lastModifiedTime: z.string().optional(),
        tags: z.array(z.string()).optional(),
        category: z.string().optional(),
        difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
        language: z.array(z.string()).optional(),
        privilege: z.string().optional(),
        isPublished: z.boolean().optional(),
        imageAuthor: z.string().optional(),
        thumbnail: z.string().optional(),
    })
})

type CreateLessonFormValues = z.infer<typeof createLessonSchema>
type EditLessonFormValues = z.infer<typeof editLessonSchema>

type LessonFormProps = {
    mode: 'create' | 'edit';
    lesson?: LessonDto;
    isLoading: boolean;
    onSubmit: (data: CreateLessonDto | UpdateLessonDto) => void;
    onCancel: () => void;
    submitButtonText?: string;
    cancelButtonText?: string;
    showFooter?: boolean;
}

export function LessonForm({
    mode,
    lesson,
    isLoading,
    onSubmit,
    onCancel,
    submitButtonText = "Lưu",
    cancelButtonText = "Hủy",
    showFooter = true
}: LessonFormProps) {
    const [thumbnailPreview, setThumbnailPreview] = useState(lesson?.metadata.thumbnail || "")
    const [chapters, setChapters] = useState<{ chapter_name: string, chapter_slug: string }[]>([])
    const [courseSlug, setCourseSlug] = useState("")

    // Chuyển đổi giá trị difficulty
    const mapDifficultyValue = (value: string): "Beginner" | "Intermediate" | "Advanced" => {
        if (value === "Foundation") return "Beginner"
        if (value === "Medium") return "Intermediate"
        if (value === "Advance") return "Advanced"
        return value as "Beginner" | "Intermediate" | "Advanced"
    }

    // Fetch chapters khi courseSlug thay đổi
    useEffect(() => {
        const fetchChapters = async () => {
            if (courseSlug) {
                try {
                    const response = await getChaptersByCoursesSlug(courseSlug)
                    if (response.success && response.result) {
                        setChapters(response.result as any)
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy danh sách chương:", error)
                }
            }
        }

        fetchChapters()
    }, [courseSlug])

    const form = useForm<CreateLessonFormValues | EditLessonFormValues>({
        resolver: zodResolver(mode === 'create' ? createLessonSchema : editLessonSchema),
        defaultValues: {
            slug: lesson?.slug || "",
            content: lesson?.content || "",
            metadata: {
                title: lesson?.metadata.title || "",
                description: lesson?.metadata.description || "",
                chapter_name: lesson?.metadata.chapter_name || "",
                chapter_slug: lesson?.metadata.chapter_slug || "",
                author: lesson?.metadata.author || "",
                publishedTime: lesson?.metadata.publishedTime || new Date().toISOString(),
                lastModifiedTime: lesson?.metadata.lastModifiedTime || new Date().toISOString(),
                tags: lesson?.metadata.tags || [],
                category: lesson?.metadata.category || "",
                difficulty: lesson?.metadata.difficulty ? mapDifficultyValue(lesson.metadata.difficulty) : "Beginner",
                language: lesson?.metadata.language || ["Vietnamese"],
                privilege: lesson?.metadata.privilege || "public",
                isPublished: lesson?.metadata.isPublished || false,
                imageAuthor: lesson?.metadata.imageAuthor || "",
                thumbnail: lesson?.metadata.thumbnail || "",
            }
        }
    })

    // Xem trước thumbnail khi nhập URL
    const watchThumbnail = form.watch("metadata.thumbnail")
    const watchTitle = form.watch("metadata.title")
    const watchChapterSlug = form.watch("metadata.chapter_slug")

    // Tự động tạo slug khi tiêu đề thay đổi
    useEffect(() => {
        if (mode === 'create' && watchTitle) {
            form.setValue("slug", generateSlug(watchTitle))
        }
    }, [watchTitle, form, mode])

    // Tự động cập nhật preview thumbnail
    useEffect(() => {
        if (watchThumbnail !== thumbnailPreview) {
            setThumbnailPreview(watchThumbnail || "")
        }
    }, [watchThumbnail, thumbnailPreview])

    // Cập nhật tên chương khi chọn chapter_slug
    useEffect(() => {
        if (watchChapterSlug) {
            const selectedChapter = chapters.find(c => c.chapter_slug === watchChapterSlug)
            if (selectedChapter) {
                form.setValue("metadata.chapter_name", selectedChapter.chapter_name)
            }
        }
    }, [watchChapterSlug, chapters, form])

    const handleSubmit = (data: CreateLessonFormValues | EditLessonFormValues) => {
        onSubmit(data as CreateLessonDto | UpdateLessonDto)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                        <TabsTrigger value="chapter">Thông tin chương</TabsTrigger>
                        <TabsTrigger value="details">Chi tiết bài học</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4 animate-in fade-in-0 slide-in-from-left-3 duration-200">
                        {/* Hiển thị thumbnail preview */}
                        {thumbnailPreview && (
                            <div className="w-full aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                                <img
                                    src={thumbnailPreview}
                                    alt={lesson?.metadata.title || watchTitle || "Thumbnail"}
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
                                    name="metadata.title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tiêu đề bài học <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập tiêu đề bài học" {...field} />
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
                                                    placeholder="ten-bai-hoc"
                                                    {...field}
                                                    disabled={true}
                                                    className="bg-muted"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Slug được tạo tự động từ tiêu đề bài học
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
                                                    placeholder="Nhập mô tả bài học"
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
                                    name="metadata.author"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tác giả <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập tên tác giả" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="chapter" className="space-y-4 animate-in fade-in-0 slide-in-from-left-3 duration-200">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="metadata.chapter_slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Chương <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                        // Tìm tên chương tương ứng
                                                        const selectedChapter = chapters.find(c => c.chapter_slug === value)
                                                        if (selectedChapter) {
                                                            form.setValue("metadata.chapter_name", selectedChapter.chapter_name)
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn chương" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {chapters.map((chapter) => (
                                                            <SelectItem key={chapter.chapter_slug} value={chapter.chapter_slug}>
                                                                {chapter.chapter_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nội dung bài học</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Nhập nội dung bài học"
                                                    {...field}
                                                    rows={10}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Nội dung bài học (hỗ trợ markdown)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4 animate-in fade-in-0 slide-in-from-left-3 duration-200">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="metadata.difficulty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Độ khó</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn độ khó" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Beginner">Cơ bản</SelectItem>
                                                    <SelectItem value="Intermediate">Trung bình</SelectItem>
                                                    <SelectItem value="Advanced">Nâng cao</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="metadata.category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Danh mục</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập danh mục" {...field} />
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
                                                <Input placeholder="https://example.com/image.jpg" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Đường dẫn URL đến hình ảnh thumbnail
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="metadata.isPublished"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Trạng thái xuất bản
                                                </FormLabel>
                                                <FormDescription>
                                                    {field.value
                                                        ? "Bài học sẽ được hiển thị cho học viên"
                                                        : "Bài học sẽ ở chế độ nháp"}
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
                        </div>
                    </TabsContent>
                </Tabs>

                {showFooter && (
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
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
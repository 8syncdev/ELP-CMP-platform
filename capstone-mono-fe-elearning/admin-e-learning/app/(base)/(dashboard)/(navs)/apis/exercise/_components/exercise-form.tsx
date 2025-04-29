"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CodeTester } from "./code-tester"
import { ExerciseDto, CreateExerciseDto, UpdateExerciseDto, ExerciseDifficulty, ExercisePrivilege } from "@/lib/actions/exercise/exercise.type"
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
// Removed unused imports

// Schema cho form tạo bài tập
const createExerciseSchema = z.object({
    slug: z.string().min(1, "Slug không được để trống"),
    content: z.string().min(1, "Nội dung không được để trống"),
    solution: z.string().min(1, "Giải pháp không được để trống"),
    testcases: z.array(
        z.object({
            input: z.string(),
            expected: z.string(),
        })
    ).min(1, "Cần ít nhất một test case").or(
        z.object({
            code: z.string(),
            test_cases: z.array(
                z.object({
                    input: z.string(),
                    expected: z.string(),
                })
            )
        })
    ),
    metadata: z.object({
        title: z.string().min(1, "Tiêu đề không được để trống"),
        keywords: z.array(z.string()).default([]),
        metaTitle: z.string().default(""),
        metaDescription: z.string().default(""),
        author: z.string().min(1, "Tác giả không được để trống"),
        publishedTime: z.string().default(new Date().toISOString()),
        lastModifiedTime: z.string().default(new Date().toISOString()),
        tags: z.array(z.string()).default([]),
        difficulty: z.custom<ExerciseDifficulty>().refine((val) => [
            "Easy", "Medium Easy", "Medium", "Medium Hard", "Hard", "Super Hard"
        ].includes(val as string), {
            message: "Độ khó không hợp lệ"
        }),
        language: z.array(z.string()).default([]),
        privilege: z.custom<ExercisePrivilege>().refine((val) => [
            "free", "registered", "pricing-1", "pricing-2", "pricing-3"
        ].includes(val as string), {
            message: "Quyền truy cập không hợp lệ"
        }).default("free"),
        isPublished: z.boolean().default(false),
        imageAuthor: z.string().default(""),
        thumbnail: z.string().default(""),
    })
})

// Schema cho form chỉnh sửa bài tập
const editExerciseSchema = createExerciseSchema.partial()

type CreateExerciseFormValues = z.infer<typeof createExerciseSchema>
type EditExerciseFormValues = z.infer<typeof editExerciseSchema>

type ExerciseFormProps = {
    mode: 'create' | 'edit';
    exercise?: ExerciseDto;
    isLoading: boolean;
    onSubmit: (data: CreateExerciseDto | UpdateExerciseDto) => void;
    onCancel: () => void;
    submitButtonText?: string;
    cancelButtonText?: string;
    showFooter?: boolean;
}

export function ExerciseForm({
    mode,
    exercise,
    isLoading,
    onSubmit,
    onCancel,
    submitButtonText = "Lưu",
    cancelButtonText = "Hủy",
    showFooter = true
}: ExerciseFormProps) {
    const [thumbnailPreview, setThumbnailPreview] = useState(exercise?.metadata.thumbnail || "")
    const [testCases, setTestCases] = useState<{ input: string, expected: string }[]>(
        Array.isArray(exercise?.testcases)
            ? exercise?.testcases as { input: string, expected: string }[]
            : ((exercise?.testcases as any)?.test_cases || [{ input: "", expected: "" }])
    )

    // Khởi tạo form với giá trị mặc định
    const form = useForm<CreateExerciseFormValues | EditExerciseFormValues>({
        resolver: zodResolver(mode === 'create' ? createExerciseSchema : editExerciseSchema),
        defaultValues: {
            slug: exercise?.slug || "",
            content: exercise?.content || "",
            solution: exercise?.solution || "",
            testcases: {
                code: Array.isArray(exercise?.testcases) ? "" : (exercise?.testcases as any)?.code || "",
                test_cases: testCases, // Use the testCases state which has been properly initialized
            },
            metadata: {
                title: exercise?.metadata.title || "",
                keywords: exercise?.metadata.keywords || [],
                metaTitle: exercise?.metadata.metaTitle || "",
                metaDescription: exercise?.metadata.metaDescription || "",
                author: exercise?.metadata.author || "",
                publishedTime: exercise?.metadata.publishedTime || new Date().toISOString(),
                lastModifiedTime: exercise?.metadata.lastModifiedTime || new Date().toISOString(),
                tags: exercise?.metadata.tags || [],
                difficulty: exercise?.metadata.difficulty || "Easy",
                language: exercise?.metadata.language || [],
                privilege: (exercise?.metadata.privilege as ExercisePrivilege) || "free",
                isPublished: exercise?.metadata.isPublished || false,
                imageAuthor: exercise?.metadata.imageAuthor || "",
                thumbnail: exercise?.metadata.thumbnail || "",
            }
        }
    })

    // Lấy giá trị thumbnail từ form để cập nhật preview
    const watchThumbnail = form.watch("metadata.thumbnail")

    // Tự động cập nhật preview thumbnail
    useEffect(() => {
        if (watchThumbnail !== thumbnailPreview) {
            setThumbnailPreview(watchThumbnail || "")
        }
    }, [watchThumbnail, thumbnailPreview])

    // Xử lý thêm test case
    const addTestCase = () => {
        setTestCases([...testCases, { input: "", expected: "" }])
        const currentTestCases = form.getValues("testcases.test_cases") || []
        form.setValue("testcases.test_cases", [...currentTestCases, { input: "", expected: "" }])
    }

    // Xử lý xóa test case
    const removeTestCase = (index: number) => {
        if (testCases.length > 1) {
            const updatedTestCases = [...testCases]
            updatedTestCases.splice(index, 1)
            setTestCases(updatedTestCases)
            form.setValue("testcases.test_cases", updatedTestCases)
        }
    }

    // Xử lý cập nhật test case
    const updateTestCase = (index: number, field: 'input' | 'expected', value: string) => {
        const updatedTestCases = [...testCases]
        updatedTestCases[index][field] = value
        setTestCases(updatedTestCases)
        form.setValue("testcases.test_cases", updatedTestCases)
    }

    const handleSubmit = (data: CreateExerciseFormValues | EditExerciseFormValues) => {
        // Cập nhật thời gian
        const updatedData = { ...data };

        // Replace testcases with the array of test cases directly
        // This matches the database schema
        updatedData.testcases = testCases;

        // Ensure metadata is properly formatted
        if (mode === 'create') {
            updatedData.metadata = {
                title: updatedData.metadata?.title || "",
                keywords: updatedData.metadata?.keywords || [],
                metaTitle: updatedData.metadata?.metaTitle || "",
                metaDescription: updatedData.metadata?.metaDescription || "",
                author: updatedData.metadata?.author || "",
                publishedTime: new Date().toISOString(),
                lastModifiedTime: new Date().toISOString(),
                tags: updatedData.metadata?.tags || [],
                difficulty: (updatedData.metadata?.difficulty as ExerciseDifficulty) || "Easy",
                language: updatedData.metadata?.language || [],
                privilege: (updatedData.metadata?.privilege as ExercisePrivilege) || "free",
                isPublished: updatedData.metadata?.isPublished || false,
                imageAuthor: updatedData.metadata?.imageAuthor || "",
                thumbnail: updatedData.metadata?.thumbnail || "",
            }
        } else {
            updatedData.metadata = {
                title: updatedData.metadata?.title || "",
                keywords: updatedData.metadata?.keywords || [],
                metaTitle: updatedData.metadata?.metaTitle || "",
                metaDescription: updatedData.metadata?.metaDescription || "",
                author: updatedData.metadata?.author || "",
                publishedTime: updatedData.metadata?.publishedTime || new Date().toISOString(),
                lastModifiedTime: new Date().toISOString(),
                tags: updatedData.metadata?.tags || [],
                difficulty: (updatedData.metadata?.difficulty as ExerciseDifficulty) || "Easy",
                language: updatedData.metadata?.language || [],
                privilege: (updatedData.metadata?.privilege as ExercisePrivilege) || "free",
                isPublished: updatedData.metadata?.isPublished || false,
                imageAuthor: updatedData.metadata?.imageAuthor || "",
                thumbnail: updatedData.metadata?.thumbnail || "",
            }
        }

        // For debugging
        console.log('Submitting data:', updatedData);

        onSubmit(updatedData as CreateExerciseDto | UpdateExerciseDto)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                        <TabsTrigger value="content">Nội dung</TabsTrigger>
                        <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                        <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    </TabsList>

                    {/* Tab thông tin cơ bản */}
                    <TabsContent value="basic" className="space-y-4">
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="exercise-slug" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Định danh duy nhất cho bài tập
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <FormField
                            control={form.control}
                            name="metadata.title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tiêu đề</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tiêu đề bài tập" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="metadata.author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tác giả</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tên tác giả" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="metadata.difficulty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Độ khó</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn độ khó" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Easy">Easy</SelectItem>
                                            <SelectItem value="Medium Easy">Medium Easy</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Medium Hard">Medium Hard</SelectItem>
                                            <SelectItem value="Hard">Hard</SelectItem>
                                            <SelectItem value="Super Hard">Super Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="metadata.isPublished"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Xuất bản
                                        </FormLabel>
                                        <FormDescription>
                                            Bài tập sẽ được hiển thị công khai nếu được xuất bản
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
                    </TabsContent>

                    {/* Tab nội dung */}
                    <TabsContent value="content" className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nội dung bài tập</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập nội dung bài tập..."
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Mô tả chi tiết về bài tập, yêu cầu và hướng dẫn
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="solution"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giải pháp</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập giải pháp cho bài tập..."
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Giải pháp mẫu cho bài tập
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>

                    {/* Tab test cases */}
                    <TabsContent value="testcases" className="space-y-4">
                        <div className="flex flex-col space-y-6">
                            {/* Test Cases Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-medium">Test Cases</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addTestCase}
                                    >
                                        Thêm Test Case
                                    </Button>
                                </div>

                                <div className="max-h-[300px] overflow-y-auto pr-2 border rounded-md p-4">
                                    {testCases.map((testCase, index) => (
                                        <div key={index} className="space-y-2 p-3 border rounded-md mb-3 last:mb-0 bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <Label>Test Case #{index + 1}</Label>
                                                {testCases.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeTestCase(index)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Input</Label>
                                                    <Textarea
                                                        value={testCase.input}
                                                        onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                                                        placeholder="Đầu vào"
                                                        className="font-mono text-xs min-h-[80px]"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Expected Output</Label>
                                                    <Textarea
                                                        value={testCase.expected}
                                                        onChange={(e) => updateTestCase(index, 'expected', e.target.value)}
                                                        placeholder="Đầu ra mong đợi"
                                                        className="font-mono text-xs min-h-[80px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Code Tester Section */}
                            <div className="w-full">
                                <FormField
                                    control={form.control}
                                    name="testcases.code"
                                    render={({ field }) => (
                                        <FormItem className="hidden">
                                            <FormControl>
                                                <Input type="hidden" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <CodeTester
                                    code={form.watch("testcases.code") || ""}
                                    onCodeChange={(code: string) => form.setValue("testcases.code", code)}
                                    exerciseSlug={form.watch("slug") || ""}
                                    testCases={testCases}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Tab metadata */}
                    <TabsContent value="metadata" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="metadata.metaTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meta Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Meta title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="metadata.metaDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meta Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Meta description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="metadata.tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tags cách nhau bởi dấu phẩy"
                                            value={field.value?.join(', ') || ''}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                const tags = value.split(',').map(tag => tag.trim()).filter(Boolean)
                                                field.onChange(tags)
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Các thẻ liên quan đến bài tập, cách nhau bởi dấu phẩy
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="metadata.keywords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keywords</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập keywords cách nhau bởi dấu phẩy"
                                            value={field.value?.join(', ') || ''}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                const keywords = value.split(',').map(keyword => keyword.trim()).filter(Boolean)
                                                field.onChange(keywords)
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Từ khóa SEO, cách nhau bởi dấu phẩy
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="metadata.language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ngôn ngữ lập trình</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập ngôn ngữ cách nhau bởi dấu phẩy"
                                            value={field.value?.join(', ') || ''}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                const languages = value.split(',').map(lang => lang.trim()).filter(Boolean)
                                                field.onChange(languages)
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Các ngôn ngữ lập trình được sử dụng trong bài tập
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="metadata.privilege"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quyền truy cập</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn quyền truy cập" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="registered">Registered</SelectItem>
                                            <SelectItem value="pricing-1">Pricing 1</SelectItem>
                                            <SelectItem value="pricing-2">Pricing 2</SelectItem>
                                            <SelectItem value="pricing-3">Pricing 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Quyền truy cập vào bài tập
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="metadata.thumbnail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thumbnail URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="URL hình ảnh thumbnail" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        URL hình ảnh đại diện cho bài tập
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {thumbnailPreview && (
                            <div className="mt-2">
                                <Label>Xem trước thumbnail</Label>
                                <div className="mt-1 border rounded-md overflow-hidden w-40 h-40">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Preview+Error"
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {showFooter && (
                    <div className="flex justify-end space-x-2 pt-4">
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

'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Facebook, Book, Code, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { sendEmail } from "@/server/email.actions";
import { toast } from "sonner";

const programmingLanguages = [
    { id: "javascript", label: "JavaScript" },
    { id: "typescript", label: "TypeScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "csharp", label: "C#" },
    { id: "cpp", label: "C++" },
    { id: "php", label: "PHP" },
    { id: "ruby", label: "Ruby" },
    { id: "swift", label: "Swift" },
    { id: "kotlin", label: "Kotlin" },
    { id: "other", label: "Khác" },
] as const;

const frameworks = [
    { id: "react", label: "React" },
    { id: "vue", label: "Vue" },
    { id: "angular", label: "Angular" },
    { id: "nextjs", label: "Next.js" },
    { id: "nuxtjs", label: "Nuxt.js" },
    { id: "django", label: "Django" },
    { id: "laravel", label: "Laravel" },
    { id: "spring", label: "Spring" },
    { id: "dotnet", label: ".NET" },
    { id: "flutter", label: "Flutter" },
    { id: "other", label: "Khác" },
] as const;

const majors = [
    { value: "cntt", label: "Công nghệ thông tin" },
    { value: "ktpm", label: "Kỹ thuật phần mềm" },
    { value: "httt", label: "Hệ thống thông tin" },
    { value: "khmt", label: "Khoa học máy tính" },
    { value: "attt", label: "An toàn thông tin" },
    { value: "other", label: "Khác" },
] as const;

const formSchema = z.object({
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại không hợp lệ"),
    facebook: z.string().url("Link Facebook không hợp lệ"),
    major: z.string(),
    otherMajor: z.string().optional(),
    languages: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 ngôn ngữ"),
    otherLanguages: z.string().optional(),
    frameworks: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 framework"),
    otherFrameworks: z.string().optional(),
    message: z.string().optional(),
}).refine((data) => {
    if (data.major === 'other') {
        return data.otherMajor && data.otherMajor.length >= 2;
    }
    return true;
}, {
    message: "Vui lòng nhập chuyên ngành khác",
    path: ["otherMajor"],
}).refine((data) => {
    if (data.languages.includes('other') && (!data.otherLanguages || data.otherLanguages.length < 2)) {
        return false;
    }
    return true;
}, {
    message: "Vui lòng nhập ngôn ngữ khác",
    path: ["otherLanguages"],
}).refine((data) => {
    if (data.frameworks.includes('other') && (!data.otherFrameworks || data.otherFrameworks.length < 2)) {
        return false;
    }
    return true;
}, {
    message: "Vui lòng nhập framework khác",
    path: ["otherFrameworks"],
});

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            languages: [],
            frameworks: [],
            otherLanguages: '',
            otherFrameworks: '',
            otherMajor: '',
        },
    });

    const majorValue = form.watch('major');
    const selectedLanguages = form.watch('languages');
    const selectedFrameworks = form.watch('frameworks');

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const emailContent = `
                <h3>Thông tin đăng ký:</h3>
                <p><strong>Họ và tên:</strong> ${values.fullName}</p>
                <p><strong>Số điện thoại:</strong> ${values.phone}</p>
                <p><strong>Facebook:</strong> ${values.facebook}</p>
                <p><strong>Chuyên ngành:</strong> ${values.major === 'other' ? values.otherMajor : majors.find(m => m.value === values.major)?.label}</p>
                <p><strong>Ngôn ngữ lập trình:</strong> ${values.languages.map(l => {
                const lang = programmingLanguages.find(pl => pl.id === l)?.label;
                return l === 'other' ? values.otherLanguages : lang;
            }).filter(Boolean).join(', ')}</p>
                <p><strong>Frameworks:</strong> ${values.frameworks.map(f => {
                const fw = frameworks.find(fw => fw.id === f)?.label;
                return f === 'other' ? values.otherFrameworks : fw;
            }).filter(Boolean).join(', ')}</p>
                ${values.message ? `<p><strong>Thông tin thêm:</strong> ${values.message}</p>` : ''}
            `;

            const success = await sendEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL || '', emailContent);

            if (success) {
                toast.success("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.", {
                    duration: 5000,
                });
                form.reset({
                    fullName: '',
                    phone: '',
                    facebook: '',
                    major: '',
                    otherMajor: '',
                    languages: [],
                    otherLanguages: '',
                    frameworks: [],
                    otherFrameworks: '',
                    message: '',
                });
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại sau.", {
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau.", {
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container max-w-2xl mx-auto p-4 md:p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                    Đăng Ký Tài Khoản
                </h1>
                <p className="text-muted-foreground">
                    Điền thông tin của bạn để bắt đầu trải nghiệm
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ và tên</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input className="pl-9" placeholder="Nguyễn Văn A" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input className="pl-9" placeholder="0123456789" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="facebook"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link Facebook</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Facebook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input className="pl-9" placeholder="https://facebook.com/..." {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="major"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chuyên ngành</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <div className="relative">
                                                    <Book className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <SelectTrigger className="pl-9">
                                                        <SelectValue placeholder="Chọn chuyên ngành" />
                                                    </SelectTrigger>
                                                </div>
                                            </FormControl>
                                            <SelectContent>
                                                {majors.map((major) => (
                                                    <SelectItem key={major.value} value={major.value}>
                                                        {major.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {majorValue === 'other' && (
                                <FormField
                                    control={form.control}
                                    name="otherMajor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Chuyên ngành khác</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Book className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" placeholder="Nhập chuyên ngành của bạn" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="languages"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Ngôn ngữ lập trình</FormLabel>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border rounded-lg p-4">
                                        {programmingLanguages.map((language) => (
                                            <FormField
                                                key={language.id}
                                                control={form.control}
                                                name="languages"
                                                render={({ field }) => (
                                                    <FormItem
                                                        key={language.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(language.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, language.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== language.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {language.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {selectedLanguages.includes('other') && (
                            <FormField
                                control={form.control}
                                name="otherLanguages"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngôn ngữ khác</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Code className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input className="pl-9" placeholder="Nhập ngôn ngữ khác (phân cách bằng dấu phẩy)" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="frameworks"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Frameworks & Libraries</FormLabel>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border rounded-lg p-4">
                                        {frameworks.map((framework) => (
                                            <FormField
                                                key={framework.id}
                                                control={form.control}
                                                name="frameworks"
                                                render={({ field }) => (
                                                    <FormItem
                                                        key={framework.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(framework.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, framework.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== framework.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {framework.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {selectedFrameworks.includes('other') && (
                            <FormField
                                control={form.control}
                                name="otherFrameworks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Framework khác</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Code className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input className="pl-9" placeholder="Nhập framework khác (phân cách bằng dấu phẩy)" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thông tin thêm (không bắt buộc)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập thông tin bổ sung..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Đăng ký ngay
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </motion.div>
        </div >
    );
}

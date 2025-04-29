"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Save, User, BadgeCheck, Mail, Phone, RefreshCw } from "lucide-react";
import { updateUser } from "@/lib/actions/user";
import { AuthDataDto } from "@/lib/actions/auth/auth.type";
import { Separator } from "@/components/ui/separator";
import { MaxLen } from "@/lib/actions/base.dto";
import { useAuth } from "@/providers";

interface UserProfileTabProps {
    user: AuthDataDto;
}

// Form validation schema
const formSchema = z.object({
    full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").optional(),
    email: z.string().email("Vui lòng nhập email hợp lệ").optional(),
    phone: z.string().min(10, "Vui lòng nhập số điện thoại hợp lệ").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function UserProfileTab({ user }: UserProfileTabProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const { refreshSession } = useAuth();

    // Form definition
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: user.full_name || "",
            email: user.email || "",
            phone: user.phone || "",
        },
    });

    // Handle form submission
    async function onSubmit(data: FormValues) {
        if (!user.userID) {
            toast({
                title: "Lỗi",
                description: "Không thể cập nhật thông tin người dùng",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Update user information
            const result = await updateUser(parseInt(user.userID), {
                full_name: data.full_name as string & MaxLen<100>,
                email: data.email as string & MaxLen<100>,
                phone: data.phone as (string & MaxLen<100>),
            });

            if (result.success) {
                // Refresh user data from the server after successful update
                await refreshSession();

                toast({
                    title: "Thành công",
                    description: "Thông tin cá nhân đã được cập nhật",
                });
            } else {
                throw new Error(result.message || "Không thể cập nhật thông tin người dùng");
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    // Generate avatar initials
    const getInitials = (name: string) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    return (
        <Card className="w-full bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 relative">
                        <div className="absolute -inset-1.5 rounded-full bg-primary/20 blur-md"></div>
                        <Avatar className="h-24 w-24 relative border-2 border-background">
                            <AvatarImage src="" alt={user.full_name || user.username} />
                            <AvatarFallback className="text-xl bg-primary/15 text-primary">
                                {getInitials(user.full_name || user.username)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <CardTitle className="text-2xl font-bold mt-2">{user.full_name || user.username}</CardTitle>
                    <CardDescription className="mt-1 flex items-center justify-center gap-1">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                        <span>{user.username}</span>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Separator className="my-6" />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
                        <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Thông tin cá nhân
                            </h3>

                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem className="mb-6">
                                        <FormLabel className="text-base">Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập họ và tên của bạn"
                                                {...field}
                                                className="bg-background/70 backdrop-blur-sm"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Tên đầy đủ của bạn sẽ hiển thị trên trang cá nhân
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1.5">
                                                <Mail className="h-4 w-4 text-primary" />
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="email@example.com"
                                                    {...field}
                                                    className="bg-background/70 backdrop-blur-sm"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Email dùng để nhận thông báo và hỗ trợ
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1.5">
                                                <Phone className="h-4 w-4 text-primary" />
                                                Số điện thoại
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nhập số điện thoại"
                                                    {...field}
                                                    className="bg-background/70 backdrop-blur-sm"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Số điện thoại dùng để hỗ trợ khi cần thiết
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-2.5"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang lưu
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Lưu thông tin
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
} 
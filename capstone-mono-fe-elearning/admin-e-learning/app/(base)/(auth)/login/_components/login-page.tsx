'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/providers'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, Lock, User, MessageCircle, Facebook } from 'lucide-react'
import { MY_INFO } from '@/constants/my-info'

const formSchema = z.object({
    username: z.string()
        .min(5, {
            message: 'Tên đăng nhập phải có ít nhất 5 ký tự',
        })
        .max(100, {
            message: 'Tên đăng nhập không được vượt quá 100 ký tự',
        }),
    password: z.string()
        .min(8, {
            message: 'Mật khẩu phải có ít nhất 8 ký tự',
        })
        .max(100, {
            message: 'Mật khẩu không được vượt quá 100 ký tự',
        }),
})

export function LoginPage() {
    const { login, user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    // Kiểm tra và chuyển hướng nếu đã đăng nhập
    useEffect(() => {
        if (user && !authLoading) {
            router.replace('/')
        }
    }, [user, authLoading, router])

    // Nếu đang loading hoặc đã đăng nhập, hiển thị loading state
    if (authLoading || user) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            setError('')
            await login(values.username, values.password)
            // Không cần router.push ở đây vì useEffect sẽ xử lý chuyển hướng
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Đăng nhập thất bại')
        } finally {
            setIsLoading(false)
        }
    }

    const handleContactZalo = () => {
        window.open(MY_INFO.socials.zalo, '_blank')
    }

    const handleContactFacebook = () => {
        window.open(MY_INFO.socials.facebook, '_blank')
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-bold">Đăng nhập</CardTitle>
                    <CardDescription>
                        Đăng nhập để truy cập vào hệ thống
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên đăng nhập</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    placeholder="Nhập tên đăng nhập"
                                                    className="pl-10"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    type="password"
                                                    placeholder="Nhập mật khẩu"
                                                    className="pl-10"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Đăng nhập
                            </Button>

                            <div className="text-center space-y-4">
                                <p className="text-sm text-muted-foreground">Chưa có tài khoản? Liên hệ với chúng tôi qua:</p>
                                <div className="flex gap-4 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={handleContactZalo}
                                        className="flex-1"
                                    >
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Zalo
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleContactFacebook}
                                        className="flex-1"
                                    >
                                        <Facebook className="mr-2 h-4 w-4" />
                                        Facebook
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
} 
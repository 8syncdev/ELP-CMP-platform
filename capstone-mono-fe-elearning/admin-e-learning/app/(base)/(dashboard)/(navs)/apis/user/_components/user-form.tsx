"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserIcon, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { UsersDto, CreateUsersDto, UpdateUsersDto } from "@/lib/actions/user/user.type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import dayjs from "dayjs"
import "dayjs/locale/vi"

// Schema cho form người dùng
const createUserSchema = z.object({
    username: z.string().min(5, "Tên người dùng phải có ít nhất 5 ký tự").max(100, "Tên người dùng không được vượt quá 100 ký tự"),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự").max(100, "Mật khẩu không được vượt quá 100 ký tự"),
    full_name: z.string().max(100, "Họ tên không được vượt quá 100 ký tự"),
    email: z.string().email("Email không hợp lệ").max(100, "Email không được vượt quá 100 ký tự"),
    phone: z.string().max(100, "Số điện thoại không được vượt quá 100 ký tự"),
    avatar: z.string().max(1000, "URL avatar không được vượt quá 1000 ký tự").optional().default(""),
    is_active: z.boolean().default(false),
    is_deleted: z.boolean().default(false),
    is_blocked: z.boolean().default(false),
    is_suspended: z.boolean().default(false),
    created_at: z.string(),
    updated_at: z.string(),
})

// Schema cho form chỉnh sửa (optional fields)
const editUserSchema = z.object({
    username: z.string().min(5, "Tên người dùng phải có ít nhất 5 ký tự").max(100, "Tên người dùng không được vượt quá 100 ký tự").optional(),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự").max(100, "Mật khẩu không được vượt quá 100 ký tự").optional(),
    full_name: z.string().max(100, "Họ tên không được vượt quá 100 ký tự").optional(),
    email: z.string().email("Email không hợp lệ").max(100, "Email không được vượt quá 100 ký tự").optional(),
    phone: z.string().max(100, "Số điện thoại không được vượt quá 100 ký tự").optional(),
    avatar: z.string().max(1000, "URL avatar không được vượt quá 1000 ký tự").optional(),
    is_active: z.boolean().optional(),
    is_deleted: z.boolean().optional(),
    is_blocked: z.boolean().optional(),
    is_suspended: z.boolean().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
})

type CreateUserFormValues = z.infer<typeof createUserSchema>
type EditUserFormValues = z.infer<typeof editUserSchema>

type UserFormProps = {
    mode: 'create' | 'edit';
    user?: UsersDto;
    isLoading: boolean;
    onSubmit: (data: CreateUsersDto | UpdateUsersDto) => void;
    onCancel: () => void;
    submitButtonText?: string;
    cancelButtonText?: string;
    showFooter?: boolean;
}

export function UserForm({
    mode,
    user,
    isLoading,
    onSubmit,
    onCancel,
    submitButtonText = "Lưu",
    cancelButtonText = "Hủy",
    showFooter = true
}: UserFormProps) {
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "")

    const form = useForm({
        resolver: zodResolver(mode === 'create' ? createUserSchema : editUserSchema),
        defaultValues: {
            username: user?.username || "",
            password: mode === 'create' ? "" : undefined,
            full_name: user?.full_name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            avatar: user?.avatar || "",
            is_active: user?.is_active || false,
            is_blocked: user?.is_blocked || false,
            is_suspended: user?.is_suspended || false,
            is_deleted: user?.is_deleted || false,
            created_at: user?.created_at ? dayjs(user.created_at).format() : dayjs().format(),
            updated_at: user?.updated_at ? dayjs(user.updated_at).format() : dayjs().format(),
        }
    })

    // Xem trước avatar khi nhập URL
    const watchAvatar = form.watch("avatar")
    const watchFullName = form.watch("full_name")
    const watchUsername = form.watch("username")

    useEffect(() => {
        if (watchAvatar !== avatarPreview) {
            setAvatarPreview(watchAvatar || "")
        }
    }, [watchAvatar, avatarPreview])

    const handleSubmit = (data: CreateUserFormValues | EditUserFormValues) => {
        if (mode === 'create') {
            onSubmit(data as CreateUsersDto | UpdateUsersDto);
        } else {
            onSubmit(data as UpdateUsersDto);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
                        <TabsTrigger value="account">Tài khoản</TabsTrigger>
                        <TabsTrigger value="status">Trạng thái</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="space-y-4 animate-in fade-in-0 slide-in-from-left-3 duration-200">
                        <div className="flex items-center space-x-4 mb-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={avatarPreview}
                                    alt={
                                        user?.full_name ||
                                        user?.username ||
                                        watchFullName ||
                                        watchUsername ||
                                        "Người dùng"
                                    }
                                />
                                <AvatarFallback>
                                    {(user?.full_name || user?.username || watchFullName || watchUsername || "U").charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium">
                                    {user?.full_name || user?.username || watchFullName || watchUsername || "Người dùng mới"}
                                </h3>
                                {user ? (
                                    <>
                                        <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Ngày tạo: {new Date(user.created_at).toLocaleDateString("vi-VN")}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Tạo tài khoản mới</p>
                                )}
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ tên {mode === 'create' && <span className="text-destructive">*</span>}</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Nhập họ tên" className="pl-9" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email {mode === 'create' && <span className="text-destructive">*</span>}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="Nhập email" className="pl-9" {...field} />
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
                                        <FormLabel>Số điện thoại {mode === 'create' && <span className="text-destructive">*</span>}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="Nhập số điện thoại" className="pl-9" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL Avatar</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập URL avatar" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        URL hình ảnh đại diện của người dùng
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>

                    <TabsContent value="account" className="space-y-4 animate-in fade-in-0 slide-in-from-left-3 duration-200">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên đăng nhập {mode === 'create' && <span className="text-destructive">*</span>}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tên đăng nhập" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Tên đăng nhập phải có ít nhất 5 ký tự
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {mode === 'create' ? 'Mật khẩu' : 'Mật khẩu mới'}
                                        {mode === 'create' && <span className="text-destructive">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={mode === 'create' ? 'Nhập mật khẩu' : 'Nhập mật khẩu mới'}
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {mode === 'create'
                                            ? 'Mật khẩu phải có ít nhất 8 ký tự'
                                            : 'Để trống nếu không muốn thay đổi mật khẩu. Mật khẩu phải có ít nhất 8 ký tự.'}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="created_at"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Ngày tạo</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                    >
                                                        {field.value ? (
                                                            dayjs(field.value).locale("vi").format("DD/MM/YYYY HH:mm")
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
                                                    selected={dayjs(field.value).toDate()}
                                                    onSelect={(date) => field.onChange(dayjs(date).format())}
                                                    disabled={(date) => date > new Date()}
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
                                name="updated_at"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Cập nhật lần cuối</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                    >
                                                        {field.value ? (
                                                            dayjs(field.value).locale("vi").format("DD/MM/YYYY HH:mm")
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
                                                    selected={dayjs(field.value).toDate()}
                                                    onSelect={(date) => field.onChange(dayjs(date).format())}
                                                    disabled={(date) => date > new Date()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {mode === 'create' && (
                            <div className="p-4 border rounded-md bg-muted/50">
                                <p className="text-sm font-medium mb-2">Thông tin đăng nhập</p>
                                <p className="text-xs text-muted-foreground">
                                    Sau khi tạo, người dùng có thể đăng nhập bằng tên đăng nhập và mật khẩu đã được thiết lập.
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="status" className="space-y-4 animate-in fade-in-0 slide-in-from-left-3 duration-200">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Hoạt động</FormLabel>
                                            <FormDescription>
                                                Người dùng có thể đăng nhập và sử dụng hệ thống
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

                            <FormField
                                control={form.control}
                                name="is_blocked"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Chặn</FormLabel>
                                            <FormDescription>
                                                Người dùng bị chặn không thể đăng nhập
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

                            <FormField
                                control={form.control}
                                name="is_suspended"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Tạm khóa</FormLabel>
                                            <FormDescription>
                                                Tài khoản bị tạm khóa tạm thời
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

                        <div className="p-4 border rounded-md bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                            <p className="text-sm font-medium">Lưu ý về trạng thái tài khoản</p>
                            <p className="text-xs mt-1">
                                {mode === 'create'
                                    ? 'Mặc định, tài khoản mới sẽ không hoạt động. Bạn cần kích hoạt để người dùng có thể đăng nhập.'
                                    : 'Việc thay đổi trạng thái tài khoản sẽ ảnh hưởng đến khả năng đăng nhập và sử dụng hệ thống của người dùng.'}
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                {showFooter && (
                    <>
                        <Separator />
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                {cancelButtonText}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="relative"
                            >
                                {isLoading ? "Đang xử lý..." : submitButtonText}
                                {isLoading && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </span>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </Form>
    )
} 
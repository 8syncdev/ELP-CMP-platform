import React from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/components/animations/hooks/useScrollAnimation'
import { slideUpVariants, staggerContainerVariants } from '@/components/animations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Facebook, Mail, MessageSquare, Phone, Send, User, Sparkles } from 'lucide-react'
import { sendEmail } from '@/lib/actions/email.actions'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
    facebook: z.string().url('Link Facebook không hợp lệ'),
    message: z.string().optional(),
})

const features = [
    {
        icon: <Phone className="w-5 h-5" />,
        title: "Hỗ trợ 24/7",
        description: "Đội ngũ hỗ trợ nhiệt tình, sẵn sàng giải đáp mọi thắc mắc"
    },
    {
        icon: <MessageSquare className="w-5 h-5" />,
        title: "Tư vấn miễn phí",
        description: "Nhận tư vấn lộ trình học tập phù hợp với nhu cầu của bạn"
    },
    {
        icon: <Mail className="w-5 h-5" />,
        title: "Phản hồi nhanh chóng",
        description: "Phản hồi trong vòng 24h kể từ khi nhận được thông tin"
    }
]

const ContactSection = () => {
    const { ref, isInView } = useScrollAnimation()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            facebook: '',
            message: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const content = `
            Tên: ${values.name}
            Email: ${values.email}
            SĐT: ${values.phone}
            Facebook: ${values.facebook}
            Lời nhắn: ${values.message || 'Không có'}
        `

        const success = await sendEmail(values.email, content)

        if (success) {
            toast({
                title: "Gửi thông tin thành công!",
                description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
            })
            form.reset()
        } else {
            toast({
                title: "Có lỗi xảy ra!",
                description: "Vui lòng thử lại sau.",
                variant: "destructive",
            })
        }
    }

    return (
        <section ref={ref} className="py-20 bg-gradient-to-b from-background via-background to-purple-500/5" id="contact-section">
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={staggerContainerVariants}
                className="container mx-auto"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    {/* Cột thông tin bên trái */}
                    <motion.div variants={slideUpVariants} className="space-y-8">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span className="font-medium text-sm">Liên hệ</span>
                            </motion.div>
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Kết Nối Với Chúng Tôi
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Để lại thông tin để nhận tư vấn miễn phí về lộ trình học tập
                                phù hợp với bạn.
                            </p>
                        </div>

                        {/* Danh sách tính năng */}
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={{
                                        hidden: { x: -20, opacity: 0 },
                                        visible: {
                                            x: 0,
                                            opacity: 1,
                                            transition: { delay: index * 0.2 }
                                        }
                                    }}
                                    className="flex gap-4 items-start group hover:bg-purple-500/5 p-4 rounded-lg transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1 text-foreground">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Form liên hệ bên phải */}
                    <motion.div
                        variants={slideUpVariants}
                        className="relative"
                    >
                        {/* Gradient background cho form */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />

                        <div className="relative bg-card p-8 rounded-xl border shadow-lg backdrop-blur-sm">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Họ và tên</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input placeholder="Nhập họ và tên" {...field} />
                                                        <User className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input placeholder="example@email.com" {...field} />
                                                        <Mail className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                                                        <Input placeholder="0123456789" {...field} />
                                                        <Phone className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                                                        <Input placeholder="https://facebook.com/..." {...field} />
                                                        <Facebook className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Lời nhắn (không bắt buộc)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Nhập lời nhắn của bạn..."
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting ? (
                                            "Đang gửi..."
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Gửi thông tin
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        {/* Hiệu ứng sparkles */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity
                            }}
                            className="absolute -top-4 -right-4 text-purple-500"
                        >
                            <Sparkles className="w-8 h-8" />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}

export default ContactSection

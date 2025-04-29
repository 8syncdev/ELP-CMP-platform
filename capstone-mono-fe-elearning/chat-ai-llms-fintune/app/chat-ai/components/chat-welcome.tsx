import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles, Check, X } from "lucide-react";
import { MY_INFO } from "@/constants/my-info";
import { CHAT_POLICIES } from "../constants/policies";
import Link from "next/link";

export function ChatWelcome() {
    const features = [
        { name: 'Số tin nhắn', trial: 'Không giới hạn', normal: 'Không giới hạn', vip: 'Không giới hạn' },
        { name: 'Lịch sử chat', trial: '1 năm', normal: '1 năm', vip: '1 năm' },
        { name: 'Tốc độ phản hồi', trial: 'Bình thường', normal: 'Bình thường', vip: 'Ưu tiên' },
        { name: 'Giới hạn token', trial: '1000', normal: '1000', vip: '2000' },
        { name: 'Chat voice', trial: true, normal: true, vip: true },
        { name: 'Hỗ trợ 24/7', trial: true, normal: true, vip: true },
        { name: 'Ưu tiên hỗ trợ', trial: false, normal: false, vip: true },
        { name: 'Tự động tìm kiếm tài liệu', trial: true, normal: true, vip: true },
    ];

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                    AI Agent Chuyên Lập Trình
                </h2>
                <p className="text-muted-foreground text-lg">
                    Vì là giai đoạn thử nghiệm, nên gói dùng thử miễn phí
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {['trial', 'normal', 'vip'].map((plan) => (
                    <motion.div
                        key={plan}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: plan === 'trial' ? 0 : plan === 'normal' ? 0.2 : 0.4 }}
                        className={`rounded-xl border p-6 space-y-6 ${plan === 'vip'
                            ? 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/50 relative overflow-hidden'
                            : 'bg-card'
                            }`}
                    >
                        {plan === 'vip' && (
                            <div className="absolute top-3 right-3">
                                <Sparkles className="h-6 w-6 text-violet-500 animate-pulse" />
                            </div>
                        )}

                        <div className="space-y-2">
                            <h3 className={`text-xl font-bold ${plan === 'vip'
                                ? 'bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent'
                                : ''
                                }`}>
                                {CHAT_POLICIES[plan as keyof typeof CHAT_POLICIES].name}
                            </h3>
                            <div className="text-2xl font-bold">
                                {plan === 'trial' && 'Miễn phí'}
                                {plan === 'normal' && 'Miễn phí'}
                                {plan === 'vip' && 'Miễn phí'}
                                <span className="text-sm font-normal">/năm</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {features.map((feature) => (
                                <div key={feature.name} className="flex items-center gap-2">
                                    {typeof feature[plan as keyof typeof feature] === 'boolean' ? (
                                        feature[plan as keyof typeof feature] ? (
                                            <Check className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <X className="h-5 w-5 text-red-500" />
                                        )
                                    ) : (
                                        <Check className="h-5 w-5 text-green-500" />
                                    )}
                                    <span className="text-sm">
                                        {feature.name}: {typeof feature[plan as keyof typeof feature] === 'boolean' ? '' : feature[plan as keyof typeof feature]}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Link href="/sign-up" className="w-full">
                            <Button
                                className={`w-full gap-2 ${plan === 'vip'
                                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white'
                                    : ''
                                    }`}
                                variant={plan === 'vip' ? 'default' : 'outline'}
                            >
                                {plan === 'trial' ? 'Dùng thử ngay' : 'Đăng ký ngay'}
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
                Cần tư vấn thêm? Liên hệ: {MY_INFO.contact}
            </p>
        </div>
    );
}
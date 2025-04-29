import { MY_INFO } from '@/constants/my-info';
import { Button } from '@/components/ui/button';
import { ExternalLink, Youtube, Sparkles, Zap, Clock, History } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function UpgradeBanner() {
    return (
        <div className="space-y-4">
            <Link href="/sign-up">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-4 space-y-3 hover:shadow-lg transition-all cursor-pointer"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                VIP
                            </span>
                            <h3 className="text-sm font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                                Trải nghiệm không giới hạn
                            </h3>
                        </div>
                        <Sparkles className="h-4 w-4 text-violet-500 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-violet-500" />
                            <div>
                                <p className="text-xs font-medium">Tin nhắn không giới hạn</p>
                                <p className="text-xs text-muted-foreground">Trò chuyện 24/7</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-violet-500" />
                            <div>
                                <p className="text-xs font-medium">Phản hồi nhanh</p>
                                <p className="text-xs text-muted-foreground">Ưu tiên xử lý</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white gap-2 py-2 text-sm font-bold"
                            variant="ghost"
                        >
                            Đăng kí ngay, 1 năm miễn phí
                            <ExternalLink className="h-4 w-4 animate-bounce" />
                        </Button>

                        <p className="text-center text-xs text-muted-foreground mt-2">
                            Liên hệ: {MY_INFO.contact}
                        </p>
                    </div>
                </motion.div>
            </Link>
        </div>
    );
}
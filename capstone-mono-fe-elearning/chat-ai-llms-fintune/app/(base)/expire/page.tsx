'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertCircle, Clock, Home } from "lucide-react";
import Link from "next/link";

export default function ExpirePage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-[380px] shadow-xl">
                    <CardHeader>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center"
                        >
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </motion.div>
                        <CardTitle className="text-center text-2xl font-bold">
                            Tài khoản đã hết hạn
                        </CardTitle>
                        <CardDescription className="text-center">
                            Vui lòng gia hạn để tiếp tục sử dụng dịch vụ
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <motion.div
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Clock className="w-4 h-4" />
                            <span>Tài khoản của bạn đã hết hạn sử dụng</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-3"
                        >
                            <Link href="/">
                                <Button className="w-full gap-2">
                                    <Home className="w-4 h-4" />
                                    Về trang chủ
                                </Button>
                            </Link>

                            <Link href="/pricing">
                                <Button variant="outline" className="w-full">
                                    Xem các gói dịch vụ
                                </Button>
                            </Link>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

import React from 'react'
import { motion } from 'framer-motion'
import { Safari } from '@/components/shared/dev/device-show'
import { slideUpVariants, staggerContainerVariants } from '@/components/animations'
import { useScrollAnimation } from '@/components/animations/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import { BookOpen, Video, Users, Rocket, ArrowRight, Sparkles } from 'lucide-react'
import { Python as PythonIcon, JavaScript as JavaScriptIcon, VisualStudioCode as VSCodeIcon } from 'developer-icons'
import Link from 'next/link'

const features = [
    {
        icon: <Video className="w-5 h-5" />,
        title: "Video bài giảng chất lượng",
        description: "Nội dung được trình bày rõ ràng, dễ hiểu với nhiều ví dụ thực tế"
    },
    {
        icon: <Users className="w-5 h-5" />,
        title: "Học cùng cộng đồng",
        description: "Trao đổi, thảo luận và học hỏi từ cộng đồng học viên đông đảo"
    },
    {
        icon: <Rocket className="w-5 h-5" />,
        title: "Dự án thực tế",
        description: "Áp dụng kiến thức vào các dự án thực tế, xây dựng portfolio cá nhân"
    }
]

const LessonSection = () => {
    const { ref, isInView } = useScrollAnimation()

    return (
        <section ref={ref} className="py-20 bg-gradient-to-b from-background via-background to-blue-500/5" id="lesson-section">
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={staggerContainerVariants}
                className="container mx-auto"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Cột video bên trái */}
                    <motion.div
                        variants={{
                            hidden: { scale: 0.8, opacity: 0 },
                            visible: {
                                scale: 1,
                                opacity: 1,
                                transition: { type: "spring", duration: 0.8 }
                            }
                        }}
                        className="relative order-2 lg:order-1"
                    >
                        {/* Gradient background cho video */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-2xl blur-xl" />

                        <Safari
                            className="mx-auto relative"
                            url="lessons.8sync.dev"
                            videoSrc="https://firebasestorage.googleapis.com/v0/b/nextjs-djninex-store.appspot.com/o/video-ads%2Flesson-ads.mp4?alt=media&token=cc92072f-25ae-43bd-b439-210fbb01f408"
                            crop={{
                                directions: ['top'],
                                intensity: 9
                            }}
                            mode="simple"
                        />

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
                            className="absolute -bottom-4 -left-4 text-blue-500"
                        >
                            <Sparkles className="w-8 h-8" />
                        </motion.div>
                    </motion.div>

                    {/* Cột nội dung bên phải */}
                    <motion.div variants={slideUpVariants} className="space-y-8 order-1 lg:order-2">
                        <div className="space-y-4">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span className="font-medium text-sm">Khóa học</span>
                            </motion.div>

                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                                Khám Phá Kho Tài Nguyên Học Tập
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Truy cập kho tài nguyên đa dạng với video bài giảng, tài liệu và
                                dự án thực tế giúp bạn nắm vững kiến thức.
                            </p>
                        </div>

                        {/* Danh sách tính năng */}
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={{
                                        hidden: { x: 20, opacity: 0 },
                                        visible: {
                                            x: 0,
                                            opacity: 1,
                                            transition: { delay: index * 0.2 }
                                        }
                                    }}
                                    className="flex gap-4 items-start group hover:bg-blue-500/5 p-4 rounded-lg transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1 text-foreground">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Tech stack icons với tooltip */}
                        <motion.div
                            variants={slideUpVariants}
                            className="flex gap-6 items-center"
                        >
                            <div className="p-3 rounded-xl bg-[#3776AB]/10 hover:bg-[#3776AB]/20 transition-colors">
                                <PythonIcon size={40} className="text-[#3776AB]" />
                            </div>
                            <div className="p-3 rounded-xl bg-[#F37626]/10 hover:bg-[#F37626]/20 transition-colors">
                                <JavaScriptIcon size={40} className="text-[#F37626]" />
                            </div>
                            <div className="p-3 rounded-xl bg-[#007ACC]/10 hover:bg-[#007ACC]/20 transition-colors">
                                <VSCodeIcon size={40} className="text-[#007ACC]" />
                            </div>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div variants={slideUpVariants} className="flex gap-4">
                            <Link href="/learning/fullstack-python-course/lessons?lesson=bai-00-huong-dan-python">
                                <Button
                                    size="lg"
                                    className="gap-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Bắt đầu học ngay
                                </Button>
                            </Link>
                            <Link href="/courses/website">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="gap-2 hover:bg-blue-500/20"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                    Xem tất cả
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}

export default LessonSection

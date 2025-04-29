import React from 'react'
import { motion } from 'framer-motion'
import { Safari } from '@/components/shared/dev/device-show'
import { slideUpVariants, staggerContainerVariants } from '@/components/animations'
import { useScrollAnimation } from '@/components/animations/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import { Code2, Play, Sparkles, BookOpen, Trophy, Target } from 'lucide-react'
import { JavaScript as JavascriptIcon, React as ReactIcon, TypeScript as TypescriptIcon } from 'developer-icons'
import Link from 'next/link'

const features = [
    {
        icon: <BookOpen className="w-5 h-5" />,
        title: "Học theo lộ trình",
        description: "Lộ trình học được thiết kế chi tiết, bài bản từ cơ bản đến nâng cao"
    },
    {
        icon: <Trophy className="w-5 h-5" />,
        title: "Thực hành tương tác",
        description: "Làm bài tập trực tiếp trên trình duyệt, nhận phản hồi ngay lập tức"
    },
    {
        icon: <Target className="w-5 h-5" />,
        title: "Mục tiêu rõ ràng",
        description: "Mỗi bài học đều có mục tiêu và kết quả cần đạt được cụ thể"
    }
]

const ExerciseSection = () => {
    const { ref, isInView } = useScrollAnimation()

    return (
        <section ref={ref} className="py-20 bg-gradient-to-b from-background via-background to-primary/5" id="exercise-section">
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={staggerContainerVariants}
                className="container mx-auto"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Cột nội dung bên trái */}
                    <motion.div variants={slideUpVariants} className="space-y-8">
                        <div className="space-y-4">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary"
                            >
                                <Code2 className="w-4 h-4" />
                                <span className="font-medium text-sm">Bài tập</span>
                            </motion.div>

                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Học Lập Trình Qua Thực Hành
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Trải nghiệm học tập tương tác với hơn 700+ bài tập được thiết kế chi tiết
                                từ cơ bản đến nâng cao.
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
                                    className="flex gap-4 items-start group hover:bg-primary/5 p-4 rounded-lg transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
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
                            <div className="p-3 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors">
                                <JavascriptIcon size={40} className="text-yellow-400" />
                            </div>
                            <div className="p-3 rounded-xl bg-blue-400/10 hover:bg-blue-400/20 transition-colors">
                                <ReactIcon size={40} className="text-blue-400" />
                            </div>
                            <div className="p-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 transition-colors">
                                <TypescriptIcon size={40} className="text-blue-600" />
                            </div>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div variants={slideUpVariants} className="flex gap-4">
                            <Link href="/exercises">
                                <Button
                                    size="lg"
                                    className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                                >
                                    <Code2 className="w-5 h-5" />
                                    Bắt đầu học ngay
                                </Button>
                            </Link>
                            <Link href="/exercises/pygennew-bai1-a1">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="gap-2 hover:bg-secondary/20"
                                >
                                    <Play className="w-5 h-5" />
                                    Xem bài mẫu
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Cột video bên phải */}
                    <motion.div
                        variants={{
                            hidden: { scale: 0.8, opacity: 0 },
                            visible: {
                                scale: 1,
                                opacity: 1,
                                transition: { type: "spring", duration: 0.8 }
                            }
                        }}
                        className="relative"
                    >
                        {/* Gradient background cho video */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl" />

                        <Safari
                            className="mx-auto relative"
                            url="exercises.8sync.dev"
                            videoSrc="https://firebasestorage.googleapis.com/v0/b/nextjs-djninex-store.appspot.com/o/video-ads%2Fex-1.mp4?alt=media&token=82ece07e-1b0d-475f-aa02-6e216ad450b2"
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
                            className="absolute -top-4 -right-4 text-yellow-400"
                        >
                            <Sparkles className="w-8 h-8" />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}

export default ExerciseSection
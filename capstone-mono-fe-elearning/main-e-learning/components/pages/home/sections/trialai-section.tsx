import React from 'react'
import { motion } from 'framer-motion'
import { Safari } from '@/components/shared/dev/device-show'
import { slideUpVariants, staggerContainerVariants } from '@/components/animations'
import { useScrollAnimation } from '@/components/animations/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import { Brain, Code2, Sparkles, Zap, Bot, Cpu } from 'lucide-react'
import { OpenAI as OpenAIIcon, Python as PythonIcon, PyTorch as PyTorchIcon } from 'developer-icons'
import Link from 'next/link'

const features = [
    {
        icon: <Brain className="w-5 h-5" />,
        title: "AI Thông Minh",
        description: "Trợ lý AI thông minh giúp bạn học tập hiệu quả hơn"
    },
    {
        icon: <Bot className="w-5 h-5" />,
        title: "Tương Tác Tự Nhiên",
        description: "Giao tiếp với AI như một người bạn học, giải đáp mọi thắc mắc"
    },
    {
        icon: <Cpu className="w-5 h-5" />,
        title: "Phân Tích Code",
        description: "AI phân tích và gợi ý cải thiện code của bạn"
    }
]

const TrialAISection = () => {
    const { ref, isInView } = useScrollAnimation()

    return (
        <section ref={ref} className="py-20 bg-gradient-to-b from-background via-background to-emerald-500/5" id="trial-ai-section">
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
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500"
                            >
                                <Brain className="w-4 h-4" />
                                <span className="font-medium text-sm">AI Assistant</span>
                            </motion.div>

                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                Học Lập Trình Cùng AI
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Trải nghiệm học tập thông minh với trợ lý AI, giúp bạn
                                tiến bộ nhanh chóng và hiệu quả hơn.
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
                                    className="flex gap-4 items-start group hover:bg-emerald-500/5 p-4 rounded-lg transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1 text-foreground">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Tech stack icons */}
                        <motion.div
                            variants={slideUpVariants}
                            className="flex gap-6 items-center"
                        >
                            <div className="p-3 rounded-xl bg-[#00A67E]/10 hover:bg-[#00A67E]/20 transition-colors">
                                <OpenAIIcon size={40} className="text-[#00A67E]" />
                            </div>
                            <div className="p-3 rounded-xl bg-[#3776AB]/10 hover:bg-[#3776AB]/20 transition-colors">
                                <PythonIcon size={40} className="text-[#3776AB]" />
                            </div>
                            <div className="p-3 rounded-xl bg-[#F37626]/10 hover:bg-[#F37626]/20 transition-colors">
                                <PyTorchIcon size={40} className="text-[#F37626]" />
                            </div>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div variants={slideUpVariants} className="flex gap-4">
                            <Link href="https://chat-ai.syncdev8.com" target="_blank">
                                <Button
                                    size="lg"
                                    className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
                                >
                                    <Zap className="w-5 h-5" />
                                    Dùng thử AI ngay
                                </Button>
                            </Link>
                            <Link href="#">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="gap-2 hover:bg-emerald-500/20"
                                >
                                    <Code2 className="w-5 h-5" />
                                    Xem tính năng
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
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />

                        <Safari
                            className="mx-auto relative"
                            url="ai.8sync.dev"
                            videoSrc="https://firebasestorage.googleapis.com/v0/b/nextjs-djninex-store.appspot.com/o/video-ads%2Fads-ai.mp4?alt=media&token=04b693d8-14cd-4f32-9e2d-2cf5bbe3e51b"
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
                            className="absolute -top-4 -right-4 text-emerald-400"
                        >
                            <Sparkles className="w-8 h-8" />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}

export default TrialAISection

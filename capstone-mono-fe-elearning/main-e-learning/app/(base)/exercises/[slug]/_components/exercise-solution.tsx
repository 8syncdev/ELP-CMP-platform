'use client'

import { ExerciseDto } from "@/lib/actions/exercise"
import { MarkdownRenderer } from "@/components/shared/dev/mdx"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, CreditCard, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { MY_INFO } from "@/constants"
import Link from "next/link"
import { CodeBlock } from "@/components/shared/dev/mdx/components"

interface ExerciseSolutionProps {
    exercise: ExerciseDto;
    allowShowSolution?: boolean;
}

const SolutionOverlay = ({ onGoToPricing }: { onGoToPricing: () => void }) => (
    <div className="absolute inset-0 flex flex-col items-stretch">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

        <div className="relative mt-[30%] flex items-center justify-center p-4 z-10">
            <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
                <CardContent className="pt-8 pb-6 text-center space-y-6">
                    <div className="relative">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary/10 rounded-full p-4">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                    </div>

                    <div className="space-y-3 px-4">
                        <h3 className="text-2xl font-bold tracking-tight">
                            Bạn cần đăng ký gói học tập để xem lời giải chi tiết
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Vui lòng đăng ký một trong các gói học tập của chúng tôi để mở khóa tất cả lời giải chi tiết và nội dung học tập premium.
                        </p>
                    </div>

                    <Button
                        onClick={onGoToPricing}
                        size="lg"
                        className="w-[90%] bg-gradient-to-r from-primary to-primary/90 hover:opacity-90"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Xem Các Gói Học Tập
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
)

export const ExerciseSolution = ({ exercise, allowShowSolution = false }: ExerciseSolutionProps) => {
    const router = useRouter();

    const handleGoToPricing = () => {
        router.push('/pricing');
    };

    return (
        <div className="prose dark:prose-invert max-w-none relative">
            {/* Note UI  */}
            <NoteUISolution />

            {allowShowSolution ? (
                <MarkdownRenderer content={exercise.solution || 'Chưa có lời giải cho bài tập này.'} />
            ) : (
                <div className="relative">
                    <div className="blur-[0.05rem]">
                        <MarkdownRenderer content={exercise.solution || 'Chưa có lời giải cho bài tập này.'} />
                    </div>
                    <SolutionOverlay onGoToPricing={handleGoToPricing} />
                </div>
            )}
        </div>
    )
}

const NoteUISolution = () => {
    const code = `def solve(*args):
    name = args[0]  # Lấy tham số đầu tiên làm tên
    return f"Chào bạn {name}! Chúc bạn học tập tốt!"`

    return (
        <div className="mb-8 space-y-4">
            <Card className="border-2 border-yellow-500/20">
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-yellow-500">
                            <div className="p-2 bg-yellow-500/10 rounded-full">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold">Hướng Dẫn Giải, Mẫu Minh Họa</h3>
                        </div>

                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p>Trong Python, <code>*args</code> là cú pháp cho phép hàm nhận vào số lượng tham số không giới hạn:</p>
                            <CodeBlock
                                language="python"
                                enableTyping={true}
                                typingSpeed={40}
                                loop={true}
                                typingDelay={2000}
                                showLineNumbers={true}
                                showCopyButton={false}
                                isCodeBlock={true}
                                wrapModeDev={true}
                            >
                                {code}
                            </CodeBlock>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Tên hàm bắt buộc là <code>solve</code></li>
                                <li>Tham số <code>*args</code> cho phép truyền nhiều giá trị</li>
                                <li>Truy cập các giá trị qua index: <code>args[0]</code>, <code>args[1]</code>...</li>
                            </ul>
                        </div>

                        <div className="pt-4 space-y-3">
                            <p className="font-medium">Cần hỗ trợ thêm?</p>
                            <div className="flex flex-wrap gap-3">
                                <Link href={MY_INFO.socials.youtube} target="_blank">
                                    <Button variant="outline" className="gap-2">
                                        <Lock className="w-4 h-4" />
                                        Xem Video Hướng Dẫn
                                    </Button>
                                </Link>
                                <Link href={MY_INFO.socials.zaloGroup} target="_blank">
                                    <Button variant="outline" className="gap-2">
                                        <Lock className="w-4 h-4" />
                                        Tham Gia Group Zalo
                                    </Button>
                                </Link>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Liên hệ hỗ trợ: {MY_INFO.contact} - Email: {MY_INFO.email}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

'use client'

import { ExerciseDto } from "@/lib/actions/exercise"
import { createSubmissionExternalService } from "@/lib/actions/submission"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Send } from "lucide-react"
import { useState } from "react"
import { ExerciseTestRun } from "./exercise-test-run"
import { toast } from "sonner"

interface ExerciseSubmitProps {
    exercise: ExerciseDto
    code: string
    language: string
    isDisabled?: boolean
}

export const ExerciseSubmit = ({ exercise, code, language, isDisabled }: ExerciseSubmitProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [isOpen, setIsOpen] = useState(false)

    const onSubmit = async () => {
        try {
            setIsLoading(true)
            const response = await createSubmissionExternalService({
                exercise_slug: exercise.slug,
                code: code,
                language: language,
            })

            if (!response.success) {
                throw new Error(response.message || "Có lỗi xảy ra")
            }

            setResult(response.result)
            toast.success("Nộp bài thành công!")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    size="sm"
                    disabled={isDisabled}
                    onClick={() => setIsOpen(true)}
                >
                    <Send className="w-4 h-4 mr-2" />
                    Nộp bài
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Kết quả nộp bài</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <ExerciseTestRun
                        result={result}
                        isLoading={isLoading}
                    />
                    <div className="mt-4 flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Đóng
                        </Button>
                        <Button
                            onClick={onSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang nộp..." : "Nộp bài"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 
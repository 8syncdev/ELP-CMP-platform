'use client'

import { useState } from 'react'
import { Terminal, TypingAnimation } from '@/components/ui/terminal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { runTestCode } from '@/lib/actions/submission'
import { z } from 'zod'

const singleInputSchema = z.string().max(1000, "Đầu vào không được vượt quá 1000 ký tự")
const multiInputSchema = z.string().max(5000, "Đầu vào không được vượt quá 5000 ký tự")

interface ExerciseTerminalProps {
    code: string;
}

export const ExerciseTerminal = ({ code }: ExerciseTerminalProps) => {
    const [inputMode, setInputMode] = useState<'single' | 'multi'>('single')
    const [singleInput, setSingleInput] = useState('')
    const [multiInput, setMultiInput] = useState('')
    const [result, setResult] = useState<any>(null)
    const [isRunning, setIsRunning] = useState(false)
    const [error, setError] = useState('')

    const handleRun = async () => {
        try {
            setError('')
            setIsRunning(true)

            // Validate input based on current mode
            const input = inputMode === 'single' ? singleInput : multiInput
            if (inputMode === 'single') {
                singleInputSchema.parse(input)
            } else {
                multiInputSchema.parse(input)
            }

            // Format input based on mode
            let formattedInput = inputMode === 'single'
                ? input
                    .trim()
                    .split(/\s+/) // Tách các phần tử bởi khoảng trắng
                    .filter(item => item !== '')
                    .join(',')
                : input
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line !== '')
                    .join(',')

            // Thêm dấu phẩy ở cuối nếu chỉ có một phần tử
            if (!formattedInput.includes(',')) {
                formattedInput = `${formattedInput},`
            }

            const response = await runTestCode({
                code,
                input: formattedInput
            })

            setResult(response.result)
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message)
            } else {
                console.error(err)
                setError('Có lỗi xảy ra khi chạy code')
            }
        } finally {
            setIsRunning(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                    <p className="font-medium">Hướng dẫn sử dụng Terminal:</p>
                    <ul className="list-disc pl-4 mt-2 space-y-1">
                        <li>Chế độ một hàng: Nhập các phần tử cách nhau bởi khoảng trắng (VD: 1 2 3)</li>
                        <li>Chế độ nhiều hàng: Mỗi dòng là một phần tử riêng biệt</li>
                    </ul>
                </AlertDescription>
            </Alert>

            <div className="flex items-center gap-4">
                <Label>Chế độ nhập:</Label>
                <Select value={inputMode} onValueChange={(value: 'single' | 'multi') => setInputMode(value)}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="single">Một hàng</SelectItem>
                        <SelectItem value="multi">Nhiều hàng</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                {inputMode === 'single' ? (
                    <Input
                        placeholder="Nhập các phần tử, cách nhau bởi khoảng trắng (VD: 1 2 3)"
                        value={singleInput}
                        onChange={(e) => setSingleInput(e.target.value)}
                    />
                ) : (
                    <Textarea
                        placeholder="Mỗi dòng là một phần tử riêng biệt"
                        value={multiInput}
                        onChange={(e) => setMultiInput(e.target.value)}
                        rows={5}
                        className="font-mono"
                    />
                )}
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button
                onClick={handleRun}
                disabled={isRunning}
                className="w-fit"
            >
                {isRunning ? 'Đang chạy...' : 'Chạy (8syncdev run)'}
            </Button>

            <Terminal className="bg-background text-white rounded-md p-4 font-mono min-h-[200px] w-full">
                {result && (
                    <>
                        <TypingAnimation delay={100} className="text-foreground">
                            {`Kết quả: ${result.result}`}
                        </TypingAnimation>
                        <TypingAnimation delay={200} className="text-muted-foreground">
                            {`Thời gian thực thi: ${result.execution_time}`}
                        </TypingAnimation>
                        <TypingAnimation delay={300} className="text-muted-foreground">
                            {`Bộ nhớ sử dụng: ${result.memory_used}`}
                        </TypingAnimation>
                        {result.error && !result.error.includes('mismatch') && (
                            <TypingAnimation delay={400} className="text-destructive">
                                {`Lỗi: ${result.error}`}
                            </TypingAnimation>
                        )}
                        {result === null && (
                            <TypingAnimation delay={400} className="text-destructive">
                                {`Kết quả: ${result}`}
                            </TypingAnimation>
                        )}
                    </>
                )}
            </Terminal>
        </div>
    )
} 
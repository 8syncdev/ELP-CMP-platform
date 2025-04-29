"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { createSubmissionExternalService } from "@/lib/actions/submission"
import { SubmissionResponseFromExternalService, TestsStatus } from "@/lib/actions/submission/submission.type"
import { PlayIcon, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

interface CodeTesterProps {
    code: string
    onCodeChange?: (code: string) => void
    exerciseSlug: string
    testCases?: { input: string; expected: string }[]
}

export function CodeTester({ code, onCodeChange, exerciseSlug, testCases = [] }: CodeTesterProps) {
    const [isRunning, setIsRunning] = useState(false)
    const [language, setLanguage] = useState("python")
    const [testResults, setTestResults] = useState<SubmissionResponseFromExternalService | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [showResults, setShowResults] = useState(false)

    const handleRunCode = async () => {
        if (!code.trim()) {
            setError("Vui lòng nhập mã để chạy thử")
            return
        }

        if (!exerciseSlug) {
            setError("Không tìm thấy thông tin bài tập")
            return
        }

        setIsRunning(true)
        setError(null)
        setTestResults(null)

        try {
            const response = await createSubmissionExternalService({
                code,
                language,
                exercise_slug: exerciseSlug
            })

            if (response.success) {
                setTestResults(response.result as unknown as SubmissionResponseFromExternalService)
                setShowResults(true)
            } else {
                setError(response.message || "Có lỗi xảy ra khi chạy mã")
            }
        } catch (err) {
            setError("Có lỗi xảy ra khi chạy mã")
            console.error(err)
        } finally {
            setIsRunning(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "success":
            case "passed":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="mr-1 h-3 w-3" /> Thành công
                    </Badge>
                )
            case "error":
            case "failed":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <XCircle className="mr-1 h-3 w-3" /> Lỗi
                    </Badge>
                )
            case "timeout":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Clock className="mr-1 h-3 w-3" /> Hết thời gian
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        <AlertCircle className="mr-1 h-3 w-3" /> {status}
                    </Badge>
                )
        }
    }

    const calculatePassRate = () => {
        if (!testResults || !testResults.test_details || testResults.test_details.length === 0) {
            return 0
        }

        const passedTests = testResults.test_details.filter(
            test => test.status.toLowerCase() === "success" || test.status.toLowerCase() === "passed"
        ).length

        return Math.round((passedTests / testResults.test_details.length) * 100)
    }

    return (
        <div className="w-full">
            {!showResults ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-medium">Mã kiểm thử</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-32">
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Ngôn ngữ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="python">Python</SelectItem>
                                        <SelectItem value="javascript">JavaScript</SelectItem>
                                        <SelectItem value="java">Java</SelectItem>
                                        <SelectItem value="cpp">C++</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                onClick={handleRunCode}
                                disabled={isRunning || !code.trim() || !exerciseSlug}
                                size="sm"
                            >
                                {isRunning ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang chạy...
                                    </>
                                ) : (
                                    <>
                                        <PlayIcon className="mr-2 h-4 w-4" /> Chạy kiểm thử
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <Textarea
                        placeholder="Nhập mã của bạn ở đây..."
                        className="min-h-[300px] font-mono text-sm"
                        value={code}
                        onChange={(e) => onCodeChange && onCodeChange(e.target.value)}
                    />

                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Lỗi</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            ) : (
                testResults && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-medium">Kết quả kiểm thử</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowResults(false)}
                            >
                                Quay lại mã nguồn
                            </Button>
                        </div>

                        <div className="border rounded-md p-4 space-y-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium">Tổng quan</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">
                                            Điểm: <span className="font-bold">{testResults.summary?.score || 0}</span>/{testResults.summary?.total || 0}
                                        </span>
                                    </div>
                                </div>

                                <Progress value={calculatePassRate()} className="h-2" />

                                <div className="text-xs text-gray-500 flex justify-between">
                                    <span>{calculatePassRate()}% test cases thành công</span>
                                    <span>
                                        {testResults.test_details?.filter(t =>
                                            t.status.toLowerCase() === "success" ||
                                            t.status.toLowerCase() === "passed"
                                        ).length || 0}/{testResults.test_details?.length || 0} test cases
                                    </span>
                                </div>
                            </div>

                            {testResults.summary?.error && (
                                <Alert variant="destructive">
                                    <AlertTitle>Lỗi</AlertTitle>
                                    <AlertDescription>{testResults.summary.error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Chi tiết kết quả</h3>
                                <div className="max-h-[300px] overflow-y-auto border rounded-md">
                                    {testResults.tests?.map((test, index) => (
                                        <div key={index} className="p-3 border-b last:border-b-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">Test #{index + 1}</h4>
                                                {getStatusBadge(test.status)}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-2">
                                                {test.execution_time !== null && (
                                                    <div>Thời gian: {test.execution_time} ms</div>
                                                )}
                                                {test.memory_used && (
                                                    <div>Bộ nhớ: {test.memory_used}</div>
                                                )}
                                            </div>

                                            {test.error && (
                                                <div className="mt-2">
                                                    <h5 className="text-xs font-medium text-red-600 mb-1">Lỗi:</h5>
                                                    <pre className="bg-red-50 p-2 rounded text-xs font-mono overflow-x-auto max-h-[100px]">
                                                        {test.error}
                                                    </pre>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {test.printed_output && (
                                                    <div>
                                                        <h5 className="text-xs font-medium mb-1">Đầu ra:</h5>
                                                        <pre className="bg-gray-50 p-2 rounded text-xs font-mono overflow-x-auto max-h-[100px]">
                                                            {test.printed_output}
                                                        </pre>
                                                    </div>
                                                )}

                                                {test.expected_output && (
                                                    <div>
                                                        <h5 className="text-xs font-medium mb-1">Đầu ra mong đợi:</h5>
                                                        <pre className="bg-gray-50 p-2 rounded text-xs font-mono overflow-x-auto max-h-[100px]">
                                                            {test.expected_output}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

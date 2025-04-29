'use client'

import { SubmissionResponseFromExternalService } from "@/lib/actions/submission"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CheckCircle2, Timer } from "lucide-react"

interface ExerciseTestRunProps {
    result?: SubmissionResponseFromExternalService
    isLoading?: boolean
}

export const ExerciseTestRun = ({ result, isLoading }: ExerciseTestRunProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Timer className="w-4 h-4 animate-spin mr-2" />
                <span>Đang chạy thử...</span>
            </div>
        )
    }

    if (!result) return null

    const { tests, summary } = result

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Badge variant={summary.error ? "destructive" : "default"}>
                        {summary.error ? (
                            <AlertCircle className="w-3 h-3 mr-1" />
                        ) : (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                        )}
                        {summary.error ? "Lỗi" : "Thành công"}
                    </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                    Điểm: {summary.score} cho {summary.total} test case
                </div>
            </div>

            <ScrollArea className="h-[300px] border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Test case</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Bộ nhớ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tests.map((test, index) => (
                            <TableRow key={index}>
                                <TableCell>Test {index + 1}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={test.status.toLocaleLowerCase() === "passed" ? "default" : "destructive"}
                                    >
                                        {test.status.toLocaleLowerCase() === "passed" ? "Đạt" : "Lỗi"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{test.execution_time}ms</TableCell>
                                <TableCell>{test.memory_used}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>

            {summary.error && (
                <div className="p-4 border rounded-md bg-destructive/10 text-destructive text-sm">
                    {summary.error}
                </div>
            )}
        </div>
    )
} 
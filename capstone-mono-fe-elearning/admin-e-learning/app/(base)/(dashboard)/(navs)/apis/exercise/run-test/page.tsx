"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { CodeTester } from "../_components/code-tester"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RunTestPage() {
    const router = useRouter()
    const [code, setCode] = useState("")
    const [exerciseSlug, setExerciseSlug] = useState("")

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Chạy thử mã</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <Label htmlFor="exercise-slug" className="text-base font-medium">Slug bài tập</Label>
                        <div className="mt-2">
                            <Input
                                id="exercise-slug"
                                placeholder="Nhập slug của bài tập..."
                                value={exerciseSlug}
                                onChange={(e) => setExerciseSlug(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">Nhập slug của bài tập để chạy kiểm thử</p>
                        </div>
                    </div>

                    <CodeTester
                        code={code}
                        onCodeChange={setCode}
                        exerciseSlug={exerciseSlug}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

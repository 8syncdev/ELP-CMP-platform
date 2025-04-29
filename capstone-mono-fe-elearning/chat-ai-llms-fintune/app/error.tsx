"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    // useEffect(() => {
    //     console.error(error)
    // }, [error])

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-50">
            <Card className="w-[420px]">
                <CardHeader>
                    <CardTitle className="text-destructive">Đã xảy ra lỗi!</CardTitle>
                    <CardDescription>
                        Rất tiếc đã xảy ra lỗi không mong muốn. Vui lòng thử lại.
                    </CardDescription>
                </CardHeader>

                <CardFooter className="flex justify-end gap-4">
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                    >
                        Về trang chủ
                    </Button>
                    <Button
                        onClick={() => reset()}
                    >
                        Thử lại
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
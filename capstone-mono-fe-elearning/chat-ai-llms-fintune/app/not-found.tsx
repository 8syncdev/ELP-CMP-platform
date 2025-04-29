'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle className="text-3xl">404</CardTitle>
          <CardDescription>
            Không tìm thấy trang bạn yêu cầu
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Trang bạn đang tìm kiếm có thể đã bị xóa hoặc di chuyển đến địa chỉ khác.
          </p>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Button
            variant="outline"
            asChild
          >
            <Link href="/">
              Về trang chủ
            </Link>
          </Button>
          <Button
            onClick={() => window.history.back()}
          >
            Quay lại
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
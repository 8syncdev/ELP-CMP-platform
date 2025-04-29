import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";

export function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-muted p-4">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Không tìm thấy trang
          </h1>
          <p className="text-muted-foreground">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>

      <Button variant="outline" asChild>
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Về trang chủ
        </Link>
      </Button>
    </div>
  );
}

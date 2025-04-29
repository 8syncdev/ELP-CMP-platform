import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";

export function Error() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-destructive/15 p-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Đã xảy ra lỗi
          </h1>
          <p className="text-muted-foreground">
            Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="default">
          Thử lại
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  );
}

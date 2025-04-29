import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileSearch } from 'lucide-react';

export default function BlogNotFound() {
    return (
        <main className="container flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-col items-center max-w-md">
                <div className="bg-primary/10 p-3 rounded-full mb-6">
                    <FileSearch className="h-12 w-12 text-primary" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Bài viết không tồn tại
                </h1>

                <p className="text-muted-foreground mb-8">
                    Bài viết bạn đang tìm kiếm có thể đã bị xóa, di chuyển hoặc chưa bao giờ tồn tại.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild>
                        <Link href="/blog">
                            Quay lại Blog
                        </Link>
                    </Button>

                    <Button variant="outline" asChild>
                        <Link href="/">
                            Trang chủ
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    );
} 
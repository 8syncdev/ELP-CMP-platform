import { getBlogs } from '@/lib/actions/blog';
import { BlogCard } from './blog-card';
import { BlogPagination } from './blog-pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface BlogIndexContentProps {
    page: number;
    size: number;
    search: string;
}

export async function BlogIndexContent({ page, size, search }: BlogIndexContentProps) {
    const response = await getBlogs(page, size, search);

    if (!response.success) {
        return (
            <Alert variant="destructive" className="mb-10">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>
                    {response.message || 'Không thể tải bài viết. Vui lòng thử lại sau.'}
                </AlertDescription>
            </Alert>
        );
    }

    if (!response.result || (Array.isArray(response.result) && response.result.length === 0)) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy bài viết</h3>
                <p className="text-muted-foreground">
                    {search
                        ? `Không có bài viết nào phù hợp với từ khóa "${search}"`
                        : 'Không có bài viết nào trong hệ thống'}
                </p>
            </div>
        );
    }

    const blogs = Array.isArray(response.result) ? response.result : [response.result];
    const pagination = response.pagination || { current: page, totalPages: 1, count: blogs.length, pageSize: size };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>

            <BlogPagination
                currentPage={pagination.current}
                totalPages={pagination.totalPages}
            />
        </>
    );
} 
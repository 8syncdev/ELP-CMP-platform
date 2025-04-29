import { Metadata } from 'next';
import { getBlogs } from '@/lib/actions/blog';
import { BlogIndexContent } from '../_components/blog-index-content';
import { BlogSearchParams } from '../_components/blog-search';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Blog - Chia sẻ kiến thức lập trình và công nghệ',
    description: 'Khám phá các bài viết về công nghệ, lập trình, và hướng dẫn chi tiết cho các dự án thực tế',
};

interface BlogPageProps {
    searchParams: Promise<{
        page?: string;
        size?: string;
        search?: string;
    }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const { page, size, search } = await searchParams;

    return (
        <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 animate-fade-in">
                    Blog & Chia sẻ kiến thức
                </h1>
                <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up [--slide-up-delay:200ms]">
                    Khám phá kiến thức, kinh nghiệm và xu hướng mới nhất trong lĩnh vực công nghệ và lập trình
                </p>
            </div>

            <div className="mb-10 animate-fade-in [--fade-in-delay:300ms]">
                <BlogSearchParams currentSearch={search || ''} />
            </div>

            <Suspense fallback={<BlogLoadingSkeleton />}>
                <BlogIndexContent page={page ? parseInt(page) : 1} size={size ? parseInt(size) : 9} search={search || ''} />
            </Suspense>
        </main>
    );
}

function BlogLoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex flex-col h-full">
                    <Skeleton className="aspect-[4/3] rounded-t-xl w-full" />
                    <div className="p-4 space-y-3 border rounded-b-xl border-t-0">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex gap-2 pt-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
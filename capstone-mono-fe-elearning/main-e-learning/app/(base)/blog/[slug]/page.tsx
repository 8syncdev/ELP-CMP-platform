import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogs } from '@/lib/actions/blog';
import { BlogDetail } from '../_components/blog-detail';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

interface BlogPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
    const { slug } = await params;

    // Find blog by slug
    const response = await getBlogs();

    if (!response.success || !response.result) {
        return {
            title: 'Blog Not Found',
            description: 'The requested blog could not be found',
        };
    }

    const blogs = Array.isArray(response.result) ? response.result : [response.result];
    const blog = blogs.find(b => b.slug === slug);

    if (!blog) {
        return {
            title: 'Blog Not Found',
            description: 'The requested blog could not be found',
        };
    }

    return {
        title: blog.metadata.title,
        description: blog.metadata.description,
        openGraph: {
            title: blog.metadata.title,
            description: blog.metadata.description,
            images: [
                {
                    url: blog.metadata.thumbnail,
                    width: 1200,
                    height: 630,
                    alt: blog.metadata.title,
                }
            ]
        },
    };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
    const { slug } = await params;

    return (
        <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<BlogDetailSkeleton />}>
                <BlogDetailContent slug={slug} />
            </Suspense>
        </main>
    );
}

async function BlogDetailContent({ slug }: { slug: string }) {
    // Find blog by slug
    const response = await getBlogs();

    if (!response.success || !response.result) {
        notFound();
    }

    const blogs = Array.isArray(response.result) ? response.result : [response.result];
    const blog = blogs.find(b => b.slug === slug);

    if (!blog) {
        notFound();
    }

    return <BlogDetail blog={blog} />;
}

function BlogDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto">
            <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />

            <div className="flex items-center gap-3 mb-8">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <div className="ml-auto">
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
            </div>

            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}
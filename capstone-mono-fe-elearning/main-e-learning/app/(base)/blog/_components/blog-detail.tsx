'use client';

import { BlogDto } from "@/lib/actions/blog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/shared/dev/mdx/mdx";
import { CalendarClock, ChevronLeft, Share2, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface BlogDetailProps {
    blog: BlogDto;
}

export function BlogDetail({ blog }: BlogDetailProps) {
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleShare = async () => {
        if (!mounted) return;

        const url = window.location.href;
        const title = blog.metadata.title;

        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                toast({
                    title: "Link đã được sao chép!",
                    description: "Đường dẫn bài viết đã được sao chép vào clipboard",
                });
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const { metadata, content } = blog;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-8">
                <Button variant="ghost" size="sm" asChild className="mb-4 pl-0 hover:pl-2 transition-all">
                    <Link href="/blog" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        <span>Quay lại tất cả bài viết</span>
                    </Link>
                </Button>

                <div className="relative aspect-video overflow-hidden rounded-xl mb-8">
                    <Image
                        src={metadata.thumbnail || '/images/placeholder.jpg'}
                        alt={metadata.title}
                        fill
                        priority
                        className="object-cover"
                    />

                    {metadata.privilege === "registered" && (
                        <div className="absolute top-4 right-4">
                            <Badge className="bg-primary/90 px-3 py-1">Premium</Badge>
                        </div>
                    )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{metadata.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">{metadata.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b">
                    <div className="flex items-center gap-3">
                        {metadata.imageAuthor ? (
                            <Image
                                src={metadata.imageAuthor}
                                alt={metadata.author}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                        )}
                        <div>
                            <div className="font-medium">{metadata.author}</div>
                            <div className="text-sm text-muted-foreground">
                                {formatDate(new Date(metadata.publishedTime))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Chia sẻ
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                    {metadata.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <MarkdownRenderer content={content} />
            </div>

            <div className="border-t pt-8 mt-12">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarClock className="h-4 w-4" />
                        <span>Cập nhật: {formatDate(new Date(metadata.updatedTime))}</span>
                    </div>

                    <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Chia sẻ bài viết
                    </Button>
                </div>
            </div>
        </div>
    );
} 
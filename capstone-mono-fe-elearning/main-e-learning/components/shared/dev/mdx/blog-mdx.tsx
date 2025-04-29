'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { User, Calendar } from 'lucide-react'
import { MarkdownRenderer } from './mdx'
import type { BlogMetadata, BlogPost } from '@/lib/static/mdx.actions'
import Image from 'next/image'

export const BlogMDX = memo(({ metadata, content }: BlogPost) => {
    return (
        <main className="container mx-auto px-4 py-8">
            <Card className="mb-8">
                <CardHeader>
                    <div className="relative w-full h-[300px] mb-6">
                        <Image
                            src={metadata.thumbnail || ''}
                            alt={metadata.title}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <CardTitle className="text-4xl">{metadata.title}</CardTitle>
                    <CardDescription className="text-lg">{metadata.description}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                        <div className="flex items-center gap-2">
                            {metadata.imageAuthor && (
                                <Image
                                    src={metadata.imageAuthor}
                                    alt={metadata.author}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                            )}
                            {!metadata.imageAuthor && <User className="w-4 h-4" />}
                            <span>{metadata.author}</span>
                        </div>
                        {metadata.publishedTime && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <time>{metadata.publishedTime}</time>
                            </div>
                        )}
                    </div>
                </CardHeader>
            </Card>

            <MarkdownRenderer 
                content={content}
            />
        </main>
    )
})

export default BlogMDX

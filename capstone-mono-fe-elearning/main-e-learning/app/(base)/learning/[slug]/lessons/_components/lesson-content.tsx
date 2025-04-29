'use client';

import { MarkdownRenderer } from '@/components/shared/dev/mdx/mdx';
import { useEffect, useState } from 'react';
import { getLessonBySlug } from '@/lib/actions/lesson';
import { LessonDto, LessonResponse } from '@/lib/actions/lesson';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
    BookOpen, Calendar, GraduationCap, Languages, Share2,
    Lock, Tags, Timer, User, Crown, Sparkles, Info, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const MetadataItem = ({ icon: Icon, label, value }: {
    icon: any;
    label: string;
    value: string | React.ReactNode;
}) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="w-4 h-4 shrink-0" />
        <span className="font-medium">{label}:</span>
        <span className="truncate">{value}</span>
    </div>
);

type Privilege = 'free' | 'registered';

const PremiumContentOverlay = ({ onRegister }: { onRegister: () => void }) => {
    const router = useRouter();

    const handleGoToPricing = () => {
        router.push('/pricing');
    };

    return (
        <div className="absolute inset-0 flex flex-col items-stretch">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

            <div className="relative mt-[30%] flex items-center justify-center p-4 z-10">
                <div className="w-full max-w-md">
                    <Card className="border-2 border-primary/20 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                        <CardContent className="pt-8 pb-6 text-center space-y-6">
                            <div className="relative">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary/10 rounded-full p-4">
                                    <Lock className="w-8 h-8 text-primary" />
                                </div>
                            </div>

                            <div className="space-y-3 px-4">
                                <h3 className="text-2xl font-bold tracking-tight">
                                    Nội Dung Premium
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Mở khóa toàn bộ nội dung bài học này và tiếp cận hàng trăm bài học
                                    chất lượng khác trong khóa học của chúng tôi.
                                </p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex flex-col space-y-2">
                                    <Button
                                        onClick={handleGoToPricing}
                                        variant="outline"
                                        size="lg"
                                        className="w-[90%] mx-auto"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Xem Các Gói Học Tập
                                    </Button>

                                    <Button
                                        onClick={onRegister}
                                        size="lg"
                                        className="w-[90%] mx-auto bg-gradient-to-r from-primary to-primary/90 hover:opacity-90"
                                    >
                                        <GraduationCap className="w-4 h-4 mr-2" />
                                        Đăng Ký Khóa Học Này
                                    </Button>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Đăng ký gói học tập để truy cập tất cả nội dung premium
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export function LessonContent({ lessonSlug, enrollment }: { lessonSlug?: string, enrollment?: boolean }) {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const courseSlug = params?.slug as string;
    const [lesson, setLesson] = useState<LessonDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchLesson() {
            if (!courseSlug || !lessonSlug) return;
            setIsLoading(true);
            try {
                const response = await getLessonBySlug(lessonSlug);
                if (response.success && response.result) {
                    setLesson(response.result as LessonDto);
                }
            } catch (error) {
                console.error('Lỗi khi tải bài học:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchLesson();
    }, [courseSlug, lessonSlug]);

    // Handle sharing the lesson
    const handleShare = async () => {
        if (!lesson) return;

        try {
            const shareUrl = window.location.href;
            const shareText = `Đang học "${lesson.metadata.title}" tại ${courseSlug} | 8Sync`;

            if (navigator.share) {
                await navigator.share({
                    title: lesson.metadata.title,
                    text: shareText,
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                toast({
                    title: "Đã sao chép!",
                    description: "Link bài học đã được sao chép vào clipboard",
                });
            }
        } catch (error) {
            console.error('Lỗi khi chia sẻ:', error);
        }
    };

    if (isLoading) {
        return <LessonSkeleton />;
    }

    if (!lessonSlug || !lesson?.content) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                    <BookOpen className="w-12 h-12 text-muted-foreground" />
                    <p className="text-muted-foreground">Vui lòng chọn một bài học để bắt đầu.</p>
                </CardContent>
            </Card>
        );
    }

    const { metadata } = lesson;
    const needsEnrollment = metadata.privilege === 'registered' && !enrollment;

    return (
        <Card className="relative overflow-hidden">
            <CardHeader className="space-y-4 bg-muted/30">
                <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">{metadata.title}</h1>
                        <Button variant="outline" size="sm" onClick={handleShare} className="hidden sm:flex">
                            <Share2 className="h-4 w-4 mr-2" />
                            Chia sẻ
                        </Button>
                    </div>
                    <p className="text-muted-foreground text-sm">{metadata.description}</p>

                    <div className="flex items-center pt-1">
                        <Badge variant="outline" className="mr-2">
                            {metadata.chapter_name}
                        </Badge>
                        {metadata.privilege === 'registered' && (
                            <Badge variant="default" className="bg-primary">
                                Premium
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetadataItem icon={User} label="Tác giả" value={metadata.author} />
                    <MetadataItem
                        icon={Calendar}
                        label="Cập nhật"
                        value={format(new Date(metadata.lastModifiedTime), 'dd MMM yyyy', { locale: vi })}
                    />
                    <MetadataItem icon={GraduationCap} label="Độ khó" value={metadata.difficulty} />
                    <MetadataItem
                        icon={Languages}
                        label="Ngôn ngữ"
                        value={
                            <div className="flex gap-1">
                                {metadata.language.map(lang => (
                                    <Badge key={lang} variant="secondary" className="text-xs">
                                        {lang}
                                    </Badge>
                                ))}
                            </div>
                        }
                    />
                    <MetadataItem
                        icon={Tags}
                        label="Tags"
                        value={
                            <div className="flex flex-wrap gap-1">
                                {metadata.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        }
                    />
                    {needsEnrollment && (
                        <MetadataItem
                            icon={Crown}
                            label="Quyền truy cập"
                            value={
                                <Badge variant="default" className="bg-primary">
                                    Premium
                                </Badge>
                            }
                        />
                    )}
                </div>

                <div className="flex sm:hidden justify-end pt-2">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Chia sẻ
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="px-1">
                <div className="relative min-h-[37.5rem]">
                    <div className="prose dark:prose-invert max-w-none">
                        {(metadata.privilege === 'free' || enrollment) ? (
                            <MarkdownRenderer
                                content={lesson.content}
                                className="min-h-[18.75rem]"
                            />
                        ) : (
                            <>
                                <div className="max-h-[12.5rem] overflow-hidden relative mb-4">
                                    <MarkdownRenderer
                                        content={lesson.content.substring(0, 500) + '...'}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent"></div>
                                </div>
                                <PremiumContentOverlay
                                    onRegister={() => router.push(`/learning/${courseSlug}`)}
                                />
                            </>
                        )}
                    </div>
                </div>
            </CardContent>

            {(metadata.privilege === 'free' || enrollment) && (
                <CardFooter className="flex justify-between border-t bg-muted/30 mt-6">
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Tiếp tục học để hoàn thành khóa học</span>
                    </div>

                    <Button variant="ghost" className="gap-1" onClick={() => router.push(`/learning/${courseSlug}`)}>
                        <span>Khóa học</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

function LessonSkeleton() {
    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-6" />
                    ))}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-4" />
                ))}
            </CardContent>
        </Card>
    );
} 
'use client';

import { useLearning } from '@/providers/learning-context';
import { BookOpen, Minus, Plus, ChevronLeft, ChevronRight, Clock, Star, Lock, Unlock } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LearningSkeleton } from './learning-skeleton';
import { LessonSkeleton } from './lesson-skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toTitleCase } from '@/lib/common';
import { usePathname, useSearchParams } from 'next/navigation';

interface LearningNavigationProps {
    courseSlug: string;
}

export function LearningSidebar({ courseSlug }: LearningNavigationProps) {
    const {
        chapters,
        currentChapter,
        lessons,
        pagination,
        isLoadingChapters,
        isLoadingLessons,
        handlePageChange,
        setCurrentChapter,
        fetchLessons,
        currentPages,
    } = useLearning();

    const [openChapter, setOpenChapter] = useState<string | null>(null);
    const hasInitializedRef = useRef(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentLessonSlug = searchParams.get('lesson');

    // console.log(pagination)

    useEffect(() => {
        if (courseSlug && !hasInitializedRef.current) {
            handlePageChange('chapters', courseSlug, 1);
        }
    }, [courseSlug, handlePageChange]);

    useEffect(() => {
        if (
            chapters.length > 0 &&
            !hasInitializedRef.current &&
            currentPages.chapters === 1
        ) {
            const firstChapter = chapters[0];
            handleChapterClick(firstChapter.chapter_slug);
            hasInitializedRef.current = true;
        }
    }, [chapters, currentPages.chapters]);

    const handleChapterClick = async (chapterSlug: string) => {
        if (openChapter === chapterSlug) {
            setOpenChapter(null);
            return;
        }
        setOpenChapter(chapterSlug);
        setCurrentChapter(chapterSlug);
        const page = currentPages[chapterSlug] || 1;
        await fetchLessons(courseSlug, chapterSlug, page);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner': return 'text-green-500';
            case 'intermediate': return 'text-yellow-500';
            case 'advanced': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <Sidebar className="mt-16 max-h-[calc(100vh-4rem)] flex flex-col">
            <SidebarHeader className="border-b flex-shrink-0">
                <h1 className='text-2xl font-bold text-primary'>Danh sách bài học</h1>
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                        {chapters.length} chương
                    </Badge>
                </div>
            </SidebarHeader>

            <SidebarContent className="flex-1 overflow-y-auto">
                <SidebarGroup>
                    <SidebarMenu className='space-y-2'>
                        {isLoadingChapters ? (
                            <LearningSkeleton />
                        ) : (
                            chapters.map((chapter) => (
                                <Collapsible
                                    key={chapter.chapter_slug}
                                    open={openChapter === chapter.chapter_slug}
                                    onOpenChange={() => handleChapterClick(chapter.chapter_slug)}
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                className={cn(
                                                    "w-full flex items-center justify-between p-3 transition-all",
                                                    "hover:bg-primary/10 hover:text-primary",
                                                    openChapter === chapter.chapter_slug &&
                                                    "bg-primary/15 text-primary font-medium",
                                                    "py-5"
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 flex-shrink-0" />
                                                    <span className='font-bold'>{toTitleCase(chapter.chapter_name)}</span>
                                                </div>
                                                {openChapter === chapter.chapter_slug ? (
                                                    <Minus className="h-4 w-4" />
                                                ) : (
                                                    <Plus className="h-4 w-4" />
                                                )}
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub className='p-0'>
                                                {isLoadingLessons && currentChapter === chapter.chapter_slug ? (
                                                    <LessonSkeleton />
                                                ) : (
                                                    <div className="space-y-1 py-1">
                                                        {lessons.map((lesson) => (
                                                            <Tooltip key={lesson.slug}>
                                                                <TooltipTrigger asChild>
                                                                    <SidebarMenuSubItem>
                                                                        <Link
                                                                            href={`/learning/${courseSlug}/lessons?lesson=${lesson.slug}`}
                                                                            className={cn(
                                                                                "w-full p-2 rounded-md flex items-center gap-2 group transition-all",
                                                                                "min-h-[3rem]",
                                                                                "hover:bg-primary/10",
                                                                                currentLessonSlug === lesson.slug &&
                                                                                "bg-primary/15 text-primary font-medium shadow-sm",
                                                                                lesson.metadata.privilege === 'free'
                                                                                    ? 'hover:text-primary'
                                                                                    : 'hover:text-primary/80'
                                                                            )}
                                                                        >
                                                                            {lesson.metadata.privilege === 'free' ? (
                                                                                <Unlock className={cn(
                                                                                    "h-4 w-4 flex-shrink-0",
                                                                                    currentLessonSlug === lesson.slug
                                                                                        ? "text-primary"
                                                                                        : "text-primary/70"
                                                                                )} />
                                                                            ) : (
                                                                                <Lock className={cn(
                                                                                    "h-4 w-4 flex-shrink-0",
                                                                                    currentLessonSlug === lesson.slug
                                                                                        ? "text-primary/90"
                                                                                        : "text-primary/60"
                                                                                )} />
                                                                            )}
                                                                            <span className="flex-1 truncate sm:whitespace-pre-wrap sm:line-clamp-2 whitespace-nowrap text-sm">
                                                                                {lesson.metadata.title}
                                                                            </span>
                                                                        </Link>
                                                                    </SidebarMenuSubItem>
                                                                </TooltipTrigger>
                                                                <TooltipContent
                                                                    side="right"
                                                                    className="max-w-[300px] p-3 border border-primary/20 bg-white"
                                                                >
                                                                    <div className="space-y-2">
                                                                        <p className="font-medium text-primary">
                                                                            {lesson.metadata.title}
                                                                        </p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {lesson.metadata.description}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 text-xs text-primary/70">
                                                                            <Clock className="h-3 w-3" />
                                                                            <span>
                                                                                Cập nhật: {new Date(lesson.metadata.lastModifiedTime).toLocaleDateString('vi-VN')}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        ))}
                                                        {pagination.lessons && pagination.lessons.totalPages > 1 && (
                                                            <div className="flex items-center justify-between px-2 py-1.5 border-t">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    disabled={currentPages[currentChapter!] === 1}
                                                                    onClick={() => handlePageChange(
                                                                        'lessons',
                                                                        courseSlug,
                                                                        (currentPages[currentChapter!] || 1) - 1,
                                                                        currentChapter!
                                                                    )}
                                                                    className={cn(
                                                                        "h-7 w-7",
                                                                        "hover:bg-primary/10 hover:text-primary",
                                                                        "disabled:opacity-50"
                                                                    )}
                                                                >
                                                                    <ChevronLeft className="h-4 w-4" />
                                                                </Button>
                                                                <span className="text-xs font-medium text-muted-foreground">
                                                                    {currentPages[currentChapter!] || 1}/{pagination.lessons.totalPages}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    disabled={currentPages[currentChapter!] === pagination.lessons.totalPages}
                                                                    onClick={() => handlePageChange(
                                                                        'lessons',
                                                                        courseSlug,
                                                                        (currentPages[currentChapter!] || 1) + 1,
                                                                        currentChapter!
                                                                    )}
                                                                    className={cn(
                                                                        "h-7 w-7",
                                                                        "hover:bg-primary/10 hover:text-primary",
                                                                        "disabled:opacity-50"
                                                                    )}
                                                                >
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {pagination.chapters && pagination.chapters.totalPages > 1 && (
                <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center justify-between px-2 py-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={currentPages.chapters === 1}
                            onClick={() => handlePageChange('chapters', courseSlug, currentPages.chapters - 1)}
                            className={cn(
                                "h-7 w-7",
                                "hover:bg-primary/10 hover:text-primary",
                                "disabled:opacity-50"
                            )}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs font-medium text-muted-foreground">
                            {currentPages.chapters}/{pagination.chapters.totalPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={currentPages.chapters === pagination.chapters.totalPages}
                            onClick={() => handlePageChange('chapters', courseSlug, currentPages.chapters + 1)}
                            className={cn(
                                "h-7 w-7",
                                "hover:bg-primary/10 hover:text-primary",
                                "disabled:opacity-50"
                            )}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
            <SidebarRail />
        </Sidebar>
    );
} 
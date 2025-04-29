'use client';

import { CourseDto } from '@/lib/actions/course';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CreditCard, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface CourseHeaderProps {
    course: CourseDto;
}

export function CourseHeader({ course }: CourseHeaderProps) {
    const router = useRouter();
    const { metadata } = course;

    return (
        <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                            src={metadata.thumbnail}
                            alt={metadata.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex flex-col justify-between">
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold">{metadata.name}</h1>
                            <p className="text-muted-foreground">{metadata.description}</p>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <GraduationCap className="w-4 h-4" />
                                <span>Giảng viên: {metadata.instructor_name}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <Button
                                size="lg"
                                onClick={() => router.push(`/learning/${course.slug}/lessons`)}
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Bài học
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => router.push(`/exercises`)}
                            >
                                <GraduationCap className="w-4 h-4 mr-2" />
                                Bài tập
                            </Button>
                            <Link href={`/payment?courseSlug=${course.slug}`}>
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-300"
                                >
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Đăng ký ngay
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 
import { LearningSidebar } from './_components/learning-sidebar';
import { LessonContent } from './_components/lesson-content';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { LearningProvider } from '@/providers/learning-context';
import { checkEnrollmentByCourseSlug, EnrollmentDto } from '@/lib/actions/enrollment';
import { redirect } from 'next/navigation';
import { ArrowLeft, ArrowRight, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getLessonBySlug } from '@/lib/actions/lesson';
import { LessonDto } from '@/lib/actions/lesson';
import { generateLessonMetadata } from './metadata';
import { checkAllPricingUserAuth } from '@/lib/actions/pricing';
import { Button } from '@/components/ui/button';
import { CourseDto, getCourseBySlug } from '@/lib/actions/course';
import { MY_INFO } from '@/constants/my-info';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ lesson?: string }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
    const { slug } = await params;
    const { lesson: lessonSlug } = await searchParams;
    const enrollmentResponse = await checkEnrollmentByCourseSlug(slug);
    const pricingResponse = await checkAllPricingUserAuth();

    // Kiểm tra đăng ký khóa học
    const isEnrolled = enrollmentResponse.success &&
        enrollmentResponse.result &&
        (enrollmentResponse.result as EnrollmentDto).status === 'active';

    // Kiểm tra quyền truy cập pricing
    const hasPricingAccess = pricingResponse.success && !!pricingResponse.result;

    return (
        <LearningProvider>
            <SidebarProvider>
                <LearningSidebar courseSlug={slug} />
                <SidebarInset className="w-full max-w-[1500px] mx-auto">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-14 bg-background z-10">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <section className="flex justify-between items-center gap-2 w-full">
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/courses/website?page=1&size=10&search="
                                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Home className="h-4 w-4" />
                                    Tất cả khóa học
                                </Link>
                                <h1 className="text-xl font-semibold">Bài học</h1>
                            </div>

                            {!isEnrolled && (
                                <div className="flex gap-2">
                                    {!hasPricingAccess && (
                                        <Link href="/pricing" className="flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors duration-200">
                                            <Sparkles className="h-4 w-4" />
                                            Xem gói học tập
                                        </Link>
                                    )}

                                    <Link href={`/learning/${slug}`} className="flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors duration-200">
                                        Tham gia ngay
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}
                        </section>
                    </header>
                    <div className="flex-1 p-4 md:p-6">
                        <div className="max-w-3xl mx-auto">
                            <LessonContent
                                lessonSlug={lessonSlug}
                                enrollment={isEnrolled || hasPricingAccess}
                            />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </LearningProvider>
    );
};

export default Page;

export async function generateMetadata({ params, searchParams }: PageProps) {
    try {
        const { slug } = await params;
        const { lesson: lessonSlug } = await searchParams;

        // Nếu không có lessonSlug, hiển thị thông tin khóa học
        if (!lessonSlug) {
            // Lấy thông tin khóa học theo slug
            const courseResponse = await getCourseBySlug(slug);

            if (!courseResponse.success || !courseResponse.result) {
                return {
                    title: 'Khóa học không tồn tại',
                    description: 'Không thể tìm thấy khóa học này.'
                };
            }

            const course = Array.isArray(courseResponse.result)
                ? courseResponse.result[0]
                : courseResponse.result as CourseDto;

            // Tạo metadata từ thông tin khóa học
            const currentYear = new Date().getFullYear();
            const { metadata } = course;

            return {
                metadataBase: new URL(MY_INFO.metadataBase),
                title: `${metadata.name} | Danh sách bài học | ${MY_INFO.company}`,
                description: metadata.description,
                keywords: `${metadata.name}, khóa học, ${metadata.instructor_name}, ${metadata.level}, ${MY_INFO.company}, ${MY_INFO.major}`,
                authors: [
                    { name: metadata.instructor_name, url: MY_INFO.socials.facebook },
                    { name: MY_INFO.name, url: MY_INFO.socials.facebook }
                ],
                openGraph: {
                    title: `${metadata.name} | Danh sách bài học`,
                    description: metadata.description,
                    type: 'website',
                    url: `/learning/${slug}/lessons`,
                    siteName: MY_INFO.company,
                    locale: 'vi_VN',
                    images: [
                        {
                            url: metadata.thumbnail,
                            width: 1200,
                            height: 630,
                            alt: metadata.name,
                        }
                    ],
                },
                twitter: {
                    card: 'summary_large_image',
                    title: `${metadata.name} | Danh sách bài học`,
                    description: metadata.description,
                    images: [metadata.thumbnail],
                },
                alternates: {
                    canonical: `/learning/${slug}/lessons`,
                },
                other: {
                    "og:site_name": MY_INFO.company,
                },
            };
        }

        // Fetch lesson data with explicit error handling
        const lessonResponse = await getLessonBySlug(lessonSlug);

        // Log for debugging
        console.log(`Metadata generation for lesson: ${lessonSlug}`);
        console.log(`Response success: ${lessonResponse.success}`);

        if (!lessonResponse.success) {
            console.error(`Failed to fetch lesson: ${lessonResponse.message}`);
            return {
                title: 'Bài học không tồn tại',
                description: 'Không thể tìm thấy bài học này.'
            };
        }

        if (!lessonResponse.result) {
            console.error('Lesson result is empty');
            return {
                title: 'Bài học không có nội dung',
                description: 'Bài học này hiện không có nội dung.'
            };
        }

        // Handle both array and single result formats
        const lesson = Array.isArray(lessonResponse.result)
            ? lessonResponse.result[0]
            : lessonResponse.result;

        if (!lesson) {
            console.error('No lesson found after extraction');
            return {
                title: 'Bài học không tồn tại',
                description: 'Không thể tìm thấy bài học này.'
            };
        }

        // Ensure metadata is complete
        if (!lesson.metadata) {
            console.error('Lesson has no metadata');
            return {
                title: lessonSlug,
                description: 'Nội dung bài học'
            };
        }

        // Generate and return complete metadata with course slug
        return generateLessonMetadata(lesson, slug);
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Bài học',
            description: 'Nội dung bài học'
        };
    }
}


import { CourseDto, getCourseBySlug } from '@/lib/actions/course';
import { CourseDetailHeader, CourseContent, CourseNotFound, CourseHeader } from '@/app/(base)/courses/_components';
import { notFound } from 'next/navigation';
import { generateCourseMetadata } from '@/seo/course';

interface Props {
    params: Promise<{ slug: string }>
}

const Page = async ({ params }: Props) => {
    const { slug } = await params;
    const response = await getCourseBySlug(slug);

    if (!response.success || !response.result) {
        return <CourseNotFound pathname={`/courses/free/${slug}`} />;
    }

    const course = response.result as CourseDto;

    return (
        <main className="container mx-auto py-12 space-y-8 md:px-0 px-4">
            <CourseDetailHeader course={course} />
            <CourseContent content={course.content || ''} />
        </main>
    )
}

export default Page

export const generateMetadata = async ({ params }: Props) => {
    const { slug } = await params;
    const response = await getCourseBySlug(slug);

    if (!response.success || !response.result) {
        notFound();
    }

    const course = response.result as CourseDto;

    return generateCourseMetadata({
        course: {
            data: course
        },
        type: 'website'
    });
}

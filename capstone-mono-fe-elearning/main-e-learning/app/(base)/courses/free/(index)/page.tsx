import { CourseGrid, CourseHeader } from '@/app/(base)/courses/_components';
import { generateCoursesMetadata } from '@/seo/course';
import { getCoursesByType } from '@/lib/actions/course';
import { notFound } from 'next/navigation';

interface SearchParams {
    page: number;
    size: number;
}

interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
    const { page, size } = await searchParams;
    const courses = await getCoursesByType('free', page > 0 ? page : 1, size > 0 ? size : 10);

    if (!courses.success || !courses.result) {
        notFound();
    }

    return (
        <main className="container py-12 space-y-8 mx-auto">
            <CourseHeader
                pathname="/courses/free"
            />
            <CourseGrid
                courses={courses}
                basePath="/courses/free"
            />
        </main>
    )
}

export default Page

export const generateMetadata = async ({ searchParams }: Props) => {
    const { page, size } = await searchParams;
    const courses = await getCoursesByType('free', page > 0 ? page : 1, size > 0 ? size : 10);
    return generateCoursesMetadata({ courses, type: 'free' });
}

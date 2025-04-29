import { getCourses, getCoursesByType } from '@/lib/actions/course';
import { CourseGrid, CourseHeader, CourseNavigation, CoursePageSize, CourseSearch } from '@/app/(base)/courses/_components';
import { generateCoursesMetadata } from '@/seo/course';
import { notFound } from 'next/navigation';

interface SearchParams {
    page: number;
    size: number;
    search: string;
}

interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
    const { page, size, search } = await searchParams;

    const currentPage = Number(page) > 0 ? Number(page) : 1;
    const currentSize = Number(size) > 0 && Number(size) <= 100 ? Number(size) : 10;
    const currentSearch = search ?? '';

    const courses = await getCoursesByType('website', currentPage, currentSize, currentSearch);

    if (!courses.success || !courses.result) {
        notFound();
    }

    const totalPages = courses.pagination?.totalPages ?? 1;

    return (
        <main className="container py-12 space-y-8 mx-auto">
            <CourseHeader
                pathname="/courses/website"
            />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <CourseSearch
                    baseUrl="/courses/website"
                    currentSize={currentSize}
                    defaultValue={currentSearch}
                />
                <CoursePageSize
                    currentSize={currentSize}
                    baseUrl="/courses/website"
                    currentPage={currentPage}
                    search={currentSearch}
                />
            </div>
            <CourseGrid
                courses={courses}
                basePath="/learning"
            />
            <CourseNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/courses/website"
                pageSize={currentSize}
                search={currentSearch}
            />
        </main>
    )
}

export default Page

export const generateMetadata = async ({ searchParams }: Props) => {
    const { page, size } = await searchParams;
    const courses = await getCoursesByType('website', page > 0 ? page : 1, size > 0 ? size : 10);
    return generateCoursesMetadata({ courses, type: 'website' });
}

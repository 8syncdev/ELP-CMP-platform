import { MainPaymentPage } from '@/components/pages/payment';
import { CourseDto } from '@/lib/actions/course';
import { getCourseBySlug } from '@/lib/actions/course/course.actions';
import { notFound } from 'next/navigation';
import React from 'react'

interface Props {
    searchParams: Promise<{ courseSlug: string }>
}

const page = async ({ searchParams }: Props) => {
    const { courseSlug } = await searchParams;

    const course = await getCourseBySlug(courseSlug);

    if (!course.success || !course.result) {
        notFound();
    }

    return (
        <MainPaymentPage course={course.result as CourseDto} />
    )
}

export default page
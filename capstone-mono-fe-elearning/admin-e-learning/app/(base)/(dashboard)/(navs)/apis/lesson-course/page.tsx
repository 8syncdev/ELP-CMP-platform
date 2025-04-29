import { getLessonCourses, LessonCourseDto } from '@/lib/actions/lesson'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LessonCourseTable, LessonCourse } from './_components'

interface Props {
    searchParams: Promise<{
        page?: string
        limit?: string
        search?: string
    }>
}

const LessonCoursePage = async ({ searchParams }: Props) => {
    // Lấy giá trị mặc định nếu không có
    const { page, limit, search } = await searchParams
    const currentPage = Number(page) || 1
    const pageSize = Number(limit) || 10
    const searchQuery = search || ''

    // Gọi API với phân trang
    const lessonCourses = await getLessonCourses(currentPage, pageSize, searchQuery)
    const totalPages = lessonCourses.pagination?.totalPages || 1

    // Chuyển đổi LessonCourseDto[] sang LessonCourse[]
    const formattedLessonCourses = (lessonCourses?.result as LessonCourseDto[]) || []

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh sách liên kết bài học - khóa học</CardTitle>
                </CardHeader>
                <CardContent>
                    <LessonCourseTable
                        data={formattedLessonCourses as LessonCourse[]}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        limit={pageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default LessonCoursePage 
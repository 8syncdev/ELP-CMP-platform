import { getCourses, CourseDto } from '@/lib/actions/course'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseTable, Course } from './_components'

interface Props {
    searchParams: Promise<{
        page: string
        limit: string
        search: string
    }>
}

const CoursesPage = async ({ searchParams }: Props) => {
    const { page, limit, search } = await searchParams

    // Lấy giá trị mặc định nếu không có
    const currentPage = Number(page) || 1
    const pageSize = Number(limit) || 10

    // Gọi API với phân trang
    const courses = await getCourses(currentPage, pageSize, search || '')
    const totalPages = courses.pagination?.totalPages || 1

    // Chuyển đổi CourseDto[] sang Course[]
    const formattedCourses = (courses?.result as CourseDto[]) || []

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh sách khóa học</CardTitle>
                </CardHeader>
                <CardContent>
                    <CourseTable
                        data={formattedCourses as Course[]}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        limit={pageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default CoursesPage 
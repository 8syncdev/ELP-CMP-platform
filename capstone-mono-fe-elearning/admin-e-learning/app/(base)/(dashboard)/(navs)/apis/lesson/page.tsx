import { getLessons, LessonDto } from '@/lib/actions/lesson'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LessonTable, Lesson } from './_components'

interface Props {
    searchParams: Promise<{
        page?: string
        limit?: string
        search?: string
    }>
}

const LessonsPage = async ({ searchParams }: Props) => {
    // Lấy giá trị mặc định nếu không có
    const { page, limit, search } = await searchParams
    const currentPage = Number(page) || 1
    const pageSize = Number(limit) || 10
    const searchQuery = search || ''

    // Gọi API với phân trang và tìm kiếm
    const lessons = await getLessons(currentPage, pageSize, searchQuery)
    const totalPages = lessons.pagination?.totalPages || 1

    // Chuyển đổi LessonDto[] sang Lesson[]
    const formattedLessons = (lessons?.result as LessonDto[]) || []

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh sách bài học</CardTitle>
                </CardHeader>
                <CardContent>
                    <LessonTable
                        data={formattedLessons as Lesson[]}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        limit={pageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default LessonsPage 
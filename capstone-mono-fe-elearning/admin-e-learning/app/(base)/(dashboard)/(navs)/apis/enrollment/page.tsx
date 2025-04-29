import { getEnrollments, EnrollmentDto } from '@/lib/actions/enrollment'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnrollmentTable, Enrollment } from './_components'

interface Props {
    searchParams: Promise<{
        page?: string
        limit?: string
        search?: string
    }>
}

const EnrollmentsPage = async ({ searchParams }: Props) => {
    // Lấy giá trị mặc định nếu không có
    const { page, limit, search } = await searchParams
    const currentPage = Number(page) || 1
    const pageSize = Number(limit) || 10
    const searchQuery = search || ''

    // Gọi API với phân trang và tìm kiếm
    const enrollments = await getEnrollments(currentPage, pageSize, searchQuery)
    const totalPages = enrollments.pagination?.totalPages || 1

    // Chuyển đổi EnrollmentDto[] sang Enrollment[]
    const formattedEnrollments = (enrollments?.result as EnrollmentDto[]) || []

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh sách đăng ký khóa học</CardTitle>
                </CardHeader>
                <CardContent>
                    <EnrollmentTable
                        data={formattedEnrollments as Enrollment[]}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        limit={pageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default EnrollmentsPage 
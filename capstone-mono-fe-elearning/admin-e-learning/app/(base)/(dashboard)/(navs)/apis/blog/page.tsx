import { getBlogs, BlogDto } from '@/lib/actions/blog'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogTable, Blog } from './_components'

interface Props {
    searchParams: Promise<{
        page?: string
        limit?: string
        search?: string
    }>
}

const BlogsPage = async ({ searchParams }: Props) => {
    // Lấy giá trị mặc định nếu không có
    const { page, limit, search } = await searchParams
    const currentPage = Number(page) || 1
    const pageSize = Number(limit) || 10
    const searchQuery = search || ''

    // Gọi API với phân trang và tìm kiếm
    const blogs = await getBlogs(currentPage, pageSize, searchQuery)
    const totalPages = blogs.pagination?.totalPages || 1

    // Chuyển đổi BlogDto[] sang Blog[]
    const formattedBlogs = (blogs?.result as BlogDto[]) || []

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh sách bài viết</CardTitle>
                </CardHeader>
                <CardContent>
                    <BlogTable
                        data={formattedBlogs as Blog[]}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        limit={pageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default BlogsPage 
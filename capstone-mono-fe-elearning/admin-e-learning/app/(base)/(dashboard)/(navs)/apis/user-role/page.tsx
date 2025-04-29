import { getUserRoles } from '@/lib/actions/role'
import React from 'react'
import { UserRoleTable, UserRole } from './_components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
    searchParams: Promise<{
        page?: string
        limit?: string
        search?: string
    }>
}

const UserRolePage = async ({ searchParams }: Props) => {
    // Lấy giá trị mặc định nếu không có
    const { page, limit, search } = await searchParams
    const currentPage = Number(page) || 1
    const pageSize = Number(limit) || 10
    const searchQuery = search || ''

    const response = await getUserRoles(currentPage, pageSize, searchQuery)

    const userRoles = response.result || []
    const totalPages = response.pagination?.totalPages || 1

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Quản lý vai trò người dùng</CardTitle>
                </CardHeader>
                <CardContent>
                    <UserRoleTable
                        data={userRoles as UserRole[]}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        limit={pageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default UserRolePage 
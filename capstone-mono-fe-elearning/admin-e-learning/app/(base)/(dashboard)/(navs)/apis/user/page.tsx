import { getUsers, UsersDto } from '@/lib/actions/user'
import React from 'react'
import { User, UserTable } from './_components'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
    searchParams: Promise<{
        page?: string
        limit?: string
        search?: string
    }>
}

const UsersPage = async ({ searchParams }: Props) => {
    // Lấy giá trị mặc định nếu không có
    const { page, limit, search } = await searchParams
    const currentPage = Number(page) || 1
    const pageSize = Number(limit) || 10
    const searchQuery = search || ''

    const users = await getUsers(currentPage, pageSize, searchQuery)
    const totalPages = users.pagination?.totalPages || 1

    // Chuyển đổi UsersDto[] sang User[] với các trường bổ sung
    const formattedUsers = (users?.result as UsersDto[])?.map(user => ({
        ...user,
        avatar: user.avatar ? `https://www.gravatar.com/avatar/${Buffer.from(user.avatar).toString('hex')}?d=mp` : undefined
    })) || []

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh sách người dùng</CardTitle>
                </CardHeader>
                <CardContent>
                    <UserTable
                        data={formattedUsers as User[]}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        limit={pageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default UsersPage
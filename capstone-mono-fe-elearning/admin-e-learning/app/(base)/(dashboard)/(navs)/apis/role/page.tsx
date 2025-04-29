import { getRoles } from '@/lib/actions/role'
import React from 'react'
import { RoleDto } from '@/lib/actions/role/role.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RoleTable } from './_components'

interface Props {
    searchParams: Promise<{
        page: string
        limit: string
        search: string
    }>
}

const RolesPage = async ({ searchParams }: Props) => {
    const { page, limit, search } = await searchParams

    const roles = await getRoles(Number(page) || 1, Number(limit) || 10, search)
    const totalPages = roles.pagination?.totalPages || 1

    // Chuyển đổi result thành mảng RoleDto
    const rolesList = Array.isArray(roles.result)
        ? roles.result as RoleDto[]
        : roles.result
            ? [roles.result as RoleDto]
            : []

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh sách vai trò</CardTitle>
                </CardHeader>
                <CardContent>
                    <RoleTable
                        data={rolesList}
                        totalPages={totalPages}
                        currentPage={Number(page) || 1}
                        limit={Number(limit) || 10}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default RolesPage 
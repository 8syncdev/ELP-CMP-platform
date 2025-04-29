import { getAllPricingUsers, PricingUserDto } from '@/lib/actions/pricing'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PricingUserTable, PricingUser } from './_components'

interface Props {
    searchParams: Promise<{
        page?: string
        limit?: string
        search?: string
    }>
}

const PricingUsersPage = async ({ searchParams }: Props) => {
    // Get default values if not provided
    const { page, limit, search } = await searchParams
    const currentPage = Number(page) || 1
    const pageSize = Number(limit) || 10
    const searchQuery = search || ''

    // Call API with pagination and search
    const pricingUsers = await getAllPricingUsers(currentPage, pageSize, searchQuery)
    const totalPages = pricingUsers.pagination?.totalPages || 1

    // Convert PricingUserDto[] to PricingUser[]
    const formattedPricingUsers = (pricingUsers?.result as PricingUserDto[]) || []

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh sách người dùng gói giá</CardTitle>
                </CardHeader>
                <CardContent>
                    <PricingUserTable
                        data={formattedPricingUsers as PricingUser[]}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        limit={pageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default PricingUsersPage 
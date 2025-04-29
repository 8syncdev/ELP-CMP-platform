import { getPricings, PricingDto } from '@/lib/actions/pricing'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PricingTable, Pricing } from './_components'

interface Props {
    searchParams: Promise<{
        page?: string
        limit?: string
        search?: string
    }>
}

const PricingsPage = async ({ searchParams }: Props) => {
    // Get default values if not provided
    const { page, limit, search } = await searchParams
    const currentPage = Number(page) || 1
    const pageSize = Number(limit) || 10
    const searchQuery = search || ''

    // Call API with pagination and search
    const pricings = await getPricings(currentPage, pageSize, searchQuery)
    const totalPages = pricings.pagination?.totalPages || 1

    // Convert PricingDto[] to Pricing[]
    const formattedPricings = (pricings?.result as PricingDto[]) || []

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh sách gói giá</CardTitle>
                </CardHeader>
                <CardContent>
                    <PricingTable
                        data={formattedPricings as Pricing[]}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        limit={pageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default PricingsPage 
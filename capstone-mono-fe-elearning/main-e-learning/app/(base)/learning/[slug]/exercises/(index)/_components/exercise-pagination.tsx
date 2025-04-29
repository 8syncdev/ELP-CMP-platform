'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface ExercisePaginationProps {
    currentPage: number
    totalPages: number
    pageSize: number
}

export const ExercisePagination = ({
    currentPage,
    totalPages,
    pageSize
}: ExercisePaginationProps) => {
    const searchParams = useSearchParams()

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        params.set('size', pageSize.toString())
        return `?${params.toString()}`
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Link href={createPageUrl(currentPage - 1)}
                aria-disabled={currentPage <= 1}
                className={currentPage <= 1 ? 'pointer-events-none' : ''}>
                <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div className="text-sm">
                Trang {currentPage} / {totalPages}
            </div>
            <Link href={createPageUrl(currentPage + 1)}
                aria-disabled={currentPage >= totalPages}
                className={currentPage >= totalPages ? 'pointer-events-none' : ''}>
                <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage >= totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </Link>
        </div>
    )
} 
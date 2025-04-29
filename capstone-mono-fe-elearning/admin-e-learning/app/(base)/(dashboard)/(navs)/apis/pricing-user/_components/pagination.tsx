"use client"

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface PaginationProps {
    totalPages: number
    currentPage: number
    limit: number
}

export function Pagination({ totalPages, currentPage, limit }: PaginationProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    // Create array of pages to display
    const generatePagination = () => {
        // If total pages <= 7, display all
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        // Always display first and last pages
        const startPages = [1, 2]
        const endPages = [totalPages - 1, totalPages]

        // Current page and adjacent pages
        const siblingsStart = Math.max(
            3,
            currentPage - 1
        )
        const siblingsEnd = Math.min(
            totalPages - 2,
            currentPage + 1
        )

        // Check if need to display "..."
        const showLeftDots = siblingsStart > 3
        const showRightDots = siblingsEnd < totalPages - 2

        // Determine array of pages to display
        if (showLeftDots && showRightDots) {
            const middlePages = [siblingsStart, currentPage, siblingsEnd].filter(
                (page, index, array) => array.indexOf(page) === index
            )
            return [...startPages, '...', ...middlePages, '...', ...endPages]
        }

        if (showLeftDots && !showRightDots) {
            const middlePages = Array.from(
                { length: siblingsEnd - 2 + 1 },
                (_, i) => i + 3
            )
            return [...startPages, '...', ...middlePages, ...endPages]
        }

        if (!showLeftDots && showRightDots) {
            const middlePages = Array.from(
                { length: siblingsEnd - 2 + 1 },
                (_, i) => i + 3
            )
            return [...startPages, ...middlePages, '...', ...endPages]
        }

        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages = generatePagination()

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        replace(`${pathname}?${params.toString()}`)
    }

    const handleLimitChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('limit', value)
        params.set('page', '1')
        replace(`${pathname}?${params.toString()}`)
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                    Hiển thị
                </p>
                <Select
                    value={limit.toString()}
                    onValueChange={handleLimitChange}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={limit.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                    kết quả mỗi trang
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                >
                    <span className="sr-only">Trang đầu</span>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <span className="sr-only">Trang trước</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center">
                    {pages.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-2">...</span>
                            ) : (
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handlePageChange(Number(page))}
                                    disabled={currentPage === page}
                                >
                                    <span className="sr-only">Trang {page}</span>
                                    {page}
                                </Button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <span className="sr-only">Trang tiếp</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <span className="sr-only">Trang cuối</span>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
} 
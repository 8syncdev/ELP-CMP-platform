"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'
import { useCallback } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

interface PaginationProps {
    totalPages: number
    currentPage: number
    limit: number
}

export function Pagination({ totalPages, currentPage, limit }: PaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Hàm cập nhật URL với tham số page và limit
    const createQueryString = useCallback(
        (params: { [key: string]: string }) => {
            const newParams = new URLSearchParams(searchParams.toString())

            // Cập nhật các tham số
            Object.entries(params).forEach(([name, value]) => {
                newParams.set(name, value)
            })

            return newParams.toString()
        },
        [searchParams]
    )

    // Hàm tạo URL cho phân trang
    const createPageURL = (pageNumber: number, itemLimit: number) => {
        return `${pathname}?${createQueryString({
            'page': pageNumber.toString(),
            'limit': itemLimit.toString()
        })}`
    }

    // Hàm xử lý khi thay đổi số lượng mục trên trang
    const handleLimitChange = (newLimit: string) => {
        router.push(createPageURL(1, parseInt(newLimit)))
    }

    // Tạo mảng các số trang hiển thị
    const renderPaginationItems = () => {
        const items = []
        const maxVisiblePages = 5

        // Luôn hiển thị trang đầu tiên
        items.push(
            <Link key={1} href={createPageURL(1, limit)}>
                <Button
                    variant={currentPage === 1 ? 'default' : 'outline'}
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                >
                    1
                </Button>
            </Link>
        )

        // Tính toán khoảng hiển thị
        let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)

        if (endPage - startPage < maxVisiblePages - 3) {
            startPage = Math.max(2, endPage - maxVisiblePages + 3)
        }

        // Hiển thị dấu "..." nếu không bắt đầu từ trang 2
        if (startPage > 2) {
            items.push(
                <Button key="start-ellipsis" variant="outline" size="icon" className="h-8 w-8" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            )
        }

        // Hiển thị các trang giữa
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Link key={i} href={createPageURL(i, limit)}>
                    <Button
                        variant={currentPage === i ? 'default' : 'outline'}
                        size="icon"
                        className="h-8 w-8"
                    >
                        {i}
                    </Button>
                </Link>
            )
        }

        // Hiển thị dấu "..." nếu không kết thúc ở trang totalPages - 1
        if (endPage < totalPages - 1) {
            items.push(
                <Button key="end-ellipsis" variant="outline" size="icon" className="h-8 w-8" disabled>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            )
        }

        // Luôn hiển thị trang cuối cùng nếu có nhiều hơn 1 trang
        if (totalPages > 1) {
            items.push(
                <Link key={totalPages} href={createPageURL(totalPages, limit)}>
                    <Button
                        variant={currentPage === totalPages ? 'default' : 'outline'}
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage === totalPages}
                    >
                        {totalPages}
                    </Button>
                </Link>
            )
        }

        return items
    }

    return (
        <div className="flex items-center justify-between mt-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Hiển thị</p>
                <Select
                    defaultValue={limit.toString()}
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
                <p className="text-sm text-muted-foreground">mục mỗi trang</p>
            </div>

            <div className="flex items-center space-x-2">
                <Link href={createPageURL(1, limit)} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        className="h-8 w-8"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={createPageURL(Math.max(1, currentPage - 1), limit)} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        className="h-8 w-8"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>

                {renderPaginationItems()}

                <Link href={createPageURL(Math.min(totalPages, currentPage + 1), limit)} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages}
                        className="h-8 w-8"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={createPageURL(totalPages, limit)} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages}
                        className="h-8 w-8"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    )
} 
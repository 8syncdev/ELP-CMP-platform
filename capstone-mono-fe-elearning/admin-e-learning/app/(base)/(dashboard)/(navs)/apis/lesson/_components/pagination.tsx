"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
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

    const createPageURL = (pageNumber: number, limit: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", pageNumber.toString())
        params.set("limit", limit.toString())
        return `${pathname}?${params.toString()}`
    }

    const handleLimitChange = (newLimit: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", "1")
        params.set("limit", newLimit)
        router.push(`${pathname}?${params.toString()}`)
    }

    // Tạo mảng các trang cần hiển thị
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            // Hiển thị tất cả các trang nếu tổng số trang ít hơn số trang tối đa cần hiển thị
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Luôn hiển thị trang đầu tiên
            pageNumbers.push(1)

            // Tính toán các trang cần hiển thị xung quanh trang hiện tại
            let startPage = Math.max(2, currentPage - 1)
            let endPage = Math.min(totalPages - 1, currentPage + 1)

            // Điều chỉnh nếu đang ở gần trang đầu hoặc cuối
            if (currentPage <= 2) {
                endPage = 3
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 2
            }

            // Thêm dấu ... nếu cần thiết
            if (startPage > 2) {
                pageNumbers.push("ellipsis-start")
            }

            // Thêm các trang ở giữa
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i)
            }

            // Thêm dấu ... nếu cần thiết
            if (endPage < totalPages - 1) {
                pageNumbers.push("ellipsis-end")
            }

            // Luôn hiển thị trang cuối cùng
            pageNumbers.push(totalPages)
        }

        return pageNumbers
    }

    const pageNumbers = getPageNumbers()

    if (totalPages <= 1) return null

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
                <p className="text-sm text-muted-foreground">bài học mỗi trang</p>
            </div>

            <div className="flex items-center space-x-2">
                <Link
                    href={createPageURL(1, limit)}
                    className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                >
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        className="transition-all duration-300 hover:scale-105"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <Link
                    href={createPageURL(Math.max(1, currentPage - 1), limit)}
                    className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                >
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === 1}
                        className="transition-all duration-300 hover:scale-105"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>

                <div className="flex space-x-1">
                    {pageNumbers.map((page, index) => (
                        page === "ellipsis-start" || page === "ellipsis-end" ? (
                            <Button
                                key={`ellipsis-${index}`}
                                variant="outline"
                                size="icon"
                                disabled
                                className="cursor-default w-8 h-8"
                            >
                                ...
                            </Button>
                        ) : (
                            <Link
                                key={index}
                                href={createPageURL(page as number, limit)}
                                className="block"
                            >
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="icon"
                                    className={`w-8 h-8 transition-all duration-300 ${currentPage === page
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-primary/10 hover:scale-105"
                                        }`}
                                >
                                    {page}
                                </Button>
                            </Link>
                        )
                    ))}
                </div>

                <Link
                    href={createPageURL(Math.min(totalPages, currentPage + 1), limit)}
                    className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                >
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages}
                        className="transition-all duration-300 hover:scale-105"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </Link>
                <Link
                    href={createPageURL(totalPages, limit)}
                    className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                >
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages}
                        className="transition-all duration-300 hover:scale-105"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    )
} 
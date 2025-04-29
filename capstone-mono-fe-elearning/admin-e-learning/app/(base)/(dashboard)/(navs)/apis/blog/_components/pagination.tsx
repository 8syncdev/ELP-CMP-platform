"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface PaginationProps {
    totalPages: number
    currentPage: number
    limit: number
}

export function Pagination({ totalPages, currentPage, limit }: PaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Hàm tạo mảng số trang để hiển thị
    const generatePagination = (current: number, total: number): (number | "ellipsis")[] => {
        // Nếu tổng số trang <= 7, hiển thị tất cả các trang
        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1)
        }

        // Nếu trang hiện tại nằm ở đầu (<=3)
        if (current <= 3) {
            return [1, 2, 3, 4, 5, "ellipsis", total]
        }

        // Nếu trang hiện tại nằm ở cuối (>= total-2)
        if (current >= total - 2) {
            return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total]
        }

        // Nếu trang hiện tại nằm ở giữa
        return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total]
    }

    // Tạo mảng số trang để hiển thị
    const paginationItems = generatePagination(currentPage, totalPages)

    // Hàm xử lý chuyển trang
    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    // Hàm xử lý thay đổi số lượng item mỗi trang
    const handleLimitChange = (newLimit: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("limit", newLimit.toString())
        params.set("page", "1") // Reset về trang 1 khi thay đổi limit
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Hiển thị</span>
                <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="h-8 w-16 rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <span className="text-sm text-muted-foreground">bài viết mỗi trang</span>
            </div>

            <div className="flex items-center space-x-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="hidden sm:inline-flex"
                >
                    <span className="sr-only">Trang đầu tiên</span>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <span className="sr-only">Trang trước</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Hiển thị các số trang hoặc dấu ... */}
                <div className="hidden sm:flex items-center">
                    {paginationItems.map((item, index) => (
                        item === "ellipsis" ? (
                            <span key={`ellipsis-${index}`} className="px-3 py-1 text-sm text-muted-foreground">
                                ...
                            </span>
                        ) : (
                            <Button
                                key={item}
                                variant={currentPage === item ? "default" : "outline"}
                                className="h-8 w-8"
                                onClick={() => handlePageChange(item)}
                            >
                                {item}
                            </Button>
                        )
                    ))}
                </div>

                {/* Hiển thị trang hiện tại trên mobile */}
                <span className="text-sm px-3 py-1 sm:hidden">
                    Trang {currentPage} / {totalPages}
                </span>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <span className="sr-only">Trang sau</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="hidden sm:inline-flex"
                >
                    <span className="sr-only">Trang cuối cùng</span>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
} 
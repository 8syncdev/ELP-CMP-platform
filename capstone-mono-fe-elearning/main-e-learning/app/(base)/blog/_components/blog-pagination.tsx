'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface BlogPaginationProps {
    currentPage: number;
    totalPages: number;
}

export function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    // No pagination needed if only one page
    if (totalPages <= 1) {
        return null;
    }

    // Generate page numbers to display
    const generatePagination = () => {
        // Always show first and last page
        // Show 2 pages before and after current page when possible
        const pageNumbers = [];

        if (totalPages <= 7) {
            // If 7 or fewer pages, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always include first page
            pageNumbers.push(1);

            // Add ellipsis if current page is far from start
            if (currentPage > 3) {
                pageNumbers.push(-1); // -1 represents ellipsis
            }

            // Add pages around current page
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            // Add ellipsis if current page is far from end
            if (currentPage < totalPages - 2) {
                pageNumbers.push(-1); // -1 represents ellipsis
            }

            // Always include last page
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const pages = generatePagination();

    return (
        <div className="flex items-center justify-center gap-1 mt-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(createPageURL(currentPage - 1))}
                disabled={currentPage <= 1}
                aria-label="Trang trước"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pages.map((pageNumber, i) =>
                pageNumber === -1 ? (
                    <span key={`ellipsis-${i}`} className="px-3 py-2">...</span>
                ) : (
                    <Button
                        key={pageNumber}
                        variant={pageNumber === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                            if (pageNumber !== currentPage) {
                                router.push(createPageURL(pageNumber));
                            }
                        }}
                        aria-label={`Trang ${pageNumber}`}
                        aria-current={pageNumber === currentPage ? "page" : undefined}
                    >
                        {pageNumber}
                    </Button>
                )
            )}

            <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(createPageURL(currentPage + 1))}
                disabled={currentPage >= totalPages}
                aria-label="Trang sau"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
} 
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface CourseNavigationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    pageSize: number;
    search?: string;
}

export function CourseNavigation({ currentPage, totalPages, baseUrl, pageSize, search = '' }: CourseNavigationProps) {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="outline"
                disabled={currentPage <= 1}
            >
                <Link
                    href={`${baseUrl}?page=${currentPage - 1}&size=${pageSize}${searchParam}`}
                    className="flex items-center"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Trang trước
                </Link>
            </Button>

            <div className="flex items-center gap-2 px-4">
                <span className="text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages}
                </span>
            </div>

            <Button
                variant="outline"
                disabled={currentPage >= totalPages}
            >
                <Link
                    href={`${baseUrl}?page=${currentPage + 1}&size=${pageSize}${searchParam}`}
                    className="flex items-center"
                >
                    Trang sau
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </Button>
        </div>
    );
}
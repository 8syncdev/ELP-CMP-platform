import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CoursePageSizeProps {
    currentSize: number;
    baseUrl: string;
    currentPage: number;
    search?: string;
}

const PAGE_SIZES = [10, 20, 50];

export function CoursePageSize({ currentSize, baseUrl, currentPage, search = '' }: CoursePageSizeProps) {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Hiển thị:</span>
            <div className="flex gap-1">
                {PAGE_SIZES.map((size) => (
                    <Button
                        key={size}
                        variant={currentSize === size ? "default" : "outline"}
                        size="sm"
                        className="px-3"
                    >
                        <Link href={`${baseUrl}?page=1&size=${size}${searchParam}`}>
                            {size}
                        </Link>
                    </Button>
                ))}
            </div>
        </div>
    );
} 
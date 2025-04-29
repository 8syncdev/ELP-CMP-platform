import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CourseSearchProps {
    baseUrl: string;
    currentSize: number;
    defaultValue?: string;
}

const HOT_SEARCHES = [
    "Trí tuệ nhân tạo",
    "Machine Learning",
    "Lập trình web",
    "Neural Network",
    "JavaScript",
    "React",
    "Next.js",
    "TypeScript"
];

export function CourseSearch({ baseUrl, currentSize, defaultValue = '' }: CourseSearchProps) {
    const [searchTerm, setSearchTerm] = useState(defaultValue);

    return (
        <div className="w-full max-w-sm space-y-4">
            <div className="relative">
                <div className="relative flex-1">
                    <Input
                        placeholder="Tìm kiếm khóa học..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 pl-4 h-11 bg-background border-2 focus-visible:ring-2 focus-visible:ring-offset-0 transition-colors"
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        asChild
                    >
                        <Link href={`${baseUrl}?page=1&size=${currentSize}&search=${encodeURIComponent(searchTerm)}`}>
                            <Search className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3" />
                    <span>Tìm kiếm phổ biến</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {HOT_SEARCHES.map((term) => (
                        <Link
                            key={term}
                            href={`${baseUrl}?page=1&size=${currentSize}&search=${encodeURIComponent(term)}`}
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs bg-background hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-200"
                            >
                                {term}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
} 
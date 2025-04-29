import { Skeleton } from "@/components/ui/skeleton";

export function LessonSkeleton() {
    return (
        <div className="space-y-2 px-2">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
        </div>
    );
} 
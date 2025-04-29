import { Skeleton } from '@/components/ui/skeleton';

export function LearningSkeleton() {
    return (
        <div className="space-y-4 p-4">
            <Skeleton className="h-12 w-full" />
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
        </div>
    );
} 
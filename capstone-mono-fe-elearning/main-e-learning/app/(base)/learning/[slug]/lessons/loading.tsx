import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";

export default function LoadingLearning() {
    return (
        <div className="flex h-full">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:block w-[300px] mt-16 border-r">
                <div className="p-4 border-b">
                    <Skeleton className="h-6 w-[200px]" />
                </div>
                <div className="p-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-8 w-full" />
                            <div className="pl-4 space-y-2">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <Skeleton key={j} className="h-6 w-[90%]" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Skeleton */}
            <SidebarInset className="w-full max-w-[1500px] mx-auto">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <Skeleton className="h-8 w-8" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Skeleton className="h-6 w-24" />
                </header>
                <div className="flex-1 p-4 md:p-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-muted/30 p-6 rounded-lg">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-6" />
                            ))}
                        </div>

                        {/* Content Skeleton */}
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full" />
                            ))}
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-[200px] w-full" />
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </div>
    );
}

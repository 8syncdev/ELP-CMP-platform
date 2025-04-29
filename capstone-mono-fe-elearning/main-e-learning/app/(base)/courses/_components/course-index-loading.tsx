
import { Skeleton } from "@/components/ui/skeleton"

export const CourseIndexLoading = () => {
    return (
        <main className="container py-12 space-y-8 mx-auto">
            <div className="space-y-4">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-4 w-[450px]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="space-y-4">
                        <Skeleton className="aspect-video rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </main>
    )
}


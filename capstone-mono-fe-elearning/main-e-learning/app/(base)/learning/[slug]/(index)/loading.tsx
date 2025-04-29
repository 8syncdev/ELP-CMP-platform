'use client';

import { FC } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const CourseLoading: FC = () => {
    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Course Header Skeleton */}
            <Card className="border-2 border-primary/20">
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="aspect-video rounded-lg" />
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex gap-4 mt-6">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Course Info Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-6 w-40" />
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton className="h-5 w-5" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="p-6 space-y-6">
                        <Skeleton className="h-6 w-24" />
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-40" />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Course Content Skeleton */}
            <Card className="p-6">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </Card>
        </div>
    );
}

export default CourseLoading;

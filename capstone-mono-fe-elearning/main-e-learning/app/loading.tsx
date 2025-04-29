'use client';

import { FC } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const RootLoading: FC = () => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
            <div className="container h-full mx-auto">
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                    {/* Logo loading */}
                    <div className="relative">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    </div>

                    {/* Loading text */}
                    <Card className="w-full max-w-md p-6 flex flex-col items-center space-y-4">
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-4 w-3/4 mx-auto" />
                            <Skeleton className="h-4 w-1/2 mx-auto" />
                        </div>

                        {/* Loading progress */}
                        <div className="w-full space-y-2">
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full animate-progress"
                                    style={{
                                        width: '75%',
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Đang tải dữ liệu...</span>
                                <span>75%</span>
                            </div>
                        </div>
                    </Card>

                    {/* Loading hints */}
                    <div className="text-center space-y-1 animate-pulse">
                        <p className="text-sm text-muted-foreground">
                            Vui lòng đợi trong giây lát
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                            Hệ thống đang xử lý yêu cầu của bạn
                        </p>
                    </div>
                </div>
            </div>

            {/* Add animation keyframes to global.css */}
            <style jsx global>{`
                @keyframes progress {
                    0% {
                        width: 0%;
                    }
                    50% {
                        width: 75%;
                    }
                    100% {
                        width: 100%;
                    }
                }
                
                .animate-progress {
                    animation: progress 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default RootLoading; 
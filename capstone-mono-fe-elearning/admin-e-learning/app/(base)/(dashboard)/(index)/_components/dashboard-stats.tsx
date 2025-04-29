"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRealtime } from "@/providers/realtime-provider"
import { ArrowDown, ArrowUp, MinusIcon, Users, BookOpen, FileText, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber } from "@/lib/utils"

// Define interfaces for the dashboard statistics
interface DashboardStat {
    title: string;
    value: number;
    change: number;
    prefix?: string;
    suffix?: string;
    icon?: React.ReactNode;
    iconClassName?: string;
}

// Default values to handle missing or invalid data
const DEFAULT_STAT: DashboardStat = {
    title: "Unknown",
    value: 0,
    change: 0,
    prefix: "",
    suffix: ""
};

export const DashboardStats = () => {
    const realtimeData = useRealtime();

    // Process and map API data to our component's expected format
    const dashboardStats = useMemo(() => {
        // If realtimeData is undefined or not an object, use defaults
        if (!realtimeData || typeof realtimeData !== 'object' || !realtimeData.dashboardData) {
            return {
                loading: true,
                stats: [
                    { ...DEFAULT_STAT, title: "Người dùng", icon: <Users className="h-4 w-4 text-blue-600" />, iconClassName: "bg-blue-100 group-hover:bg-blue-200" },
                    { ...DEFAULT_STAT, title: "Khóa học", icon: <BookOpen className="h-4 w-4 text-green-600" />, iconClassName: "bg-green-100 group-hover:bg-green-200" },
                    { ...DEFAULT_STAT, title: "Bài học", icon: <FileText className="h-4 w-4 text-amber-600" />, iconClassName: "bg-amber-100 group-hover:bg-amber-200" },
                    { ...DEFAULT_STAT, title: "Đăng ký", icon: <TrendingUp className="h-4 w-4 text-purple-600" />, iconClassName: "bg-purple-100 group-hover:bg-purple-200" }
                ]
            };
        }

        const { dashboardData } = realtimeData;

        // Map API data to component's expected format
        return {
            loading: Boolean(dashboardData.loading),
            stats: [
                {
                    title: "Người dùng",
                    value: dashboardData.totalUsers || 0,
                    change: 5, // Example change value, ideally would come from API
                    icon: <Users className="h-4 w-4 text-blue-600" />,
                    iconClassName: "bg-blue-100 group-hover:bg-blue-200"
                },
                {
                    title: "Khóa học",
                    value: dashboardData.totalCourses || 0,
                    change: 2, // Example change value, ideally would come from API
                    icon: <BookOpen className="h-4 w-4 text-green-600" />,
                    iconClassName: "bg-green-100 group-hover:bg-green-200"
                },
                {
                    title: "Bài học",
                    value: dashboardData.totalLessons || 0,
                    change: 10, // Example change value, ideally would come from API
                    icon: <FileText className="h-4 w-4 text-amber-600" />,
                    iconClassName: "bg-amber-100 group-hover:bg-amber-200"
                },
                {
                    title: "Đăng ký",
                    value: dashboardData.totalEnrollments || 0,
                    change: 8, // Example change value, ideally would come from API
                    icon: <TrendingUp className="h-4 w-4 text-purple-600" />,
                    iconClassName: "bg-purple-100 group-hover:bg-purple-200"
                }
            ]
        };
    }, [realtimeData]);

    // Show loading skeleton if data is loading or missing
    if (!realtimeData || dashboardStats.loading) {
        return <StatsLoadingSkeleton />;
    }

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {dashboardStats.stats.map((stat, index) => (
                <StatCard
                    key={stat.title}
                    stat={stat}
                    delay={index * 50}
                />
            ))}
        </div>
    )
}

interface StatCardProps {
    stat: DashboardStat;
    delay?: number;
}

const StatCard = ({ stat, delay = 0 }: StatCardProps) => {
    const { title, value, change, prefix, suffix, icon, iconClassName } = stat;

    return (
        <Card
            className="border-none shadow-md overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] group"
            style={{ animationDelay: `${delay}ms` }}
        >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && (
                    <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                        iconClassName
                    )}>
                        {icon}
                    </div>
                )}
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-xl font-bold">
                    {prefix}{formatNumber(value)}{suffix}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                    <ChangeIndicator change={change} />
                    <span className="ml-1">{getChangeDescription(change)}</span>
                </div>
            </CardContent>
        </Card>
    )
}

// Helper component to show change indicator icon with appropriate color
const ChangeIndicator = ({ change }: { change: number }) => {
    if (change > 0) {
        return <ArrowUp className="h-3 w-3 text-emerald-500" />;
    } else if (change < 0) {
        return <ArrowDown className="h-3 w-3 text-rose-500" />;
    } else {
        return <MinusIcon className="h-3 w-3 text-slate-500" />;
    }
};

// Helper function to generate description text based on change
const getChangeDescription = (change: number): string => {
    const absChange = Math.abs(change);

    if (change === 0) {
        return "không thay đổi";
    }

    return change > 0
        ? `tăng ${absChange}%`
        : `giảm ${absChange}%`;
};

// Loading skeleton for stats
const StatsLoadingSkeleton = () => {
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {[1, 2, 3, 4].map(index => (
                <Card key={index} className="border-none shadow-md">
                    <CardHeader className="py-4 px-4 flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </CardHeader>
                    <CardContent className="px-4">
                        <Skeleton className="h-8 w-28 mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}; 
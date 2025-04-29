"use client"

import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { Expand, X, Download, BarChart3, RefreshCw, LineChart } from 'lucide-react'
import { useRealtime } from '@/providers/realtime-provider'
import { formatNumber, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Define interfaces for data
interface EnrollmentData {
    month: string;
    enrollments: number;
}

interface ChartDataItem {
    name: string;
    value: number;
}

const chartConfig = {
    enrollments: {
        label: "Ghi danh",
        color: "hsl(var(--chart-2))"
    }
}

// Export to Excel function
const exportToExcel = (data: EnrollmentData[]) => {
    console.log("Exporting enrollments data to Excel", data);
    alert("Đã xuất dữ liệu ghi danh thành công!");
}

export const EnrollmentsChart = () => {
    // Mock data for enrollment by month if not available in useRealtime
    const mockEnrollmentsByMonth: EnrollmentData[] = [
        { month: "Jan", enrollments: 120 },
        { month: "Feb", enrollments: 145 },
        { month: "Mar", enrollments: 162 },
        { month: "Apr", enrollments: 178 },
        { month: "May", enrollments: 195 },
        { month: "Jun", enrollments: 210 },
    ];

    const realtime = useRealtime();
    // Use mock data as fallback
    const enrollmentsByMonth = realtime.enrollmentsByMonth as EnrollmentData[] || mockEnrollmentsByMonth;

    const [isFullscreen, setIsFullscreen] = useState(false)
    const [chartView, setChartView] = useState<'area' | 'bar'>('area')
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Simulate initial loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    // Transform data to work with the chart
    const data: ChartDataItem[] = enrollmentsByMonth.map((item: EnrollmentData) => ({
        name: item.month,
        value: item.enrollments
    }));

    // Calculate total enrollments
    const totalEnrollments = data.reduce((sum: number, item: ChartDataItem) => sum + item.value, 0);

    // Calculate average enrollments
    const avgEnrollments = Math.round(totalEnrollments / (data.length || 1));

    // Calculate growth rate
    const previousMonth = data[data.length - 2]?.value || 0;
    const currentMonth = data[data.length - 1]?.value || 0;
    const growthRate = previousMonth ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

    // Toggle fullscreen
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    }

    // Handle refresh with animation
    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate refresh delay
        setTimeout(() => setIsRefreshing(false), 1000);
    }

    const cardClass = isFullscreen
        ? "fixed inset-0 z-50 bg-background border rounded-none overflow-auto"
        : "col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-4 border-none shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500";

    // Loading state or refreshing state
    const isShowingSkeleton = isLoading || isRefreshing;

    return (
        <Card className={cardClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-2 p-3 sm:p-6">
                <div>
                    <CardTitle className="text-base sm:text-lg wave-color-2">Xu hướng ghi danh</CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1 wave-color-1">
                        Biểu đồ ghi danh khóa học theo tháng
                    </CardDescription>
                </div>
                <div className="flex items-center gap-1.5">
                    {isFullscreen && (
                        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-2">
                <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                        <TooltipProvider>
                            <Tabs
                                value={chartView}
                                onValueChange={(v) => setChartView(v as 'area' | 'bar')}
                                className="blur-in"
                            >
                                <TabsList className="h-8">
                                    <UITooltip>
                                        <TooltipTrigger asChild>
                                            <TabsTrigger value="area" className="text-xs px-2.5 py-1.5">
                                                <LineChart className="h-3.5 w-3.5 mr-1.5" />
                                                <span className="hidden sm:inline">Area</span>
                                            </TabsTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="text-xs">Biểu đồ đường</TooltipContent>
                                    </UITooltip>

                                    <UITooltip>
                                        <TooltipTrigger asChild>
                                            <TabsTrigger value="bar" className="text-xs px-2.5 py-1.5">
                                                <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                                                <span className="hidden sm:inline">Bar</span>
                                            </TabsTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="text-xs">Biểu đồ cột</TooltipContent>
                                    </UITooltip>
                                </TabsList>
                            </Tabs>
                        </TooltipProvider>

                        <UITooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="h-8 text-xs blur-in"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    <span className="hidden sm:inline">Làm mới</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">Làm mới dữ liệu</TooltipContent>
                        </UITooltip>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <UITooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => exportToExcel(enrollmentsByMonth)}
                                    className="h-8 text-xs blur-in"
                                >
                                    <Download className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="hidden sm:inline">Xuất Excel</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">Xuất dữ liệu sang Excel</TooltipContent>
                        </UITooltip>

                        <UITooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleFullscreen}
                                    className="h-8 text-xs blur-in"
                                >
                                    <Expand className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="hidden sm:inline">{isFullscreen ? "Thu nhỏ" : "Mở rộng"}</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                                {isFullscreen ? "Thu nhỏ biểu đồ" : "Mở rộng biểu đồ"}
                            </TooltipContent>
                        </UITooltip>
                    </div>
                </div>

                {isShowingSkeleton ? (
                    <div className="w-full flex items-center justify-center" style={{ height: isFullscreen ? 'calc(100vh - 350px)' : '300px' }}>
                        <div className="space-y-4 w-full max-w-[90%]">
                            <Skeleton className="h-40 w-full rounded-md" />
                            <div className="grid grid-cols-4 gap-4">
                                <Skeleton className="h-8 rounded-md" />
                                <Skeleton className="h-8 rounded-md" />
                                <Skeleton className="h-8 rounded-md" />
                                <Skeleton className="h-8 rounded-md" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`${isFullscreen ? 'h-[calc(100vh-350px)]' : 'h-[250px] sm:h-[300px]'} w-full`}>
                        <ChartContainer
                            config={chartConfig}
                            className="h-full w-full"
                        >
                            {chartView === 'area' ? (
                                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 10 }}
                                        tickMargin={8}
                                        height={40}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 10 }}
                                        tickMargin={8}
                                        width={30}
                                        tickFormatter={(value) => formatNumber(value)}
                                    />
                                    <Tooltip
                                        content={
                                            <ChartTooltipContent
                                                formatter={(value, name) => [`${formatNumber(value as number)} ghi danh`, 'Tháng']}
                                            />
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        name="Ghi danh"
                                        stroke="var(--color-chart-2)"
                                        fillOpacity={1}
                                        fill="url(#colorUv)"
                                        className="blur-in"
                                        activeDot={{ r: 6 }}
                                        animationDuration={1000}
                                        isAnimationActive={true}
                                    />
                                </AreaChart>
                            ) : (
                                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 10 }}
                                        tickMargin={8}
                                        height={40}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 10 }}
                                        tickMargin={8}
                                        width={30}
                                        tickFormatter={(value) => formatNumber(value)}
                                    />
                                    <Tooltip
                                        content={
                                            <ChartTooltipContent
                                                formatter={(value, name) => [`${formatNumber(value as number)} ghi danh`, 'Tháng']}
                                            />
                                        }
                                    />
                                    <Bar
                                        dataKey="value"
                                        name="Ghi danh"
                                        fill="var(--color-chart-2)"
                                        radius={[4, 4, 0, 0]}
                                        className="blur-in"
                                        animationDuration={1000}
                                        isAnimationActive={true}
                                    />
                                </BarChart>
                            )}
                        </ChartContainer>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                    <div
                        className={cn(
                            "flex flex-col p-2 blur-in bg-card/50 rounded-md border border-border/30 transition-all hover:bg-card/80",
                            isShowingSkeleton && "opacity-50"
                        )}
                        style={{ animationDelay: '100ms' }}
                    >
                        <span className="text-xs text-muted-foreground">Tổng ghi danh</span>
                        <div className="flex gap-2 items-center mt-1">
                            <Badge variant="outline" className="text-xs wave-color-2">
                                {formatNumber(totalEnrollments)}
                            </Badge>
                        </div>
                    </div>

                    <div
                        className={cn(
                            "flex flex-col p-2 blur-in bg-card/50 rounded-md border border-border/30 transition-all hover:bg-card/80",
                            isShowingSkeleton && "opacity-50"
                        )}
                        style={{ animationDelay: '200ms' }}
                    >
                        <span className="text-xs text-muted-foreground">Trung bình/tháng</span>
                        <div className="flex gap-2 items-center mt-1">
                            <Badge variant="outline" className="text-xs wave-color-3">
                                {formatNumber(avgEnrollments)}
                            </Badge>
                        </div>
                    </div>

                    <div
                        className={cn(
                            "flex flex-col p-2 blur-in bg-card/50 rounded-md border border-border/30 transition-all hover:bg-card/80",
                            isShowingSkeleton && "opacity-50"
                        )}
                        style={{ animationDelay: '300ms' }}
                    >
                        <span className="text-xs text-muted-foreground">Tháng này</span>
                        <div className="flex gap-2 items-center mt-1">
                            <Badge variant="outline" className="text-xs wave-color-4">
                                {formatNumber(currentMonth)}
                            </Badge>
                        </div>
                    </div>

                    <div
                        className={cn(
                            "flex flex-col p-2 blur-in bg-card/50 rounded-md border border-border/30 transition-all hover:bg-card/80",
                            isShowingSkeleton && "opacity-50"
                        )}
                        style={{ animationDelay: '400ms' }}
                    >
                        <span className="text-xs text-muted-foreground">Tăng trưởng</span>
                        <div className="flex gap-2 items-center mt-1">
                            <Badge variant={growthRate >= 0 ? "outline" : "destructive"} className="text-xs">
                                {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 sm:p-6 border-t text-xs text-muted-foreground">
                <p className="blur-in">
                    Số tháng: <span className="font-medium">{data.length}</span>
                </p>
                <p className="blur-in text-left sm:text-right">
                    Cập nhật lúc: {new Date().toLocaleTimeString()}
                </p>
            </CardFooter>
        </Card>
    )
} 
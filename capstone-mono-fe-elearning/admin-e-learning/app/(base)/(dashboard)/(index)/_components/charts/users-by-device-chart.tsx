"use client"

import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { Expand, X, Download, PieChart as PieChartIcon, BarChart3, RefreshCw } from 'lucide-react'
import { useRealtime } from '@/providers/realtime-provider'
import { formatNumber, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const chartConfig = {
    users: {
        label: "Người dùng",
        color: "hsl(var(--chart-4))"
    }
}

// Export to Excel function
const exportToExcel = (data: any[]) => {
    console.log("Exporting user device data to Excel", data);
    alert("Đã xuất dữ liệu thiết bị người dùng thành công!");
}

const COLORS = [
    'var(--color-chart-1)',
    'var(--color-chart-4)',
    'var(--color-chart-5)'
];

const RADIAN = Math.PI / 180;

// Custom label renderer with percentage
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-xs font-medium"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export const UsersByDeviceChart = () => {
    const { usersByDevice } = useRealtime()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [chartView, setChartView] = useState<'pie' | 'bar'>('pie')
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Simulate initial loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Transform data to work with the chart
    const data = usersByDevice.map(item => ({
        name: item.device,
        value: item.users
    }));

    // Calculate total users
    const totalUsers = data.reduce((sum, item) => sum + item.value, 0);

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
        : "col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 border-none shadow-md animate-in fade-in slide-in-from-bottom-6 duration-700";

    // Loading state or refreshing state
    const isShowingSkeleton = isLoading || isRefreshing;

    return (
        <Card className={cardClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-2 p-3 sm:p-6">
                <div>
                    <CardTitle className="text-base sm:text-lg wave-color-1">Người dùng theo thiết bị</CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1 wave-color-2">
                        Phân bổ người dùng trên các thiết bị
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
                                onValueChange={(v) => setChartView(v as 'pie' | 'bar')}
                                className="blur-in"
                            >
                                <TabsList className="h-8">
                                    <UITooltip>
                                        <TooltipTrigger asChild>
                                            <TabsTrigger value="pie" className="text-xs px-2.5 py-1.5">
                                                <PieChartIcon className="h-3.5 w-3.5 mr-1.5" />
                                                <span className="hidden sm:inline">Pie</span>
                                            </TabsTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="text-xs">Biểu đồ tròn</TooltipContent>
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
                                    onClick={() => exportToExcel(usersByDevice)}
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
                        <div className="space-y-4 w-full max-w-md">
                            <Skeleton className="h-40 w-full rounded-md" />
                            <div className="grid grid-cols-3 gap-4">
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
                            {chartView === 'pie' ? (
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={isFullscreen ? 180 : 100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        className="blur-in"
                                        animationDuration={1000}
                                        animationBegin={200}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                className="blur-in"
                                                style={{ animationDelay: `${index * 150}ms` }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={
                                            <ChartTooltipContent
                                                formatter={(value, name) => [`${formatNumber(value as number)} người dùng`, name]}
                                            />
                                        }
                                        wrapperClassName="blur-in"
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        formatter={(value, entry, index) => (
                                            <span className="text-xs">{value}</span>
                                        )}
                                    />
                                </PieChart>
                            ) : (
                                <BarChart data={data} accessibilityLayer>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
                                                formatter={(value, name) => [`${formatNumber(value as number)} người dùng`, name]}
                                            />
                                        }
                                    />
                                    <Bar
                                        dataKey="value"
                                        name="Người dùng"
                                        radius={[4, 4, 0, 0]}
                                        className="blur-in"
                                        animationDuration={1000}
                                        fill="var(--color-chart-4)"
                                    />
                                </BarChart>
                            )}
                        </ChartContainer>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-4">
                    {data.map((item, index) => (
                        <div
                            key={item.name}
                            className={cn(
                                "flex flex-col gap-1 blur-in bg-card/50 p-2 rounded-md border border-border/30 transition-all hover:bg-card/80",
                                isShowingSkeleton && "opacity-50"
                            )}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="font-medium text-xs sm:text-sm truncate">{item.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <Badge variant="outline" className={`text-[10px] sm:text-xs wave-color-${index + 1}`}>
                                    {formatNumber(item.value)}
                                </Badge>
                                <span className="text-[10px] sm:text-xs text-muted-foreground">
                                    {((item.value / totalUsers) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 sm:p-6 border-t text-xs text-muted-foreground">
                <p className="blur-in">
                    Tổng cộng: <span className="font-medium">{formatNumber(totalUsers)}</span> người dùng
                </p>
                <p className="blur-in text-left sm:text-right">
                    Cập nhật lúc: {new Date().toLocaleTimeString()}
                </p>
            </CardFooter>
        </Card>
    )
} 
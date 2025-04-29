"use client"

import React, { useState } from 'react'
import {
    LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip,
    Legend, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { useRealtime } from '@/providers/realtime-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { formatNumber } from '@/lib/utils'
import {
    Expand, Download, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon,
    X, Settings, Sigma, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

// Chart types
type ChartType = 'line' | 'bar' | 'pie';

const chartConfig = {
    amount: {
        label: "Doanh thu",
        color: "hsl(var(--chart-2))"
    },
    projected: {
        label: "Dự kiến",
        color: "hsl(var(--chart-5))"
    }
}

// Calculate projected revenue (mock data for demo)
const calculateProjectedData = (data: any[]) => {
    return data.map(item => ({
        ...item,
        projected: Math.round(item.amount * (1 + Math.random() * 0.3))
    }));
}

// Excel export function
const exportToExcel = (data: any[]) => {
    // In real implementation, this would create a CSV/Excel file
    console.log("Exporting data", data);
    // In production, would use a library like xlsx or create a backend endpoint
    alert("Đã xuất dữ liệu doanh thu thành công!");
}

// Statistical analysis function
const calculateStats = (data: any[]) => {
    const values = data.map(item => item.amount);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
        sum: formatNumber(sum) + ' ₫',
        avg: formatNumber(Math.round(avg)) + ' ₫',
        max: formatNumber(max) + ' ₫',
        min: formatNumber(min) + ' ₫',
        stdDev: formatNumber(Math.round(stdDev)) + ' ₫'
    };
}

export const RevenueChart = () => {
    const { revenueByMonth } = useRealtime()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [chartType, setChartType] = useState<ChartType>('line')
    const [showProjected, setShowProjected] = useState(false)
    const [smoothing, setSmoothing] = useState(50) // 0-100 for curve smoothness
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Transform data to format in VND
    const baseData = revenueByMonth.map(item => ({
        ...item,
        formattedAmount: formatNumber(item.amount) + ' ₫'
    }))

    // Add projected data
    const data = showProjected ? calculateProjectedData(baseData) : baseData

    // Calculate highest value for YAxis domain
    const allValues = showProjected
        ? [...data.map(item => item.amount), ...data.map(item => item.projected || 0)]
        : data.map(item => item.amount);
    const maxAmount = Math.max(...allValues);
    const yAxisMax = Math.ceil(maxAmount * 1.1 / 10000000) * 10000000

    // Custom YAxis tick formatter
    const formatYAxis = (value: number): string => {
        if (value >= 1000000) {
            return `${value / 1000000}M`;
        }
        return value.toString();
    };

    // Curve type based on smoothing
    const getCurveType = () => {
        if (smoothing < 25) return "linear";
        if (smoothing < 50) return "monotone";
        if (smoothing < 75) return "natural";
        return "basis";
    }

    // Calculate statistics
    const handleCalculateStats = () => {
        setIsLoading(true);
        // Delay to show loading state
        setTimeout(() => {
            setStats(calculateStats(revenueByMonth));
            setIsLoading(false);
        }, 800);
    }

    // Toggle fullscreen
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    }

    // Handle refresh
    const handleRefresh = () => {
        setIsLoading(true);
        // Reset stats and simulate data refresh
        setStats(null);
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
    }

    // COLORS for pie chart
    const COLORS = [
        'var(--color-chart-1)',
        'var(--color-chart-2)',
        'var(--color-chart-3)',
        'var(--color-chart-4)',
        'var(--color-chart-5)',
        'var(--color-chart-6)'
    ];

    // Render appropriate chart based on type
    const renderChart = () => {
        if (isLoading) {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="space-y-4 w-full max-w-md">
                        <Skeleton className="h-40 w-full rounded-md" />
                        <div className="grid grid-cols-3 gap-4">
                            <Skeleton className="h-8 rounded-md" />
                            <Skeleton className="h-8 rounded-md" />
                            <Skeleton className="h-8 rounded-md" />
                        </div>
                    </div>
                </div>
            );
        }

        switch (chartType) {
            case 'line':
                return (
                    <LineChart data={data} accessibilityLayer>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
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
                            tickFormatter={formatYAxis}
                            domain={[0, yAxisMax]}
                            width={40}
                        />
                        <Legend
                            iconSize={10}
                            wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelKey="amount"
                                    formatter={(value) => [formatNumber(value as number) + ' ₫']}
                                />
                            }
                        />
                        <Line
                            type={getCurveType()}
                            dataKey="amount"
                            name="Doanh thu"
                            stroke="var(--color-chart-2)"
                            strokeWidth={2}
                            dot={{ r: 3, strokeWidth: 1 }}
                            activeDot={{ r: 5, strokeWidth: 1 }}
                            className="blur-in"
                            animationDuration={1200}
                        />
                        {showProjected && (
                            <Line
                                type={getCurveType()}
                                dataKey="projected"
                                name="Dự kiến"
                                stroke="var(--color-chart-5)"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={{ r: 3, strokeWidth: 1 }}
                                activeDot={{ r: 5, strokeWidth: 1 }}
                                className="blur-in"
                                animationDuration={1500}
                                animationBegin={300}
                            />
                        )}
                    </LineChart>
                );
            case 'bar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 10 }}
                            height={40}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatYAxis}
                            tick={{ fontSize: 10 }}
                            width={40}
                        />
                        <Legend
                            iconSize={10}
                            wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelKey="amount"
                                    formatter={(value) => [formatNumber(value as number) + ' ₫']}
                                />
                            }
                        />
                        <Bar
                            dataKey="amount"
                            name="Doanh thu"
                            fill="var(--color-chart-2)"
                            radius={[4, 4, 0, 0]}
                            className="blur-in"
                            animationDuration={1200}
                        />
                        {showProjected && (
                            <Bar
                                dataKey="projected"
                                name="Dự kiến"
                                fill="var(--color-chart-5)"
                                radius={[4, 4, 0, 0]}
                                className="blur-in"
                                animationDuration={1500}
                                animationBegin={300}
                            />
                        )}
                    </BarChart>
                );
            case 'pie':
                // Transform data for pie chart
                const pieData = data.map(item => ({
                    name: item.month,
                    value: item.amount
                }));

                return (
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={isFullscreen ? 180 : 90}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            className="blur-in"
                            animationDuration={1500}
                            label={({ name, percent }) => isFullscreen ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                        />
                        <ChartTooltip
                            formatter={(value) => formatNumber(value as number) + ' ₫'}
                        />
                    </PieChart>
                );
        }
    };

    const cardClass = isFullscreen
        ? "fixed inset-0 z-50 bg-background border rounded-none overflow-auto"
        : "col-span-full border-none shadow-md animate-in fade-in slide-in-from-bottom-10 duration-1000";

    return (
        <Card className={cardClass}>
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <div>
                    <CardTitle className="text-base sm:text-lg">Doanh thu</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Doanh thu theo tháng trong năm
                    </CardDescription>
                </div>
                {isFullscreen && (
                    <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="flex flex-wrap gap-2 justify-between">
                    <div className="flex flex-wrap gap-2 items-center">
                        <Tabs
                            defaultValue="line"
                            value={chartType}
                            onValueChange={(value) => setChartType(value as ChartType)}
                            className="blur-in"
                        >
                            <TabsList className="h-8">
                                <TabsTrigger value="line" className="text-xs px-2.5 py-1.5">
                                    <LineChartIcon className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="hidden sm:inline">Đường</span>
                                </TabsTrigger>
                                <TabsTrigger value="bar" className="text-xs px-2.5 py-1.5">
                                    <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="hidden sm:inline">Cột</span>
                                </TabsTrigger>
                                <TabsTrigger value="pie" className="text-xs px-2.5 py-1.5">
                                    <PieChartIcon className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="hidden sm:inline">Tròn</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 text-xs blur-in">
                                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="hidden sm:inline">Tùy chỉnh</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-4">
                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm">Tùy chỉnh biểu đồ</h4>
                                    <div className="space-y-2">
                                        <h5 className="text-xs font-medium">Độ mượt đường cong</h5>
                                        <Slider
                                            defaultValue={[50]}
                                            max={100}
                                            step={1}
                                            value={[smoothing]}
                                            onValueChange={(values) => setSmoothing(values[0])}
                                            disabled={chartType !== 'line'}
                                            className="py-1"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowProjected(!showProjected)}
                                            className={cn("text-xs h-8",
                                                showProjected ? "bg-primary/20" : ""
                                            )}
                                            disabled={chartType === 'pie'}
                                        >
                                            {showProjected ? "Ẩn dự đoán" : "Hiện dự đoán"}
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCalculateStats}
                            disabled={isLoading}
                            className="h-8 text-xs blur-in"
                        >
                            <Sigma className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-pulse' : ''}`} />
                            <span className="hidden sm:inline">Phân tích</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="h-8 text-xs blur-in"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Làm mới</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportToExcel(data)}
                            disabled={isLoading}
                            className="h-8 text-xs blur-in"
                        >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            <span className="hidden sm:inline">Excel</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleFullscreen}
                            className="h-8 text-xs blur-in"
                        >
                            {isFullscreen ?
                                <X className="h-3.5 w-3.5 mr-1.5" /> :
                                <Expand className="h-3.5 w-3.5 mr-1.5" />
                            }
                            <span className="hidden sm:inline">{isFullscreen ? "Thu nhỏ" : "Mở rộng"}</span>
                        </Button>
                    </div>
                </div>

                <div className={`${isFullscreen ? 'h-[calc(100vh-350px)]' : 'h-[250px] sm:h-[300px]'} w-full`}>
                    <ChartContainer
                        config={chartConfig}
                        className="h-full w-full"
                    >
                        {renderChart()}
                    </ChartContainer>
                </div>

                {stats && !isLoading && (
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-3 blur-in">
                        <Card className="p-2 sm:p-3 border border-muted/30">
                            <CardTitle className="text-xs sm:text-sm text-muted-foreground">Tổng doanh thu</CardTitle>
                            <p className="text-base sm:text-lg font-semibold wave-color-1 mt-1">{stats.sum}</p>
                        </Card>
                        <Card className="p-2 sm:p-3 border border-muted/30">
                            <CardTitle className="text-xs sm:text-sm text-muted-foreground">Trung bình</CardTitle>
                            <p className="text-base sm:text-lg font-semibold wave-color-2 mt-1">{stats.avg}</p>
                        </Card>
                        <Card className="p-2 sm:p-3 border border-muted/30">
                            <CardTitle className="text-xs sm:text-sm text-muted-foreground">Cao nhất</CardTitle>
                            <p className="text-base sm:text-lg font-semibold wave-color-3 mt-1">{stats.max}</p>
                        </Card>
                        <Card className="p-2 sm:p-3 border border-muted/30">
                            <CardTitle className="text-xs sm:text-sm text-muted-foreground">Thấp nhất</CardTitle>
                            <p className="text-base sm:text-lg font-semibold wave-color-4 mt-1">{stats.min}</p>
                        </Card>
                        <Card className="p-2 sm:p-3 border border-muted/30 col-span-2 sm:col-span-1">
                            <CardTitle className="text-xs sm:text-sm text-muted-foreground">Độ lệch chuẩn</CardTitle>
                            <p className="text-base sm:text-lg font-semibold wave-color-5 mt-1">{stats.stdDev}</p>
                        </Card>
                    </div>
                )}
            </CardContent>
            <CardFooter className="px-4 sm:px-6 py-3 sm:py-4 border-t flex justify-between items-center">
                <p className="text-[10px] sm:text-xs text-muted-foreground blur-in">
                    Dữ liệu được cập nhật theo thời gian thực
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground blur-in text-right">
                    {!isLoading && `Tổng số dữ liệu: ${data.length} tháng`}
                </p>
            </CardFooter>
        </Card>
    )
} 
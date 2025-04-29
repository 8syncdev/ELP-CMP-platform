"use client"

import React, { useState, useMemo } from 'react'
import { Loader2, Wifi, Play, Pause, Zap, AlertCircle, ArrowDown, ArrowUp, WifiOff, ChevronDown, ChevronUp, BarChart4, Laptop2 } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRealtime } from '@/providers/realtime-provider'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

// Define interfaces for type safety
interface SystemStats {
    latency: number;
    memory: number;
    processing: number;
}

interface RealtimeData {
    isConnected: boolean;
    isPaused: boolean;
    toggle: () => void;
    lastUpdate: Date | null;
    performance: number;
    error: string | null;
    systemStats?: SystemStats;
}

// Default values for system stats
const DEFAULT_SYSTEM_STATS: SystemStats = {
    latency: 120,
    memory: 32,
    processing: 12
};

export const RealtimeControl = () => {
    const realtimeData = useRealtime()
    const [expandedInfo, setExpandedInfo] = useState(false)

    // Validate and process realtime data with defaults
    const {
        isConnected = false,
        isPaused = false,
        toggle = () => { },
        lastUpdate = null,
        performance = 0,
        error = null,
        systemStats = DEFAULT_SYSTEM_STATS
    } = useMemo<RealtimeData>(() => {
        // Basic validation to ensure we have an object
        if (!realtimeData || typeof realtimeData !== 'object') {
            return {
                isConnected: false,
                isPaused: false,
                toggle: () => { },
                lastUpdate: null,
                performance: 0,
                error: 'Failed to load realtime data',
                systemStats: DEFAULT_SYSTEM_STATS
            };
        }

        // Extract and validate individual fields
        return {
            isConnected: typeof realtimeData.isConnected === 'boolean' ? realtimeData.isConnected : false,
            isPaused: typeof realtimeData.isPaused === 'boolean' ? realtimeData.isPaused : false,
            toggle: typeof realtimeData.toggle === 'function' ? realtimeData.toggle : () => { },
            lastUpdate: realtimeData.lastUpdate instanceof Date ? realtimeData.lastUpdate : null,
            performance: typeof realtimeData.performance === 'number' &&
                realtimeData.performance >= 0 &&
                realtimeData.performance <= 100 ?
                realtimeData.performance : 0,
            error: typeof realtimeData.error === 'string' ? realtimeData.error :
                realtimeData.error ? String(realtimeData.error) : null,
            systemStats: DEFAULT_SYSTEM_STATS
        };
    }, [realtimeData]);

    // Get a timestamp from lastUpdate
    const formattedTime = lastUpdate
        ? lastUpdate.toLocaleTimeString()
        : new Date().toLocaleTimeString();

    // Define the status badge
    const getStatusBadge = () => {
        if (error) {
            return (
                <Badge variant="destructive" className="animate-pulse">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Lỗi
                </Badge>
            )
        }

        if (!isConnected) {
            return (
                <Badge variant="outline" className="animate-pulse">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Đã ngắt kết nối
                </Badge>
            )
        }

        if (isPaused) {
            return (
                <Badge variant="secondary">
                    <Pause className="w-3 h-3 mr-1" />
                    Tạm dừng
                </Badge>
            )
        }

        return (
            <Badge variant="default" className="blur-in">
                <Zap className="w-3 h-3 mr-1 animate-pulse" />
                Đang kết nối
            </Badge>
        )
    }

    // Determine progress color
    const getProgressColor = () => {
        if (performance > 80) return "bg-emerald-500"
        if (performance > 50) return "bg-amber-500"
        return "bg-rose-500"
    }

    return (
        <Card className="border-none shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex items-center">
                        <Wifi className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <CardTitle className="wave-color-1 text-sm sm:text-base">Kết nối dữ liệu</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="text-xs font-normal text-muted-foreground wave-color-2 cursor-help">
                                    {formattedTime}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                Thời gian cập nhật gần nhất
                            </TooltipContent>
                        </Tooltip>
                        {getStatusBadge()}
                    </div>
                </div>

                <CardDescription className="text-xs text-muted-foreground mt-0 hidden sm:block">
                    Theo dõi tình trạng kết nối dữ liệu thời gian thực đến hệ thống
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-2 px-4 sm:px-6">
                <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-muted-foreground">Hiệu suất hệ thống</span>
                        <span className={cn(
                            "font-medium flex items-center",
                            performance > 80 ? "text-emerald-500" :
                                performance > 50 ? "text-amber-500" : "text-rose-500"
                        )}>
                            {performance}%
                            {performance > 80 ? (
                                <ArrowUp className="h-3 w-3 inline ml-1" />
                            ) : performance < 50 ? (
                                <ArrowDown className="h-3 w-3 inline ml-1" />
                            ) : null}
                        </span>
                    </div>
                    <Progress
                        value={performance}
                        className="h-1.5 bg-secondary"
                        indicatorClassName={cn("blur-in", getProgressColor())}
                    />
                </div>

                {expandedInfo && (
                    <div className="mt-4 pt-4 border-t border-border/40">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm blur-in">
                            <div className="bg-muted/30 rounded-md p-2 flex flex-col">
                                <span className="text-muted-foreground text-[10px] sm:text-xs mb-1">Trạng thái:</span>
                                <span className="font-medium wave-color-3 text-xs sm:text-sm">
                                    {isConnected ? "Đã kết nối" : "Mất kết nối"}
                                </span>
                            </div>

                            <div className="bg-muted/30 rounded-md p-2 flex flex-col">
                                <span className="text-muted-foreground text-[10px] sm:text-xs mb-1">Độ trễ:</span>
                                <div className="flex items-center gap-1">
                                    <BarChart4 className="h-3 w-3 text-amber-500" />
                                    <span className="font-medium wave-color-4 text-xs sm:text-sm">{systemStats.latency}ms</span>
                                </div>
                            </div>

                            <div className="bg-muted/30 rounded-md p-2 flex flex-col">
                                <span className="text-muted-foreground text-[10px] sm:text-xs mb-1">Bộ nhớ:</span>
                                <div className="flex items-center gap-1">
                                    <Laptop2 className="h-3 w-3 text-blue-500" />
                                    <span className="font-medium wave-color-3 text-xs sm:text-sm">{systemStats.memory}MB</span>
                                </div>
                            </div>

                            <div className="bg-muted/30 rounded-md p-2 flex flex-col">
                                <span className="text-muted-foreground text-[10px] sm:text-xs mb-1">Xử lý:</span>
                                <span className="font-medium wave-color-4 text-xs sm:text-sm">{systemStats.processing}ms</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between pt-2 sm:pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedInfo(!expandedInfo)}
                    className="text-xs w-full sm:w-auto h-8 blur-in"
                >
                    {expandedInfo ?
                        <><ChevronUp className="h-3.5 w-3.5 mr-1.5" /> Ẩn thông tin</> :
                        <><ChevronDown className="h-3.5 w-3.5 mr-1.5" /> Hiện thông tin chi tiết</>
                    }
                </Button>
                <Button
                    variant={isPaused ? "outline" : "default"}
                    size="sm"
                    onClick={toggle}
                    disabled={!isConnected || !!error}
                    className="blur-in w-full sm:w-auto h-8"
                    style={{ animationDelay: "50ms" }}
                >
                    {isConnected ? (
                        isPaused ? (
                            <>
                                <Play className="mr-1.5 h-3.5 w-3.5" />
                                Tiếp tục
                            </>
                        ) : (
                            <>
                                <Pause className="mr-1.5 h-3.5 w-3.5" />
                                Tạm dừng
                            </>
                        )
                    ) : (
                        <>
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            Đang kết nối lại...
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
} 
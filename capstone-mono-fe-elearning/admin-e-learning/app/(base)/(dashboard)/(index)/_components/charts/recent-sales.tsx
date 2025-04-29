"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, ArrowRight, ShoppingCart, AlertCircle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRealtime } from '@/providers/realtime-provider'
import { formatDistanceToNow, isValid } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

// Sale transaction interface
interface SaleTransaction {
    id: string;
    customerName: string;
    customerEmail: string;
    amount: number;
    currency: string;
    status: 'completed' | 'pending' | 'refunded';
    itemName: string;
    timestamp: Date;
    avatarUrl?: string;
}

// Loading skeleton component
const SaleSkeleton = () => (
    <div className="flex items-center space-x-4 rounded-md py-2 px-1 animate-pulse">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-5 w-16" />
    </div>
);

export const RecentSales = () => {
    const realtimeData = useRealtime();
    const [isLoading, setIsLoading] = useState(false);

    // Process and validate sales data
    const sales = useMemo(() => {
        // Return empty array if data is missing
        if (!realtimeData || !Array.isArray(realtimeData.recentSales)) {
            return [];
        }

        // Validate and transform each sale
        return realtimeData.recentSales.map(sale => {
            // Ensure the sale has valid properties
            return {
                id: typeof sale.id === 'string' ? sale.id : `sale-${Math.random().toString(36).substr(2, 9)}`,
                customerName: typeof sale.customerName === 'string' ? sale.customerName : 'Anonymous Customer',
                customerEmail: typeof sale.customerEmail === 'string' ? sale.customerEmail : 'email@example.com',
                amount: typeof sale.amount === 'number' && !isNaN(sale.amount) ? sale.amount : 0,
                currency: typeof sale.currency === 'string' ? sale.currency : 'VND',
                status: ['completed', 'pending', 'refunded'].includes(sale.status)
                    ? sale.status as 'completed' | 'pending' | 'refunded'
                    : 'completed',
                itemName: typeof sale.itemName === 'string' ? sale.itemName : 'Unknown Product',
                timestamp: sale.timestamp instanceof Date && isValid(sale.timestamp)
                    ? sale.timestamp
                    : new Date(),
                avatarUrl: typeof sale.avatarUrl === 'string' ? sale.avatarUrl : undefined
            };
        });
    }, [realtimeData]);

    // Format currency with thousand separators
    const formatCurrency = (amount: number, currency: string): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: currency === 'VND' ? 'VND' : 'USD',
            minimumFractionDigits: currency === 'VND' ? 0 : 2,
            maximumFractionDigits: currency === 'VND' ? 0 : 2
        }).format(amount);
    };

    // Get status badge based on transaction status
    const getStatusBadge = (status: 'completed' | 'pending' | 'refunded') => {
        switch (status) {
            case 'completed':
                return <Badge variant="outline" className="ml-2 border-green-200 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px]">Thành công</Badge>;
            case 'pending':
                return <Badge variant="outline" className="ml-2 border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-[10px]">Đang xử lý</Badge>;
            case 'refunded':
                return <Badge variant="outline" className="ml-2 border-red-200 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px]">Hoàn tiền</Badge>;
            default:
                return null;
        }
    };

    // Handle loading state
    const handleRefresh = () => {
        setIsLoading(true);
        // Simulate loading delay
        setTimeout(() => setIsLoading(false), 800);
    };

    // Handle errors gracefully
    if (!realtimeData) {
        return (
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 h-full border-none shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-6 h-64">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground text-center">
                        Could not load sales data. Please try again later.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 h-full border-none shadow-md animate-in fade-in slide-in-from-bottom-6 duration-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-4 px-4 md:pt-6 md:px-6">
                <div>
                    <CardTitle className="text-base sm:text-lg font-bold wave-color-3">
                        Giao dịch gần đây
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm hidden sm:block mt-1">
                        {sales.length} giao dịch được thực hiện trong 24 giờ qua
                    </CardDescription>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 blur-in"
                    onClick={handleRefresh}
                    disabled={isLoading}
                >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Làm mới</span>
                </Button>
            </CardHeader>
            <CardContent className="p-0 px-4 md:px-6">
                <ScrollArea className="h-[250px] md:h-[300px] pr-3">
                    {isLoading ? (
                        // Loading state
                        Array(5).fill(0).map((_, i) => <SaleSkeleton key={i} />)
                    ) : sales.length === 0 ? (
                        // Empty state
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center blur-in">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground mb-2">
                                Không có giao dịch nào gần đây
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRefresh}
                                className="text-xs"
                            >
                                Làm mới dữ liệu
                            </Button>
                        </div>
                    ) : (
                        // Sales list
                        <div className="space-y-4 py-1">
                            {sales.map((sale, index) => (
                                <div
                                    key={sale.id}
                                    className="flex items-center space-x-4 rounded-md py-2 px-1 transition-all hover:bg-accent/50 blur-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <Avatar className="h-9 w-9 border flex-shrink-0">
                                        <AvatarImage src={sale.avatarUrl} alt={sale.customerName} />
                                        <AvatarFallback>{sale.customerName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center">
                                            <p className={`text-sm font-medium leading-none truncate max-w-[120px] sm:max-w-full wave-color-${(index % 5) + 1}`}>
                                                {sale.customerName}
                                            </p>
                                            {getStatusBadge(sale.status)}
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                            <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                                                {sale.itemName}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground hidden sm:block">•</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {formatDistanceToNow(sale.timestamp, {
                                                    addSuffix: true,
                                                    locale: vi
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1",
                                        sale.status === 'refunded' ? "text-red-500" :
                                            sale.status === 'pending' ? "text-yellow-500" : "text-green-500"
                                    )}>
                                        <DollarSign className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            {formatCurrency(sale.amount, sale.currency)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
            <CardFooter className="px-4 py-3 sm:px-6 sm:py-4 flex justify-center sm:justify-end">
                <Button variant="ghost" size="sm" className="text-xs h-8 blur-in">
                    <span>Xem tất cả giao dịch</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
            </CardFooter>
        </Card>
    )
} 
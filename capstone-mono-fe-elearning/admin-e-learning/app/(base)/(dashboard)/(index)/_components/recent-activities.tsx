"use client"

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Calendar, Eye, Filter, MoreHorizontal, UserPlus, ArrowRight, AlertCircle, Search, Check } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { useRealtime } from '@/providers/realtime-provider'
import { format, formatDistanceToNow, isValid } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { getUserByToken, getUsers } from '@/lib/actions/user'
import { UsersDto } from '@/lib/actions/user/user.type'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

// Activity type definition
type ActivityType = 'register' | 'login' | 'enroll' | 'complete' | 'certificate';

// Activity Status
type ActivityStatus = 'read' | 'unread';

// Activity interface with correct user structure
interface Activity {
    id: string;
    type: ActivityType;
    user: {
        id: number;
        full_name: string;
        avatar: string;
        username: string;
    };
    description: string;
    timestamp: Date;
    status: ActivityStatus;
    details?: string;
    relatedId?: string;
    relatedType?: string;
}

// Activity API interface
interface ActivityResponse {
    success: boolean;
    message?: string;
    result?: Activity[];
    pagination?: {
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
    };
}

// Function to get appropriate icon for activity type
const getActivityIcon = (type: ActivityType) => {
    switch (type) {
        case 'register':
            return <UserPlus className="h-4 w-4 text-blue-500" />;
        case 'login':
            return <Eye className="h-4 w-4 text-emerald-500" />;
        case 'enroll':
            return <Calendar className="h-4 w-4 text-amber-500" />;
        case 'complete':
            return <Badge className="h-4 w-4 text-violet-500" />;
        case 'certificate':
            return <Bell className="h-4 w-4 text-rose-500" />;
        default:
            return <Bell className="h-4 w-4" />;
    }
};

// Function to get a colored badge based on activity type
const getActivityBadge = (type: ActivityType) => {
    switch (type) {
        case 'register':
            return <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 whitespace-nowrap text-[10px] sm:text-xs">Đăng ký</Badge>;
        case 'login':
            return <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 whitespace-nowrap text-[10px] sm:text-xs">Đăng nhập</Badge>;
        case 'enroll':
            return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 whitespace-nowrap text-[10px] sm:text-xs">Ghi danh</Badge>;
        case 'complete':
            return <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 whitespace-nowrap text-[10px] sm:text-xs">Hoàn thành</Badge>;
        case 'certificate':
            return <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 whitespace-nowrap text-[10px] sm:text-xs">Chứng chỉ</Badge>;
        default:
            return <Badge variant="outline" className="whitespace-nowrap text-[10px] sm:text-xs">Hoạt động</Badge>;
    }
};

// Status badge component
const StatusBadge = ({ status }: { status: ActivityStatus }) => {
    return status === 'unread' ? (
        <div className="h-2 w-2 rounded-full bg-primary" title="Chưa đọc"></div>
    ) : null;
};

// Loading skeleton component
const ActivitySkeleton = () => (
    <div className="flex items-start gap-4 rounded-lg p-3 animate-pulse">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-20" />
        </div>
    </div>
);

// Mock API functions - In production, replace with real API calls
const fetchActivities = async (page = 1, pageSize = 10, filter: ActivityType | 'all' = 'all', search = ''): Promise<ActivityResponse> => {
    try {
        // In real implementation, this would be an API call
        // const response = await axios.get(`/api/activities?page=${page}&pageSize=${pageSize}&filter=${filter}&search=${search}`);
        // return response.data;

        // For now, generate mock data based on users
        const usersResponse = await getUsers(page, pageSize);

        if (usersResponse.success && Array.isArray(usersResponse.result)) {
            const activities = (usersResponse.result as UsersDto[]).map(user => {
                const types: ActivityType[] = ['register', 'login', 'enroll', 'complete', 'certificate'];
                const randomType = types[Math.floor(Math.random() * types.length)];

                const descriptions = {
                    register: "đã đăng ký tài khoản mới.",
                    login: "đã đăng nhập vào hệ thống.",
                    enroll: "đã đăng ký khóa học mới.",
                    complete: "đã hoàn thành khóa học.",
                    certificate: "đã nhận chứng chỉ khóa học."
                };

                return {
                    id: `activity-${user.id}-${Date.now()}`,
                    type: randomType,
                    user: {
                        id: user.id,
                        full_name: user.full_name,
                        avatar: user.avatar,
                        username: user.username
                    },
                    description: descriptions[randomType],
                    timestamp: user.created_at || new Date(),
                    status: (Math.random() > 0.5 ? 'read' : 'unread') as ActivityStatus,
                    details: `Chi tiết về hoạt động ${randomType} của người dùng ${user.full_name}`,
                    relatedId: `related-${Math.floor(Math.random() * 1000)}`,
                    relatedType: randomType === 'enroll' ? 'course' :
                        randomType === 'complete' ? 'lesson' :
                            randomType === 'certificate' ? 'certificate' : 'user'
                };
            });

            // Filter if needed
            const filteredActivities = filter === 'all'
                ? activities
                : activities.filter(a => a.type === filter);

            // Search if needed
            const searchedActivities = search
                ? filteredActivities.filter(a =>
                    a.user.full_name.toLowerCase().includes(search.toLowerCase()) ||
                    a.description.toLowerCase().includes(search.toLowerCase())
                )
                : filteredActivities;

            return {
                success: true,
                result: searchedActivities,
                pagination: {
                    totalItems: 100, // Mock total
                    itemsPerPage: pageSize,
                    currentPage: page,
                    totalPages: Math.ceil(100 / pageSize)
                }
            };
        }

        throw new Error("Failed to fetch users");
    } catch (error) {
        console.error("Failed to fetch activities:", error);
        return {
            success: false,
            message: "Failed to fetch activities",
            result: [],
            pagination: {
                totalItems: 0,
                itemsPerPage: pageSize,
                currentPage: page,
                totalPages: 0
            }
        };
    }
};

const markActivityAsRead = async (activityId: string): Promise<boolean> => {
    try {
        // In real implementation, this would be an API call
        // await axios.patch(`/api/activities/${activityId}`, { status: 'read' });

        // Mock successful response
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    } catch (error) {
        console.error("Failed to mark activity as read:", error);
        return false;
    }
};

export const RecentActivities = () => {
    const realtimeData = useRealtime();
    const [filter, setFilter] = useState<ActivityType | 'all'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalItems: 0, itemsPerPage: 10, currentPage: 1, totalPages: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const lastActivityIdRef = useRef<string | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Handle search input with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch activities
    const fetchActivityData = useCallback(async (page = currentPage, resetList = false) => {
        try {
            setIsLoading(true);
            const response = await fetchActivities(page, pagination.itemsPerPage, filter, debouncedSearchTerm);

            if (response.success && Array.isArray(response.result)) {
                setActivities(prev => resetList ? response.result! : [...prev, ...response.result!]);
                if (response.pagination) {
                    setPagination(response.pagination);
                }

                // Set the lastActivityId for real-time updates
                if (response.result && response.result.length > 0) {
                    lastActivityIdRef.current = response.result[0].id;
                }
            } else {
                throw new Error(response.message || "Failed to fetch activities");
            }
        } catch (error) {
            console.error("Activity fetch error:", error);
            toast.error("Failed to load activities. Please try again.");

            // Fallback to realtime provider data if available
            if (realtimeData?.recentActivities && resetList) {
                const mockActivities = transformMockActivities(realtimeData.recentActivities);
                setActivities(mockActivities);
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pagination.itemsPerPage, filter, debouncedSearchTerm, realtimeData, toast]);

    // Initial data fetch
    useEffect(() => {
        fetchActivityData(1, true);
    }, [filter, debouncedSearchTerm]);

    // Load more when reaching bottom
    const setupIntersectionObserver = useCallback(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(entries => {
            const [entry] = entries;
            if (entry.isIntersecting && !isLoading && currentPage < pagination.totalPages) {
                setCurrentPage(prev => prev + 1);
            }
        }, { threshold: 0.5 });

        const bottomElement = document.getElementById('activities-bottom-loader');
        if (bottomElement) {
            observerRef.current.observe(bottomElement);
        }
    }, [isLoading, currentPage, pagination.totalPages]);

    // Setup observer after render
    useEffect(() => {
        setupIntersectionObserver();
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [setupIntersectionObserver, activities]);

    // Load more when page changes
    useEffect(() => {
        if (currentPage > 1) {
            fetchActivityData(currentPage, false);
        }
    }, [currentPage]);

    // Real-time update checking
    useEffect(() => {
        const checkForUpdates = async () => {
            // In a real implementation, this would check for new activities since lastActivityId
            // For demo purposes, we're just going to add a random new activity occasionally
            if (Math.random() > 0.8 && activities.length > 0) {
                // Clone and modify the first activity
                const newActivity = { ...activities[0] };
                newActivity.id = `activity-new-${Date.now()}`;
                newActivity.timestamp = new Date();
                newActivity.status = 'unread';
                newActivity.description = "đã thực hiện hành động mới.";

                setActivities(prev => [newActivity, ...prev]);

                toast.info(`${newActivity.user.full_name} ${newActivity.description}`);

                lastActivityIdRef.current = newActivity.id;
            }
        };

        // Set up polling for real-time updates
        const interval = setInterval(checkForUpdates, 30000);

        return () => clearInterval(interval);
    }, [activities, toast]);

    // Transform mock activities to match our format if API fails
    const transformMockActivities = (mockActivities: any[]): Activity[] => {
        return mockActivities.map(activity => ({
            id: activity.id || `activity-${Math.random().toString(36).substr(2, 9)}`,
            type: activity.type || 'register',
            user: {
                id: 0,
                full_name: activity.user?.name || 'Unknown User',
                avatar: activity.user?.avatarUrl || '',
                username: 'user' + Math.floor(Math.random() * 1000)
            },
            description: activity.description || 'Activity recorded',
            timestamp: activity.timestamp instanceof Date ? activity.timestamp : new Date(),
            status: 'unread',
            details: 'No additional details available',
            relatedId: '',
            relatedType: ''
        }));
    };

    // Handle marking activity as read
    const handleMarkAsRead = async (activity: Activity) => {
        try {
            const success = await markActivityAsRead(activity.id);

            if (success) {
                setActivities(prev =>
                    prev.map(a => a.id === activity.id ? { ...a, status: 'read' } : a)
                );

                toast.success("Đánh dấu đã đọc thành công");
            } else {
                throw new Error("Failed to mark as read");
            }
        } catch (error) {
            console.error("Mark as read error:", error);
            toast.error("Failed to mark as read. Please try again.");
        }
    };

    // Show activity detail
    const handleShowDetail = (activity: Activity) => {
        setSelectedActivity(activity);
        setIsDetailOpen(true);

        // Mark as read if unread
        if (activity.status === 'unread') {
            handleMarkAsRead(activity);
        }
    };

    // Filter activities based on selected type
    const filteredActivities = useMemo(() => {
        return activities;
    }, [activities]);

    // Handle filter change with loading state
    const handleFilterChange = (newFilter: ActivityType | 'all') => {
        setIsLoading(true);
        setFilter(newFilter);
        setCurrentPage(1);
    };

    // Handle errors gracefully
    if (!realtimeData && activities.length === 0 && !isLoading) {
        return (
            <Card className="h-full border-none shadow-md animate-in fade-in slide-in-from-bottom-6 duration-700">
                <CardContent className="flex flex-col items-center justify-center p-6 h-64">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground text-center">
                        Could not load activity data. Please try again later.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="h-full border-none shadow-md animate-in fade-in slide-in-from-bottom-6 duration-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 sm:p-6">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg font-bold wave-color-1">Hoạt động gần đây</CardTitle>
                        <CardDescription className="text-xs sm:text-sm hidden sm:block mt-1">
                            Theo dõi hoạt động mới nhất trên hệ thống
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <div className="relative w-32 hidden md:block">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm..."
                                className="pl-8 h-8 text-xs"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 whitespace-nowrap">
                                    <Filter className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="text-xs">{filter === 'all' ? 'Tất cả' :
                                        filter === 'register' ? 'Đăng ký' :
                                            filter === 'login' ? 'Đăng nhập' :
                                                filter === 'enroll' ? 'Ghi danh' :
                                                    filter === 'complete' ? 'Hoàn thành' : 'Chứng chỉ'
                                    }</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="text-xs">Lọc theo loại</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-xs" onClick={() => handleFilterChange('all')}>
                                    Tất cả
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs" onClick={() => handleFilterChange('register')}>
                                    Đăng ký
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs" onClick={() => handleFilterChange('login')}>
                                    Đăng nhập
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs" onClick={() => handleFilterChange('enroll')}>
                                    Ghi danh
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs" onClick={() => handleFilterChange('complete')}>
                                    Hoàn thành khóa học
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs" onClick={() => handleFilterChange('certificate')}>
                                    Nhận chứng chỉ
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-0 px-4 sm:px-6">
                    <ScrollArea className="h-[300px] sm:h-[350px] md:h-[400px] pr-4">
                        <div className="space-y-3">
                            {isLoading && activities.length === 0 ? (
                                // Loading skeletons
                                Array(5).fill(0).map((_, i) => <ActivitySkeleton key={i} />)
                            ) : filteredActivities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                    <p className="text-sm text-muted-foreground mb-2 blur-in">
                                        Không có hoạt động nào {filter !== 'all' ? 'thuộc loại này' : ''}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleFilterChange('all')}
                                        className="text-xs blur-in"
                                    >
                                        Xem tất cả hoạt động
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {filteredActivities.map((activity, index) => (
                                        <div
                                            key={activity.id}
                                            className={`flex items-start gap-2 sm:gap-3 rounded-lg py-2 px-2 sm:p-3 transition-all hover:bg-accent/50 blur-in ${activity.status === 'unread' ? 'bg-accent/30' : ''}`}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border flex-shrink-0">
                                                <AvatarImage src={activity.user.avatar} alt={activity.user.full_name} />
                                                <AvatarFallback>
                                                    {activity.user.full_name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex items-center justify-between flex-wrap gap-1">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <StatusBadge status={activity.status} />
                                                        <p className={`text-xs sm:text-sm font-medium leading-none truncate max-w-[120px] sm:max-w-[150px] wave-color-${(index % 5) + 1}`}>
                                                            {activity.user.full_name}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                                        {getActivityBadge(activity.type)}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                                                                    <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                    <span className="sr-only">Thao tác</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40">
                                                                <DropdownMenuItem
                                                                    className="text-xs cursor-pointer"
                                                                    onClick={() => handleShowDetail(activity)}
                                                                >
                                                                    Xem chi tiết
                                                                </DropdownMenuItem>
                                                                {activity.status === 'unread' && (
                                                                    <DropdownMenuItem
                                                                        className="text-xs cursor-pointer"
                                                                        onClick={() => handleMarkAsRead(activity)}
                                                                    >
                                                                        Đánh dấu đã đọc
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                                <p
                                                    className="text-xs sm:text-sm text-muted-foreground line-clamp-2 cursor-pointer"
                                                    onClick={() => handleShowDetail(activity)}
                                                >
                                                    {activity.description}
                                                </p>
                                                <div className="flex items-center pt-1">
                                                    <div className="flex items-center gap-1">
                                                        {getActivityIcon(activity.type)}
                                                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                                                            {formatDistanceToNow(activity.timestamp, {
                                                                addSuffix: true,
                                                                locale: vi
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div
                                        id="activities-bottom-loader"
                                        className="py-2 text-center"
                                    >
                                        {isLoading && activities.length > 0 && (
                                            <Skeleton className="h-8 w-32 mx-auto" />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="px-4 sm:px-6 py-3 sm:py-4 flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-[10px] sm:text-xs text-muted-foreground blur-in">
                        {!isLoading && `Đang hiển thị ${filteredActivities.length}/${pagination.totalItems} hoạt động`}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto text-xs h-8 blur-in"
                        onClick={() => {
                            if (currentPage < pagination.totalPages) {
                                setCurrentPage(prev => prev + 1);
                            }
                        }}
                        disabled={currentPage >= pagination.totalPages || isLoading}
                    >
                        <span>Xem thêm</span>
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                </CardFooter>
            </Card>

            {/* Activity Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết hoạt động</DialogTitle>
                        <DialogDescription>
                            Thông tin chi tiết về hoạt động người dùng
                        </DialogDescription>
                    </DialogHeader>

                    {selectedActivity && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={selectedActivity.user.avatar} alt={selectedActivity.user.full_name} />
                                    <AvatarFallback>{selectedActivity.user.full_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-medium truncate">{selectedActivity.user.full_name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">@{selectedActivity.user.username}</p>
                                </div>
                                {getActivityBadge(selectedActivity.type)}
                            </div>

                            <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="details">Chi tiết</TabsTrigger>
                                    <TabsTrigger value="timeline">Thời gian</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details" className="space-y-3 pt-3">
                                    <div>
                                        <h5 className="text-xs font-medium mb-1">Mô tả</h5>
                                        <p className="text-sm break-words">{selectedActivity.description}</p>
                                    </div>

                                    {selectedActivity.details && (
                                        <div>
                                            <h5 className="text-xs font-medium mb-1">Thông tin thêm</h5>
                                            <p className="text-sm break-words">{selectedActivity.details}</p>
                                        </div>
                                    )}

                                    {selectedActivity.relatedId && (
                                        <div>
                                            <h5 className="text-xs font-medium mb-1">Liên kết</h5>
                                            <div className="text-sm flex items-center gap-1">
                                                <span className="capitalize">{selectedActivity.relatedType}:</span>
                                                <span className="text-primary truncate">{selectedActivity.relatedId}</span>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent value="timeline" className="space-y-3 pt-3">
                                    <div>
                                        <h5 className="text-xs font-medium mb-1">Thời gian tạo</h5>
                                        <p className="text-sm">{format(selectedActivity.timestamp, 'PPpp', { locale: vi })}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-medium mb-1">Trạng thái</h5>
                                        <div className="flex items-center gap-2">
                                            {selectedActivity.status === 'read' ? (
                                                <>
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm">Đã đọc</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="h-4 w-4 rounded-full bg-primary" />
                                                    <span className="text-sm">Chưa đọc</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end pt-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsDetailOpen(false)}
                                >
                                    Đóng
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
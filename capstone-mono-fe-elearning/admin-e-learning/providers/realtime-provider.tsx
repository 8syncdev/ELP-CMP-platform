"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

// Types for our data models
export type RealtimeContextType = {
    // Dashboard data
    dashboardData: {
        totalUsers: number;
        totalCourses: number;
        totalLessons: number;
        totalEnrollments: number;
        lastUpdated: Date;
        loading: boolean;
    };

    // Realtime connection status
    isConnected: boolean;
    isPaused: boolean;
    lastUpdate: Date | null;
    performance: number;
    error: string | null;
    toggle: () => void;

    // Chart data
    revenueByMonth: {
        month: string;
        amount: number;
    }[];

    enrollmentsByMonth: {
        month: string;
        enrollments: number;
    }[];

    enrollmentsByCategory: {
        category: string;
        enrollments: number;
    }[];

    usersByDevice: {
        device: string;
        users: number;
    }[];

    // Activity data
    recentActivities: RecentActivity[];

    // Sales data
    recentSales: {
        id: string;
        customerName: string;
        customerEmail: string;
        amount: number;
        currency: string;
        status: 'completed' | 'pending' | 'refunded';
        itemName: string;
        timestamp: Date;
        avatarUrl?: string;
    }[];
}

export type RecentActivity = {
    id: string;
    type: 'register' | 'login' | 'enroll' | 'complete' | 'certificate';
    user: {
        name: string;
        avatarUrl: string;
    };
    description: string;
    timestamp: Date;
}

// Create the context
const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

// Custom hook to use the context
export const useRealtime = () => {
    const context = useContext(RealtimeContext)

    if (context === undefined) {
        throw new Error('useRealtime must be used within a RealtimeProvider')
    }

    return context
}

// Mock data for simulation
const generateMockData = () => {
    // Dashboard totals
    const totalUsers = Math.floor(5000 + Math.random() * 500);
    const totalCourses = Math.floor(120 + Math.random() * 10);
    const totalLessons = Math.floor(1200 + Math.random() * 100);
    const totalEnrollments = Math.floor(12000 + Math.random() * 1000);

    // Revenue data - 12 months
    const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(2023, i, 1).toLocaleDateString('vi', { month: 'short' });
        const amount = Math.floor(500000000 + Math.random() * 200000000); // 500M - 700M VND
        return { month, amount };
    });

    // Enrollments by month
    const enrollmentsByMonth = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(2023, i, 1).toLocaleDateString('vi', { month: 'short' });
        const enrollments = Math.floor(100 + Math.random() * 50); // 100-150 enrollments per month
        return { month, enrollments };
    });

    // Enrollments by category
    const enrollmentsByCategory = [
        { category: "Lập trình", enrollments: Math.floor(2000 + Math.random() * 500) },
        { category: "Marketing", enrollments: Math.floor(1800 + Math.random() * 400) },
        { category: "Thiết kế", enrollments: Math.floor(1500 + Math.random() * 300) },
        { category: "Kinh doanh", enrollments: Math.floor(2200 + Math.random() * 600) },
        { category: "Ngoại ngữ", enrollments: Math.floor(2500 + Math.random() * 700) },
        { category: "Kỹ năng mềm", enrollments: Math.floor(1700 + Math.random() * 400) },
    ];

    // Users by device
    const usersByDevice = [
        { device: "Desktop", users: Math.floor(totalUsers * 0.4) },
        { device: "Mobile", users: Math.floor(totalUsers * 0.45) },
        { device: "Tablet", users: Math.floor(totalUsers * 0.15) }
    ];

    // Recent activities
    const activityTypes: RecentActivity['type'][] = ['register', 'login', 'enroll', 'complete', 'certificate'];
    const names = [
        "Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D",
        "Hoàng Văn E", "Đặng Thị F", "Vũ Văn G", "Bùi Thị H"
    ];

    const descriptions = {
        register: "đã đăng ký tài khoản mới.",
        login: "đã đăng nhập vào hệ thống.",
        enroll: "đã đăng ký khóa học mới.",
        complete: "đã hoàn thành khóa học.",
        certificate: "đã nhận chứng chỉ khóa học."
    };

    const recentActivities = Array.from({ length: 20 }, (_, i) => {
        const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        const timestamp = new Date();
        timestamp.setMinutes(timestamp.getMinutes() - Math.floor(Math.random() * 60 * 24)); // Random time in last 24 hours

        return {
            id: `activity-${i}`,
            type,
            user: {
                name,
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            },
            description: descriptions[type],
            timestamp
        };
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Recent sales
    const recentSales = Array.from({ length: 10 }, (_, i) => ({
        id: `sale-${i}`,
        customerName: names[Math.floor(Math.random() * names.length)],
        customerEmail: `customer${i}@example.com`,
        amount: Math.floor(1000000 + Math.random() * 5000000),
        currency: 'VND',
        status: ['completed', 'pending', 'refunded'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'refunded',
        itemName: `Khóa học ${['Lập trình', 'Marketing', 'Thiết kế', 'Kinh doanh', 'Ngoại ngữ'][Math.floor(Math.random() * 5)]}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)),
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(names[Math.floor(Math.random() * names.length)])}&background=random`
    }));

    return {
        dashboardData: {
            totalUsers,
            totalCourses,
            totalLessons,
            totalEnrollments,
            lastUpdated: new Date(),
            loading: false
        },
        revenueByMonth,
        enrollmentsByMonth,
        enrollmentsByCategory,
        usersByDevice,
        recentActivities,
        recentSales
    };
};

// Provider component
export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State for data
    const [mockData, setMockData] = useState(generateMockData());

    // Realtime connection state
    const [isConnected, setIsConnected] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(new Date());
    const [performance, setPerformance] = useState(85);
    const [error, setError] = useState<string | null>(null);

    // Toggle pause state
    const toggle = () => {
        setIsPaused(!isPaused);
    };

    // Effect to simulate real-time updates
    useEffect(() => {
        if (isPaused || !isConnected) return;

        const interval = setInterval(() => {
            // 5% chance of performance fluctuation
            if (Math.random() < 0.05) {
                const newPerformance = Math.min(100, Math.max(30, performance + (Math.random() > 0.5 ? 10 : -10)));
                setPerformance(newPerformance);
            }

            // 1% chance of connection issue
            if (Math.random() < 0.01) {
                setIsConnected(false);
                setTimeout(() => setIsConnected(true), 5000);
            }

            // Update the data
            setMockData(generateMockData());
            setLastUpdate(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [isPaused, isConnected, performance]);

    // Context value
    const value: RealtimeContextType = {
        dashboardData: mockData.dashboardData,
        revenueByMonth: mockData.revenueByMonth,
        enrollmentsByMonth: mockData.enrollmentsByMonth,
        enrollmentsByCategory: mockData.enrollmentsByCategory,
        usersByDevice: mockData.usersByDevice,
        recentActivities: mockData.recentActivities,
        recentSales: mockData.recentSales,
        isConnected,
        isPaused,
        lastUpdate,
        performance,
        error,
        toggle
    };

    return (
        <RealtimeContext.Provider value={value}>
            {children}
        </RealtimeContext.Provider>
    );
}; 
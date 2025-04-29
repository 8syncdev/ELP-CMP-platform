import React from 'react'
import { Metadata } from 'next'
import { RealtimeProvider } from '@/providers/realtime-provider'
import {
  DashboardStats,
  RealtimeControl,
  RecentActivities,
  EnrollmentsChart,
  UsersByDeviceChart,
  RevenueChart
} from './_components'
import { Separator } from '@/components/ui/separator'
import { ArrowDownToLine, RefreshCw, Sparkles, Search, SlidersHorizontal, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ThemeToggle } from '@/components/theme-toggle'

export const metadata: Metadata = {
  title: 'Dashboard | Admin Panel',
  description: 'Trang quản trị hệ thống',
}

const DashboardPage = () => {
  return (
    <RealtimeProvider>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in duration-500">
          {/* Welcome Header with Search and Filter */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight blur-in">Chào mừng đến với Trang quản trị</h1>
                <p className="text-sm md:text-base text-muted-foreground blur-in" style={{ animationDelay: '100ms' }}>
                  Quản lý và theo dõi tất cả hoạt động của hệ thống tại một nơi.
                </p>
              </div>

              <div className="flex items-center gap-2 blur-in order-first md:order-last" style={{ animationDelay: '200ms' }}>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Xuất báo cáo
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Làm mới</span>
                </Button>
                <ThemeToggle />
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2 blur-in" style={{ animationDelay: '250ms' }}>
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Tìm kiếm..." className="pl-8 w-full" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Thời gian</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <span>Bộ lọc</span>
                </Button>
              </div>
            </div>
          </div>

          <Separator className="blur-in" style={{ animationDelay: '300ms' }} />

          {/* Realtime Control */}
          <RealtimeControl />

          {/* Stats Overview */}
          <DashboardStats />

          {/* Main Content */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-12 xl:grid-cols-12 auto-rows-auto">
            {/* Charts */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-4">
              <EnrollmentsChart />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-4">
              <RecentActivities />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-4">
              <UsersByDeviceChart />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-12 xl:col-span-12">
              <RevenueChart />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-6 md:mt-10 text-center text-xs md:text-sm text-muted-foreground blur-in">
            <p>© 2023 8SyncDev. Bản quyền thuộc về công ty TNHH Giáo dục trực tuyến 8SyncDev.</p>
            <div className="flex items-center justify-center mt-2 gap-1">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              <span>Powered by Advanced Analytics Dashboard</span>
            </div>
          </footer>
        </div>
      </ScrollArea>
    </RealtimeProvider>
  )
}

export default DashboardPage
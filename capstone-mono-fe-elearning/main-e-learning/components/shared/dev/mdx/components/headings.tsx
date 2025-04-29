import { memo } from 'react'
import { GraduationCap, BookOpen, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

export const H1 = memo(({ children }: { children: React.ReactNode }) => (
    <h1 className={cn(
        "flex items-center gap-3",
        "text-2xl md:text-3xl",
        "font-bold mb-6",
        "text-chart-1"
    )}>
        <GraduationCap className={cn("w-8 h-8 text-primary")} />
        <span>{children}</span>
    </h1>
))

export const H2 = memo(({ children }: { children: React.ReactNode }) => (
    <h2 className={cn(
        "flex items-center gap-2",
        "text-xl md:text-2xl",
        "font-bold mt-8 mb-4",
        "text-chart-2"
    )}>
        <BookOpen className={cn("w-6 h-6 text-primary/80")} />
        {children}
    </h2>
))

export const H3 = memo(({ children }: { children: React.ReactNode }) => (
    <h3 className={cn(
        "flex items-center gap-2",
        "text-lg md:text-xl",
        "font-bold mt-6 mb-3",
        "text-chart-3"
    )}>
        <Hash className={cn("w-5 h-5 text-primary/70")} />
        {children}
    </h3>
))

// Add display names for memo components
H1.displayName = 'H1'
H2.displayName = 'H2'
H3.displayName = 'H3'
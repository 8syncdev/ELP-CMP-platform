import { memo } from 'react'
import { cn } from '@/lib/utils'

export const Paragraph = memo(({ children }: { children: React.ReactNode }) => (
    <p className={cn(
        "py-2",
        "w-full",
        "leading-7",
        "text-foreground",
        "whitespace-pre-wrap"
    )}>
        {children}
    </p>
))

export const BlockQuote = memo(({ children }: { children: React.ReactNode }) => (
    <blockquote className={cn(
        "pl-4 py-2 my-4",
        "border-l-2 border-primary",
        "bg-primary/5",
        "rounded-r",
        "italic",
        "text-muted-foreground"
    )}>
        {children}
    </blockquote>
))
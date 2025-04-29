import { memo } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const UnorderedList = memo(({ children }: { children: React.ReactNode }) => (
    <ul className={cn(
        "space-y-2",
        "my-4",
        "max-w-[65ch]"
    )}>
        {children}
    </ul>
))

export const OrderedList = memo(({ children }: { children: React.ReactNode }) => (
    <ol className={cn(
        "space-y-2",
        "my-4", 
        "max-w-[65ch]",
        "list-decimal",
        "list-inside"
    )}>
        {children}
    </ol>
))

export const ListItem = memo(({ children }: { children: React.ReactNode }) => (
    <li className={cn(
        "group",
        "pl-8",
        "py-1.5",
        "hover:bg-muted/50",
        "rounded",
        "relative"
    )}>
        <span className={cn(
            "absolute",
            "left-2",
            "top-2.5",
            "text-primary"
        )}>•</span>
        {children}
    </li>
))
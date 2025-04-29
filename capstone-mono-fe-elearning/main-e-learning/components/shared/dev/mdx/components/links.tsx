import { memo } from 'react'
import Link from 'next/link'
import { ExternalLink as ExternalLinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export const InternalLink = memo(({ children, href, ...props }: { children: React.ReactNode, href: string }) => (
    <Link
        href={href}
        className={cn(
            "text-primary hover:text-primary/80",
            "font-medium"
        )}
        {...props}
    >
        {children}
    </Link>
))

export const ExternalLink = memo(({ children, href, ...props }: { children: React.ReactNode, href: string }) => (
    <a
        href={href}
        className={cn(
            "inline-flex items-center gap-1.5",
            "text-primary hover:text-primary/80",
            "font-medium"
        )}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
    >
        {children}
        <ExternalLinkIcon className={cn("w-3.5 h-3.5")} />
    </a>
))

export const LinkComponent = memo(({ children, href, ...props }: { children: React.ReactNode, href?: string }) => {
    const LinkWrapper = href?.startsWith('/') ? InternalLink : ExternalLink
    return <LinkWrapper href={href || '#'} {...props}>{children}</LinkWrapper>
})
'use client'

import { memo } from 'react'
import Markdown from 'markdown-to-jsx'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { MarkdownRendererProps } from './types/mdx.types'

import {
    H1, H2, H3,
    Paragraph, BlockQuote,
    UnorderedList, OrderedList, ListItem,
    LinkComponent,
    CodeBlock
} from './components'

export const MarkdownRenderer = memo(({ content, className, showCopyButton = false }: MarkdownRendererProps) => {
    const { toast } = useToast()

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        toast({
            description: "Copied to clipboard",
            duration: 2000
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <Markdown
                options={{
                    overrides: {
                        h1: { component: H1 },
                        h2: { component: H2 },
                        h3: { component: H3 },
                        p: { component: Paragraph },
                        blockquote: { component: BlockQuote },
                        ul: { component: UnorderedList },
                        ol: { component: OrderedList },
                        li: { component: ListItem },
                        a: { component: LinkComponent },
                        code: { component: CodeBlock }
                    }
                }}
                className={cn(
                    "prose dark:prose-invert max-w-none",
                    "prose-headings:font-bold prose-headings:tracking-tight",
                    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                    "prose-code:text-primary",
                    "prose-pre:bg-transparent prose-pre:p-0",
                    "bg-background rounded-lg p-6",
                    "border border-border",
                    "shadow-sm",
                    className
                )}
            >
                {content}
            </Markdown>

            {showCopyButton && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                        onClick={handleCopy}
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                    </Button>
                </div>
            )}
        </div>
    )
})

export default MarkdownRenderer
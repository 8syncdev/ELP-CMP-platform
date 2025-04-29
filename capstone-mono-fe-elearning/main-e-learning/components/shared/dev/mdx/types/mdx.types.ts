// components/shared/dev/mdx/types/mdx.types.ts
export interface CodeBlockProps {
    children: React.ReactNode
    className?: string
    language?: string
    showLineNumbers?: boolean
    showCopyButton?: boolean
    showLanguageHint?: boolean
    isCodeBlock?: boolean
    enableTyping?: boolean
    typingSpeed?: number
    loop?: boolean
    typingDelay?: number
    typeMode?: TypeMode
    wrapModeDev?: boolean
}

export interface MarkdownRendererProps {
    content: string
    className?: string
    showCopyButton?: boolean;
    configCodeBlock?: CodeBlockProps
}

export type TypeMode = 'char' | 'line'

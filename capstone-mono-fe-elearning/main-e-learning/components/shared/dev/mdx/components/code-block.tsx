import React, { useState, memo, useEffect } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Copy, Check, Code2, Terminal, Heart, ScanLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { languageMap } from '../config/language-map'
import { CodeBlockProps } from '../types/mdx.types'
import { MY_INFO } from '@/constants/my-info'

// Import các ngôn ngữ cần thiết từ react-syntax-highlighter
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import { Card, CardContent } from '@/components/ui/card'
import { useIsMobile } from '@/hooks/use-mobile'

// Đăng ký các ngôn ngữ
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('json', json)


//--------------------------------

const InlineCode = memo(({ children }: { children: React.ReactNode }) => {
    const inlineCodeStyles = cn(
        "relative inline-flex items-center gap-1.5",
        "px-2 py-0.5 mx-0.5",
        "font-mono text-[13px] sm:text-sm font-medium",
        "rounded-md",
        "bg-secondary/30 dark:bg-secondary/20",
        "border border-border/20",
        "text-primary dark:text-primary/90",
        "transition-colors duration-200",
        "hover:bg-secondary/40 dark:hover:bg-secondary/30",
        "break-words whitespace-pre-wrap",
        "max-w-full overflow-x-auto"
    )

    return (
        <code className={inlineCodeStyles}>
            <span>{children}</span>
        </code>
    )
})

const CodeBlockFooter = memo(() => {
    const footerStyles = cn(
        "flex flex-wrap items-center justify-end gap-2",
        "px-4 py-2",
        "bg-secondary/20 dark:bg-secondary/10",
        "border-t border-border/10",
        "text-xs text-muted-foreground/70",
        "min-h-[2.5rem]"
    )
    return (
        <div className={footerStyles + "flex flex-col gap-2"}>
            <div className="flex items-center gap-1 flex-wrap">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-500 shrink-0" />
                <span>by {MY_INFO.company}</span>
            </div>
            <div className="flex items-center gap-1">
                <span>Tác giả:</span>
                <span>{MY_INFO.name}</span> |
                <span>Phone: {MY_INFO.contact}</span>

            </div>
        </div>
    )
})

const CodeBlockHeader = memo(({ displayLang, copied, onCopy, showLanguageHint, showCopyButton }: {
    displayLang: string
    copied: boolean
    onCopy: () => void
    showLanguageHint: boolean
    showCopyButton: boolean
}) => {
    const headerStyles = cn(
        "flex items-center justify-between",
        "px-4 py-2.5",
        "bg-secondary/20 dark:bg-secondary/10",
        "border-b border-border/10",
        "rounded-t-lg"
    )

    const languageHintStyles = cn(
        "flex items-center gap-2",
        "text-sm font-medium",
        "text-muted-foreground/90"
    )

    const copyButtonStyles = cn(
        "h-8 w-8",
        "hover:bg-secondary/30 dark:hover:bg-secondary/20",
        "transition-all duration-200",
        "focus:ring-2 focus:ring-primary/20"
    )

    return (
        <div className={headerStyles}>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/90" />
                    <div className="w-3 h-3 rounded-full bg-chart-4/90" />
                    <div className="w-3 h-3 rounded-full bg-chart-2/90" />
                </div>
                {showLanguageHint && (
                    <div className={languageHintStyles}>
                        <Terminal className="w-4 h-4" />
                        <span>{displayLang}</span>
                    </div>
                )}
            </div>
            {showCopyButton && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCopy}
                    className={copyButtonStyles}
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-primary animate-in fade-in-50" />
                    ) : (
                        <Copy className="w-4 h-4 opacity-80 hover:opacity-100" />
                    )}
                </Button>
            )}
        </div>
    )
})



const CodeBlock = memo(({
    children,
    className,
    language = '',
    showLineNumbers = false,
    showCopyButton = true,
    showLanguageHint = true,
    enableTyping = false,
    typingSpeed = 50,
    loop = false,
    typingDelay = 1000,
    typeMode = 'char',
    isCodeBlock = false,
    wrapModeDev = false
}: CodeBlockProps) => {
    const isMobile = useIsMobile();
    const shouldWrap = wrapModeDev || !isMobile;
    const [copied, setCopied] = useState(false)
    const [displayText, setDisplayText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const text = children as string

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(children as string)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const processLine = (line: string): { style: React.CSSProperties; processedLine: string } => {
        const firstChar = line.charAt(0)
        const style: React.CSSProperties = {
            display: 'block',
            ...(firstChar === '+' && { backgroundColor: 'rgba(40, 167, 69, 0.2)' }),
            ...(firstChar === '-' && { backgroundColor: 'rgba(220, 53, 69, 0.2)' }),
            ...(firstChar === '>' && { backgroundColor: 'rgba(0, 123, 255, 0.2)' })
        }

        return {
            style,
            processedLine: ['+', '-', '>'].includes(firstChar) ? line.slice(1).trimStart() : line
        }
    }

    const processText = (content: string): string => {
        return content.split('\n')
            .map(line => processLine(line).processedLine)
            .join('\n')
    }

    useEffect(() => {
        if (!enableTyping) {
            setDisplayText(processText(text))
            return
        }

        let typingInterval: NodeJS.Timeout
        const processedContent = processText(text)
        const lines = processedContent.split('\n')

        const startTyping = () => {
            setIsTyping(true)

            if (typeMode === 'char') {
                let currentIndex = 0
                const typeNextChar = () => {
                    if (currentIndex < processedContent.length) {
                        setDisplayText(processedContent.slice(0, currentIndex + 1))
                        currentIndex++
                        typingInterval = setTimeout(typeNextChar, typingSpeed)
                    } else {
                        setIsTyping(false)
                        if (loop) {
                            setTimeout(startTyping, typeof loop === 'number' ? loop : typingDelay)
                        }
                    }
                }
                typeNextChar()
            } else { // line mode
                let currentLineIndex = 0
                const typeNextLine = () => {
                    if (currentLineIndex < lines.length) {
                        setDisplayText(lines.slice(0, currentLineIndex + 1).join('\n'))
                        currentLineIndex++
                        typingInterval = setTimeout(typeNextLine, typingSpeed * 20)
                    } else {
                        setIsTyping(false)
                        if (loop) {
                            setTimeout(startTyping, typeof loop === 'number' ? loop : typingDelay)
                        }
                    }
                }
                typeNextLine()
            }
        }

        startTyping()
        return () => clearTimeout(typingInterval)
    }, [text, enableTyping, typingSpeed, loop, typingDelay, typeMode])

    if (!isCodeBlock && !className) {
        return <InlineCode>{children}</InlineCode>
    }

    const detectedLang = className?.replace('language-', '') || language
    const displayLang = languageMap[detectedLang] || detectedLang

    const mobileWidth = "w-[280px] sm:w-full"
    const containerStyles = cn(
        "group relative",
        mobileWidth,
        "mx-auto",
        "overflow-hidden rounded-lg",
        "bg-secondary/5 dark:bg-secondary/10",
        "border border-border/10",
        "shadow-md",
        "transition-all duration-200",
        "hover:shadow-md hover:border-border/20",
        "border-primary/10 dark:border-primary/20 border-2",
    )

    const codeWrapperStyles = cn(
        "relative font-mono text-sm",
        "overflow-x-auto",
        "scrollbar-thin scrollbar-track-transparent",
        "scrollbar-thumb-border/40 hover:scrollbar-thumb-border/60",
        "px-4 sm:px-6",
        "py-4",
        mobileWidth,
    )

    return (
        <div className={cn(containerStyles, className)}>
            <CodeBlockHeader
                displayLang={displayLang}
                copied={copied}
                onCopy={copyToClipboard}
                showLanguageHint={showLanguageHint}
                showCopyButton={showCopyButton}
            />
            {!shouldWrap && text.length > 500 && (
                <Card className="mx-4 mb-2">
                    <CardContent className="py-2 px-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <ScanLine size={12} className="text-primary" />
                            <span>Kéo ngang để xem thêm nội dung</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className={codeWrapperStyles}>
                <SyntaxHighlighter
                    language={displayLang.toLowerCase().replace("lang-", "")}
                    style={oneDark}
                    showLineNumbers={showLineNumbers}
                    customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        minHeight: '8rem',
                        width: '100%',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                    }}
                    showInlineLineNumbers={false}
                    wrapLongLines={true}
                    wrapLines={true}
                    lineProps={(lineNumber: number) => {
                        const line = text.split('\n')[lineNumber - 1] || ''
                        const { style } = processLine(line)
                        return {
                            style: {
                                ...style,
                                flexWrap: shouldWrap ? 'wrap' : 'nowrap',
                                whiteSpace: shouldWrap ? 'pre-wrap' : 'nowrap'
                            },
                        }
                    }}
                >
                    {enableTyping ? displayText : processText(text)}
                </SyntaxHighlighter>
            </div>

            <CodeBlockFooter />
        </div>
    )
})

InlineCode.displayName = 'InlineCode'
CodeBlockHeader.displayName = 'CodeBlockHeader'
CodeBlock.displayName = 'CodeBlock'

export { InlineCode, CodeBlock }
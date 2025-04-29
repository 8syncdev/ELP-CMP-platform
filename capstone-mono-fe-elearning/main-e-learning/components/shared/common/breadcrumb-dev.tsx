"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbItem {
    label: string
    href: string
    notShow?: string[]
}

interface BreadcrumbDevProps {
    notShow?: string[],
    className?: string,
    onlyShow?: boolean
}

const checkPathInclude = (path: string, notShow: string[]) => {
    return notShow.some(item => path.includes(item))
}

const BreadcrumbDev = ({
    notShow = ["/", "/test", "/ai-agent", "/test/game-3d"],
    className,
    onlyShow = false
}: BreadcrumbDevProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const [items, setItems] = React.useState<BreadcrumbItem[]>([])

    React.useEffect(() => {
        // Split path and create breadcrumb items
        const pathSegments = pathname
            .split("/")
            .filter(segment => segment !== "")

        const breadcrumbItems = pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/")
            let label = segment
                .split("-")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")

            // Đặc biệt xử lý cho đường dẫn /learning
            if (segment === "learning") {
                label = "Khóa học"
            }

            return { label, href }
        })

        setItems([{ label: "Home", href: "/" }, ...breadcrumbItems])
    }, [pathname])

    // Kiểm tra xem có phải là trang learning/[slug] không
    const isLearningDetailPage = /^\/learning\/[^\/]+$/.test(pathname)

    return (
        (onlyShow || pathname !== '/' && (!checkPathInclude(pathname, notShow) || isLearningDetailPage)) && (
            <div className="flex items-center gap-4 sticky top-14 z-10 container mx-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="hover:bg-accent"
                    aria-label="Go back"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <Breadcrumb className={cn("flex-1", className)}>
                    <BreadcrumbList>
                        {items.map((item, index) => (
                            <React.Fragment key={item.href}>
                                {index !== 0 && (
                                    <BreadcrumbSeparator>
                                        <ChevronRight className="h-4 w-4" />
                                    </BreadcrumbSeparator>
                                )}
                                <BreadcrumbItem>
                                    {index === items.length - 1 ? (
                                        <BreadcrumbPage className="font-medium">
                                            {item.label}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                {item.label}
                                            </Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        )
    )
}

export default BreadcrumbDev

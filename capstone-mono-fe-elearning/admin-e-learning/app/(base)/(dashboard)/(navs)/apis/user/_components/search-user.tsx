"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export function SearchUser() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [searchTerm, setSearchTerm] = useState("")

    // Khởi tạo giá trị tìm kiếm từ URL khi component được mount
    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "")
    }, [searchParams])

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams)
        params.set("search", searchTerm)
        params.set("page", "1")

        // Giữ lại limit
        if (!params.has("limit")) {
            params.set("limit", "10")
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Tìm kiếm người dùng..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
        </div>
    )
} 
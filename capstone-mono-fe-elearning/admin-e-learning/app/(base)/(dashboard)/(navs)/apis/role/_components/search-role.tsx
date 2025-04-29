"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SearchRole() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")

    const handleSearch = () => {
        const params = new URLSearchParams(window.location.search)
        params.set("search", searchTerm)
        params.set("page", "1")
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Tìm kiếm vai trò..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
        </div>
    )
} 
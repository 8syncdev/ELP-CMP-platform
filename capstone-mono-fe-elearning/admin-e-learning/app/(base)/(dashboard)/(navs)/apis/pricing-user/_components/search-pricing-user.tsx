"use client"

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

export function SearchPricingUser() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search')?.toString() || '')
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (debouncedSearchTerm) {
            params.set('search', debouncedSearchTerm)
        } else {
            params.delete('search')
        }

        // Reset to page 1 when searching
        params.set('page', '1')
        replace(`${pathname}?${params.toString()}`)
    }, [debouncedSearchTerm, pathname, replace, searchParams])

    return (
        <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Tìm kiếm theo Id gói, Id người dùng..."
                className="w-full pl-8"
                defaultValue={searchParams.get('search')?.toString()}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
} 
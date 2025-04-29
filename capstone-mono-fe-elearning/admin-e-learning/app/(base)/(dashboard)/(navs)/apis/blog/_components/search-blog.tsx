"use client"

import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'

export function SearchBlog() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [searchValue, setSearchValue] = React.useState(searchParams.get('search') || '')
    const debouncedValue = useDebounce(searchValue, 500)

    React.useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (debouncedValue) {
            params.set('search', debouncedValue)
        } else {
            params.delete('search')
        }

        params.set('page', '1')

        router.push(`${pathname}?${params.toString()}`)
    }, [debouncedValue, pathname, router, searchParams])

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Tìm kiếm bài viết..."
                className="pl-8"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    )
} 
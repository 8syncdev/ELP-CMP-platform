"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useCallback } from 'react'

export function SearchEnrollment() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Lấy giá trị search hiện tại
    const currentSearch = searchParams.get('search') || ''

    // Hàm cập nhật URL với tham số tìm kiếm
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            params.set('page', '1') // Reset về trang 1 khi tìm kiếm mới
            return params.toString()
        },
        [searchParams]
    )

    // Xử lý khi nhấn Enter trên input
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const value = (e.target as HTMLInputElement).value
            router.push(`${pathname}?${createQueryString('search', value)}`)
        }
    }

    // Xử lý khi nhấn nút tìm kiếm
    const handleSearch = () => {
        const value = (document.getElementById('search-input') as HTMLInputElement).value
        router.push(`${pathname}?${createQueryString('search', value)}`)
    }

    return (
        <div className="flex items-center justify-between">
            <div className="relative flex items-center w-[300px] max-w-sm">
                <Input
                    id="search-input"
                    placeholder="Tìm kiếm theo ID người dùng, khóa học..."
                    className="pr-10"
                    defaultValue={currentSearch}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    variant="ghost"
                    className="absolute right-0 h-full px-3 py-2"
                    onClick={handleSearch}
                >
                    <Search className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
} 
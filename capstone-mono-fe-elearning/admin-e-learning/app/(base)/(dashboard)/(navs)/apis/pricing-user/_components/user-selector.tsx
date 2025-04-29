"use client"

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { UsersDto } from '@/lib/actions/user'

interface UserSelectorProps {
    users: UsersDto[]
    currentUserId: number
}

export function UserSelector({ users, currentUserId }: UserSelectorProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleUserChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('userId', value)
        params.set('page', '1') // Reset to page 1 when changing user
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="user-selector">Chọn người dùng</Label>
            <Select value={currentUserId.toString()} onValueChange={handleUserChange}>
                <SelectTrigger id="user-selector" className="w-[220px]">
                    <SelectValue placeholder="Chọn người dùng" />
                </SelectTrigger>
                <SelectContent>
                    {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                            {user.full_name || user.username}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
} 
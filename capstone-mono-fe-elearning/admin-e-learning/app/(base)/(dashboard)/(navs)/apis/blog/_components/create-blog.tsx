"use client"

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { BlogForm } from './blog-form'
import { useRouter } from 'next/navigation'
import { createBlog, BlogDto, CreateBlogDto, UpdateBlogDto } from '@/lib/actions/blog'
import { toast } from 'sonner'

export function CreateBlog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data: CreateBlogDto | UpdateBlogDto) => {
        try {
            setIsLoading(true)
            const response = await createBlog(data as CreateBlogDto)

            if (response.success) {
                toast.success("Tạo bài viết mới thành công")
                router.refresh()
                setOpen(false)
            } else {
                toast.error(response.message || "Tạo bài viết mới thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tạo bài viết mới")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Thêm bài viết
            </Button>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Thêm bài viết mới</AlertDialogTitle>
                        <AlertDialogDescription>
                            Điền thông tin cho bài viết mới
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <BlogForm
                        mode="create"
                        isLoading={isLoading}
                        onSubmit={onSubmit}
                        onCancel={() => setOpen(false)}
                        submitButtonText="Tạo bài viết"
                    />
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
} 
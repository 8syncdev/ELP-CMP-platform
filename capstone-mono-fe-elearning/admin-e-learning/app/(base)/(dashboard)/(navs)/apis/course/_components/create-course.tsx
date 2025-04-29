"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { createCourse } from '@/lib/actions/course'
import { toast } from 'sonner'
import { CreateCourseDto, UpdateCourseDto } from '@/lib/actions/course/course.type'
import { CourseForm } from './course-form'

export function CreateCourse() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (data: CreateCourseDto | UpdateCourseDto) => {
        setIsLoading(true)

        try {
            const createData = data as CreateCourseDto
            const result = await createCourse({
                ...createData,
                metadata: {
                    ...createData.metadata,
                    published_at: createData.metadata.published_at || new Date().toISOString()
                }
            })

            if (result.success) {
                toast.success('Khóa học đã được tạo thành công')
                setOpen(false)
                router.refresh()
            } else {
                toast.error(result.message || 'Có lỗi xảy ra khi tạo khóa học')
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo khóa học')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Tạo khóa học mới</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo khóa học mới</DialogTitle>
                    <DialogDescription>
                        Điền thông tin để tạo khóa học mới. Nhấn Lưu khi hoàn tất.
                    </DialogDescription>
                </DialogHeader>

                <CourseForm
                    mode="create"
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                    showFooter={true}
                />
            </DialogContent>
        </Dialog>
    )
} 
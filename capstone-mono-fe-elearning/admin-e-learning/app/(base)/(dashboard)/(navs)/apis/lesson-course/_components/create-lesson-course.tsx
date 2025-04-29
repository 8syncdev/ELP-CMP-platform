"use client"

import React, { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { LessonCourseForm } from './lesson-course-form'

export function CreateLessonCourse() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <>
            <Button
                className="flex items-center gap-2"
                onClick={() => setIsDialogOpen(true)}
            >
                <PlusCircle className="h-4 w-4" />
                Thêm liên kết mới
            </Button>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tạo liên kết bài học - khóa học</AlertDialogTitle>
                        <AlertDialogDescription>
                            Điền thông tin để tạo liên kết mới
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <LessonCourseForm
                        mode="create"
                        onCancel={() => setIsDialogOpen(false)}
                        submitButtonText="Tạo liên kết"
                    />
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
} 
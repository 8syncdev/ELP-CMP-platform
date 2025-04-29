"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { LessonForm } from "./lesson-form"
import { createLesson } from "@/lib/actions/lesson"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CreateLessonDto, UpdateLessonDto } from "@/lib/actions/lesson/lesson.type"

export function CreateLesson() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (data: CreateLessonDto | UpdateLessonDto) => {
        try {
            setIsLoading(true)
            const response = await createLesson(data as CreateLessonDto)

            if (response.success) {
                toast.success("Tạo bài học thành công")
                router.refresh()
                setIsOpen(false)
            } else {
                toast.error(response.message || "Tạo bài học thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tạo bài học")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Tạo bài học
            </Button>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tạo bài học mới</AlertDialogTitle>
                        <AlertDialogDescription>
                            Điền thông tin để tạo bài học mới
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <LessonForm
                        mode="create"
                        isLoading={isLoading}
                        onSubmit={onSubmit}
                        onCancel={() => setIsOpen(false)}
                        submitButtonText="Tạo bài học"
                    />
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
} 
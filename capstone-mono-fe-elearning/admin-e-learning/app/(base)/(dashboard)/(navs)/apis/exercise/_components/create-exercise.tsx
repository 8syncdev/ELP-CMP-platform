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
import { ExerciseForm } from "./exercise-form"
import { createExercise } from "@/lib/actions/exercise"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CreateExerciseDto, UpdateExerciseDto } from "@/lib/actions/exercise/exercise.type"

export function CreateExercise() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (data: CreateExerciseDto | UpdateExerciseDto) => {
        setIsLoading(true)
        try {
            const response = await createExercise(data as CreateExerciseDto)
            if (response.success) {
                toast.success("Tạo bài tập thành công")
                setIsOpen(false)
                router.refresh()
            } else {
                toast.error(response.message || "Tạo bài tập thất bại")
            }
        } catch (error) {
            console.error("Error creating exercise:", error)
            toast.error("Đã xảy ra lỗi khi tạo bài tập")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Tạo bài tập
            </Button>

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tạo bài tập mới</AlertDialogTitle>
                        <AlertDialogDescription>
                            Điền thông tin để tạo bài tập mới
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <ExerciseForm
                        mode="create"
                        isLoading={isLoading}
                        onSubmit={onSubmit}
                        onCancel={() => setIsOpen(false)}
                        submitButtonText="Tạo bài tập"
                    />
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

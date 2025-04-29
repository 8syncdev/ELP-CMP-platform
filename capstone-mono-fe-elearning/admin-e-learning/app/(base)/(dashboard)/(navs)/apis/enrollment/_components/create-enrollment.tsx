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
import { EnrollmentForm } from './enrollment-form'

export function CreateEnrollment() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    return (
        <>
            <Button
                className="flex items-center gap-2 relative"
                onClick={() => setIsDialogOpen(true)}
                disabled={isLoading}
            >
                <PlusCircle className="h-4 w-4" />
                <span className={isLoading ? "opacity-0" : ""}>Thêm đăng ký mới</span>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    </div>
                )}
            </Button>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tạo đăng ký khóa học mới</AlertDialogTitle>
                        <AlertDialogDescription>
                            Điền thông tin để tạo đăng ký mới
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <EnrollmentForm
                        mode="create"
                        isLoading={isLoading}
                        onCancel={() => setIsDialogOpen(false)}
                        submitButtonText="Tạo đăng ký"
                    />
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
} 
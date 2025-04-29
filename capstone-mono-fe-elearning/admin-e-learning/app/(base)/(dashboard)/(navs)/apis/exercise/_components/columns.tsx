"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteExercise, updateExercise } from "@/lib/actions/exercise"
import { toast } from "sonner"
import { ExerciseForm } from "./exercise-form"
import { ExerciseDto, UpdateExerciseDto, ExerciseMetadataDto, ExerciseTestcaseDto, ExercisePrivilege } from "@/lib/actions/exercise/exercise.type"

export interface Exercise {
    id: number
    slug: string
    content: string
    solution: string
    testcases: ExerciseTestcaseDto | { input: string, expected: string }[]
    metadata: ExerciseMetadataDto
}

// Component cho Action Cell
const ActionCell = ({ row }: { row: any }) => {
    const exercise = row.original as Exercise
    const router = useRouter()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Xử lý xóa bài tập
    const handleDelete = async () => {
        setIsLoading(true)
        try {
            const response = await deleteExercise(exercise.id)
            if (response.success) {
                toast.success("Xóa bài tập thành công")
                router.refresh()
            } else {
                toast.error(response.message || "Xóa bài tập thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa bài tập")
            console.error(error)
        } finally {
            setIsLoading(false)
            setIsDeleteDialogOpen(false)
        }
    }

    // Xử lý cập nhật bài tập
    const handleUpdate = async (data: UpdateExerciseDto) => {
        setIsLoading(true)
        try {
            // Log the data being sent to the API
            console.log('Updating exercise with data:', data)

            // Make a copy of the data to avoid modifying the original
            const updatedData = { ...data };

            // Ensure metadata privilege is one of the allowed values
            if (updatedData.metadata && updatedData.metadata.privilege) {
                const validPrivileges: ExercisePrivilege[] = ['free', 'registered', 'pricing-1', 'pricing-2', 'pricing-3'];
                if (!validPrivileges.includes(updatedData.metadata.privilege as ExercisePrivilege)) {
                    updatedData.metadata.privilege = 'free' as ExercisePrivilege;
                }
            }

            const response = await updateExercise(exercise.id, updatedData)
            if (response.success) {
                toast.success("Cập nhật bài tập thành công")
                router.refresh()
                setIsEditFormOpen(false)
            } else {
                toast.error(response.message || "Cập nhật bài tập thất bại")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật bài tập")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <DropdownMenu open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => {
                            setIsPopoverOpen(false)
                            setIsEditFormOpen(true)
                        }}
                    >
                        Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                            setIsPopoverOpen(false)
                            setIsDeleteDialogOpen(true)
                        }}
                    >
                        Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog xác nhận xóa */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Bài tập sẽ bị xóa vĩnh viễn khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? "Đang xóa..." : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Form chỉnh sửa */}
            <AlertDialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
                <AlertDialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Chỉnh sửa bài tập</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cập nhật thông tin bài tập
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <ExerciseForm
                        mode="edit"
                        exercise={{
                            ...exercise,
                            testcases: Array.isArray(exercise.testcases)
                                ? { code: "", test_cases: exercise.testcases }
                                : exercise.testcases
                        } as unknown as ExerciseDto}
                        isLoading={isLoading}
                        onSubmit={handleUpdate}
                        onCancel={() => setIsEditFormOpen(false)}
                        submitButtonText="Cập nhật"
                    />
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export const columns: ColumnDef<Exercise>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    {
        accessorKey: "metadata.title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tiêu đề
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.original.metadata.title}</div>,
    },
    {
        accessorKey: "metadata.difficulty",
        header: "Độ khó",
        cell: ({ row }) => <div>{row.original.metadata.difficulty}</div>,
    },
    {
        accessorKey: "metadata.author",
        header: "Tác giả",
        cell: ({ row }) => <div>{row.original.metadata.author}</div>,
    },

    {
        accessorKey: "metadata.isPublished",
        header: "Trạng thái",
        cell: ({ row }) => (
            <div>
                {row.original.metadata.isPublished ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Đã xuất bản
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Bản nháp
                    </span>
                )}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ActionCell,
    },
]

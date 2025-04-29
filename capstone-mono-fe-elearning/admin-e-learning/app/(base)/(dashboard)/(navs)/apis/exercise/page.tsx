import { getExercises, ExerciseDto } from '@/lib/actions/exercise'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExerciseTable, Exercise } from './_components'

interface Props {
    searchParams: Promise<{
        page?: string
        limit?: string
        search?: string
    }>
}

const ExercisesPage = async ({ searchParams }: Props) => {
    // Lấy giá trị mặc định nếu không có
    const { page, limit, search } = await searchParams
    const currentPage = Number(page) || 1
    const pageSize = Number(limit) || 10
    const searchQuery = search || ''

    // Gọi API với phân trang
    // Lưu ý: Chức năng tìm kiếm chưa được hỗ trợ trong API backend nên tạm thời không sử dụng
    const exercises = await getExercises(currentPage, pageSize, searchQuery)
    const totalPages = exercises.pagination?.totalPages || 1

    // Chuyển đổi ExerciseDto[] sang Exercise[] và xử lý testcases
    const formattedExercises = ((exercises?.result as ExerciseDto[]) || []).map(exercise => {
        // Kiểm tra nếu testcases là mảng thì chuyển đổi sang định dạng phù hợp
        if (Array.isArray(exercise.testcases)) {
            return {
                ...exercise,
                testcases: {
                    code: "",
                    test_cases: exercise.testcases
                }
            }
        }
        return exercise
    })

    return (
        <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh sách bài tập</CardTitle>
                </CardHeader>
                <CardContent>
                    <ExerciseTable
                        data={formattedExercises as Exercise[]}
                        totalPages={totalPages}
                        currentPage={currentPage}
                        limit={pageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ExercisesPage

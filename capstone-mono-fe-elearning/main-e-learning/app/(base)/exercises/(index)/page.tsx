import { ExerciseDto, getExercises } from '@/lib/actions/exercise'
import { ExerciseList, ExerciseFilter, ExercisePagination } from './_components'
import { ExerciseProvider } from '@/providers'

interface Props {
    searchParams: Promise<{
        page?: string
        size?: string
        title?: string
        tags?: string[]
        difficulty?: string
    }>
}

const ExercisesPage = async ({ searchParams }: Props) => {
    const { page = '1', size = '10' } = await searchParams;

    // Lấy dữ liệu ban đầu từ server
    const response = await getExercises(Number(page) || 1, Number(size) || 10);

    if (!response.success) {
        return <div>Có lỗi xảy ra</div>
    }
    return (
        <ExerciseProvider initialData={response.result as ExerciseDto[]}>
            <div className="container py-8 mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Danh sách bài tập</h1>
                <ExerciseFilter />
                <ExerciseList initialData={response.result as ExerciseDto[]} />
                <ExercisePagination />
            </div>
        </ExerciseProvider>
    )
}

export default ExercisesPage
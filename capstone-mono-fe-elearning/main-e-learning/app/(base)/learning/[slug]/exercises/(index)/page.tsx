import { ExerciseDto, getExercisesByCourseSlug } from '@/lib/actions/exercise'
import { ExerciseList, ExercisePagination } from './_components'

interface Props {
    params: Promise<{
        slug: string
    }>
    searchParams: Promise<{
        page?: string
        size?: string
    }>
}

const ExercisesPage = async ({ params, searchParams }: Props) => {
    const { page, size } = await searchParams
    const { slug } = await params

    const response = await getExercisesByCourseSlug(Number(page), Number(size), slug, "all")
    const exercises = response.result as ExerciseDto[]

    return (
        <div className="container py-8 mx-auto">
            <div className="sm:min-h-[700px] min-h-[500px]">
                <ExerciseList exercises={exercises} />
            </div>
            <ExercisePagination
                currentPage={Number(page) || 1}
                totalPages={response.pagination?.totalPages || 0}
                pageSize={Number(size) || 10}
            />
        </div>
    )
}

export default ExercisesPage
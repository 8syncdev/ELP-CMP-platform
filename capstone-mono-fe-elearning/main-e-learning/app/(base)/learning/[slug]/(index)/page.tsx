import { getCourseBySlug } from '@/lib/actions/course'
import { CourseHeader, CourseInfo } from './_components'
import { MarkdownRenderer } from '@/components/shared/dev/mdx/mdx'
import { Card } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { CourseDto } from '@/lib/actions/course'

interface Props {
    params: Promise<{
        slug: string
    }>
}

const Page = async ({ params }: Props) => {
    const { slug } = await params
    const response = await getCourseBySlug(slug)

    if (!response.success || !response.result) {
        redirect('/404')
    }

    const course = response.result as CourseDto

    return (
        <div className="container mx-auto py-6 space-y-6">
            <CourseHeader course={course} />
            <CourseInfo course={course} />
            {course.content && (
                <Card className="p-6">
                    <MarkdownRenderer content={course.content} />
                </Card>
            )}
        </div>
    )
}

export default Page
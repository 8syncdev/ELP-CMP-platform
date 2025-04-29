'use client'

import { ExerciseDto } from '@/lib/actions/exercise'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, BookOpen, BarChart } from 'lucide-react'
import Link from 'next/link'

interface ExerciseListProps {
    exercises: ExerciseDto[]
}

export const ExerciseList = ({ exercises }: ExerciseListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise) => (
                <Link href={`/exercises/${exercise.slug}`} key={exercise.id} className="h-full">
                    <Card className="hover:shadow-md transition-all h-full flex flex-col">
                        <CardHeader className="flex-1">
                            <CardTitle className="line-clamp-2">
                                {exercise.metadata.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {new Date(exercise.metadata.publishedTime).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" />
                                    {exercise.metadata.language.join(', ')}
                                </div>
                                <div className="flex items-center gap-1">
                                    <BarChart className="h-4 w-4" />
                                    {exercise.metadata.difficulty}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
} 
import { CourseResponse } from "@/lib/actions/course";
import { CourseCard } from "./course-card";

interface CourseGridProps {
    courses: CourseResponse;
    basePath: string;
}

export function CourseGrid({ courses, basePath }: CourseGridProps) {
    if (!courses.result || !Array.isArray(courses.result)) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.result.map((course, index) => (
                <CourseCard
                    key={course.slug}
                    course={course}
                    index={index}
                    basePath={basePath}
                />
            ))}
        </div>
    );
}

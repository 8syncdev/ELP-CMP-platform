import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseDto } from "@/lib/actions/course";
import { Clock, GraduationCap } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CourseCardProps {
    course: CourseDto;
    index: number;
    basePath: string;
}

export function CourseCard({ course, index, basePath }: CourseCardProps) {
    const { metadata } = course;

    return (
        <Link href={`${basePath}/${course.slug}/${!basePath.includes('/courses/zoom') ? 'lessons' : ''}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-video">
                    <Image
                        src={metadata.thumbnail}
                        alt={metadata.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute bottom-2 left-2 bg-primary/90">{metadata.level}</Badge>
                </div>
                <CardHeader className="flex-none space-y-1 p-4">
                    <CardTitle className="line-clamp-2 text-base">{metadata.name}</CardTitle>
                    <CardDescription className="line-clamp-1 text-xs">
                        {metadata.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden ring-1 ring-primary/20">
                            <Image
                                src={metadata.instructor_avatar}
                                alt={metadata.instructor_name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate">{metadata.instructor_name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span className="truncate">{metadata.duration}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex items-center gap-1 border-t p-3 text-xs text-muted-foreground flex-none">
                    <GraduationCap className="h-3 w-3 text-primary" />
                    <span className="font-medium">Học trực tuyến</span>
                </CardFooter>
            </Card>
        </Link>
    );
}

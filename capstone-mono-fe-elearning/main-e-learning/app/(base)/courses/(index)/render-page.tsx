"use client"

import { MY_INFO } from "@/constants/my-info"
import { BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { navigationConfig } from "@/components/shared/common/header/config"

export default function CoursesPage() {
    const courses = navigationConfig.mainNav
        .find(nav => nav.title === "Khóa học")
        ?.items?.filter(item => item.href.startsWith("/courses/")) || []

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Khóa Học Lập Trình Hiện Đại
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    {MY_INFO.sologun}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                    <div
                        key={course.title}
                        className="flex justify-center"
                    >
                        <Link href={course.href}>
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <course.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle>{course.title}</CardTitle>
                                    <CardDescription>{course.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Xem chi tiết khóa học
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}


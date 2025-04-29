import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { CourseDto } from "@/lib/actions/course";
import { ArrowRight, Clock, GraduationCap, PlayCircle, User } from "lucide-react";
import Image from "next/image";
import { MY_INFO } from "@/constants/my-info";
import Link from "next/link";

interface CourseDetailHeaderProps {
    course: CourseDto;
}

export function CourseDetailHeader({ course }: CourseDetailHeaderProps) {
    const { metadata } = course;

    const handlePlayVideo = () => {
        window.open(MY_INFO.socials.youtube, '_blank');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
                <Badge variant="secondary" className="text-lg">
                    {metadata.level}
                </Badge>
                <h1 className="text-4xl font-bold">{metadata.name}</h1>
                <p className="text-lg text-muted-foreground">
                    {metadata.description}
                </p>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden">
                            <Image
                                src={metadata.instructor_avatar}
                                alt={metadata.instructor_name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-medium">{metadata.instructor_name}</p>
                            <p className="text-sm text-muted-foreground">{metadata.instructor_email}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>{metadata.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <span>{metadata.instructor_contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <span>{metadata.level}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold">
                        {formatCurrency(metadata.discounted_price)}
                    </div>
                    {metadata.discounted_price < metadata.original_price && (
                        <div className="text-xl text-muted-foreground line-through">
                            {formatCurrency(metadata.original_price)}
                        </div>
                    )}
                </div>

                <Button size="lg" className="w-full sm:w-auto">
                    <Link
                        href={`/payment?courseSlug=${course.slug}`}
                        className="flex items-center justify-center gap-2"
                    >
                        Đăng Ký Ngay
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </Button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <Image
                    src={metadata.thumbnail}
                    alt={metadata.name}
                    fill
                    className="object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-white/90 p-4 transform group-hover:scale-110 transition-transform duration-300">
                        <PlayCircle className="h-12 w-12 text-primary" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-medium">Xem thêm thông tin</p>
                </div>
            </div>
        </div>
    );
}
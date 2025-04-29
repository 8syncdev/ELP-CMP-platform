import { GraduationCap, LucideIcon, BookOpen, Video, Presentation } from "lucide-react";

interface CourseHeaderProps {
    icon?: LucideIcon;
    title?: string;
    description?: string;
    pathname: string;
}

export function CourseHeader({
    icon: Icon,
    title,
    description,
    pathname
}: CourseHeaderProps) {
    const getHeaderConfig = () => {
        if (pathname.includes('video')) {
            return {
                icon: Video,
                title: "Khóa Học Video",
                description: "Khám phá các khóa học video chất lượng cao của chúng tôi. Học mọi lúc mọi nơi với nội dung được cập nhật liên tục."
            }
        }
        if (pathname.includes('zoom')) {
            return {
                icon: Presentation,
                title: "Khóa Học Trực Tuyến Zoom",
                description: "Tham gia các lớp học trực tuyến qua Zoom với giảng viên trực tiếp hướng dẫn và tương tác."
            }
        }
        if (pathname.includes('free')) {
            return {
                icon: BookOpen,
                title: "Khóa Học Miễn Phí",
                description: "Khám phá kho tàng kiến thức miễn phí của chúng tôi. Bắt đầu hành trình học tập của bạn ngay hôm nay."
            }
        }
        return {
            icon: GraduationCap,
            title: "Khóa Học Của Chúng Tôi",
            description: "Khám phá các khóa học đa dạng của chúng tôi được giảng dạy bởi các chuyên gia trong ngành. Học theo tốc độ của riêng bạn và nâng cao kỹ năng của bạn lên một tầm cao mới."
        }
    }

    const config = getHeaderConfig();
    const IconComponent = Icon || config.icon;

    return (
        <div className="text-center space-y-4 mb-12">
            <div className="flex justify-center">
                <div className="p-2 rounded-full bg-primary/10">
                    <IconComponent className="h-6 w-6 text-primary" />
                </div>
            </div>
            <h1 className="text-3xl font-bold">{title || config.title}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                {description || config.description}
            </p>
        </div>
    );
}

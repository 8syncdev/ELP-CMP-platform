import { AlertCircle, Video, VideoIcon, Presentation, BookOpen } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CourseHeader } from './course-header'
import Link from 'next/link'

interface CourseNotFoundProps {
    pathname: string;
}

export const CourseNotFound = ({ pathname }: CourseNotFoundProps) => {

    const getHeaderConfig = () => {
        if (pathname.includes('video')) {
            return {
                icon: VideoIcon,
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
        return null
    }

    const headerConfig = getHeaderConfig()

    return (
        <div className="container mx-auto py-12 space-y-8">
            {headerConfig && (
                <CourseHeader
                    icon={headerConfig.icon}
                    title={headerConfig.title}
                    description={headerConfig.description}
                    pathname={pathname}
                />
            )}
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Không tìm thấy khóa học</AlertTitle>
                <AlertDescription className="mt-4 space-y-4">
                    <p>
                        Rất tiếc, khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                    </p>
                    <Button
                        variant="outline"
                    >
                        <Link href={"/"}>
                            Quay lại trang chủ
                        </Link>
                    </Button>
                </AlertDescription>
            </Alert>
        </div>
    )
}

import { Metadata } from "next";
import { MY_INFO } from "@/constants/my-info";
import { CourseDto, CourseResponse } from "@/lib/actions/course";

interface GenerateCoursesMetadataProps {
    courses: CourseResponse;
    type: string;
}

export function generateCoursesMetadata({
    courses,
    type
}: GenerateCoursesMetadataProps): Metadata {
    const currentYear = new Date().getFullYear();
    const title = `Khóa Học ${type.toUpperCase()} Online ${currentYear} | ${MY_INFO.company} | ${MY_INFO.major}`;
    const description = `✓ ${MY_INFO.description} ✓ Khám phá các khóa học ${type.toUpperCase()} với công nghệ ${MY_INFO.techStack.frontend.join(', ')} ✓ Giảng viên ${MY_INFO.name} - ${MY_INFO.major} ✓ Hỗ trợ 24/7 qua ${MY_INFO.socials.zaloGroup}`;

    const metadata: Metadata = {
        metadataBase: new URL(MY_INFO.metadataBase),
        title,
        description,
        keywords: `khóa học ${type.toLowerCase()} ${currentYear}, học ${type.toLowerCase()} online, ${MY_INFO.techStack.frontend.join(', ')}, ${MY_INFO.techStack.backend.join(', ')}, ${MY_INFO.company}, ${MY_INFO.major}`,
        robots: 'index, follow',
        authors: [{ name: MY_INFO.name, url: MY_INFO.socials.facebook }],
        openGraph: {
            title,
            description,
            type: 'website',
            url: `/courses/${type}`,
            siteName: MY_INFO.company,
            locale: 'vi_VN',
            images: [
                {
                    url: MY_INFO.logo.src,
                    width: 1200,
                    height: 630,
                    alt: title,
                    type: 'image/jpeg'
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [MY_INFO.logo.src],
            creator: MY_INFO.nickname
        },
        alternates: {
            canonical: `/courses/${type}`,
            languages: {
                'vi-VN': `/courses/${type}`
            }
        },
        verification: {
            google: 'google-site-verification',
        }
    };

    return metadata;
}

interface GenerateCourseMetadataProps {
    course: {
        data: CourseDto
    };
    type: string;
}

export function generateCourseMetadata({
    course,
    type
}: GenerateCourseMetadataProps): Metadata {
    const currentYear = new Date().getFullYear();
    const publishDate = new Date(course.data.metadata.published_at).toISOString();
    const title = `${course.data.metadata.name} | Khóa Học ${type.toUpperCase()} ${currentYear} | ${MY_INFO.company}`;
    const description = `✓ ${course.data.metadata.description} ✓ Giảng viên: ${course.data.metadata.instructor_name} ✓ Thời lượng: ${course.data.metadata.duration} ✓ Trình độ: ${course.data.metadata.level} ✓ Liên hệ: ${course.data.metadata.instructor_contact} ✓ Giá gốc: ${course.data.metadata.original_price}đ ✓ Giá ưu đãi: ${course.data.metadata.discounted_price}đ`;

    const metadata: Metadata = {
        metadataBase: new URL(MY_INFO.metadataBase),
        title,
        description,
        keywords: `${course.data.metadata.name}, khóa học ${type.toLowerCase()}, ${course.data.metadata.instructor_name}, ${course.data.metadata.level}, ${MY_INFO.company}, ${MY_INFO.major}`,
        robots: 'index, follow',
        authors: [
            { name: course.data.metadata.instructor_name, url: MY_INFO.socials.facebook },
            { name: MY_INFO.name, url: MY_INFO.socials.facebook }
        ],
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/courses/${type}/${course.data.slug}`,
            siteName: MY_INFO.company,
            locale: 'vi_VN',
            publishedTime: publishDate,
            modifiedTime: new Date().toISOString(),
            images: [
                {
                    url: course.data.metadata.thumbnail,
                    width: 1200,
                    height: 630,
                    alt: course.data.metadata.name,
                    type: 'image/jpeg'
                }
            ],
            authors: [course.data.metadata.instructor_name]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [course.data.metadata.thumbnail],
            creator: MY_INFO.nickname
        },
        alternates: {
            canonical: `/courses/${type}/${course.data.slug}`,
            languages: {
                'vi-VN': `/courses/${type}/${course.data.slug}`
            }
        },
        verification: {
            google: 'google-site-verification',
        }
    };

    return metadata;
}

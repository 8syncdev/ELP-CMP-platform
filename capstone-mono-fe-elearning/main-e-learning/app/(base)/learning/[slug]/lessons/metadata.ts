import { MY_INFO } from "@/constants/my-info";
import { LessonDto } from "@/lib/actions/lesson/lesson.type";

interface GenerateMetadataOptions {
    title?: string;
    description?: string;
    image?: string;
    type?: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    keywords?: string[];
    category?: string;
    chapterName?: string;
    difficulty?: string;
    language?: string[];
    courseSlug?: string;
}

export function generateSEOMetadata({
    title,
    description,
    image,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    keywords,
    category,
    chapterName,
    difficulty,
    language,
    courseSlug,
}: GenerateMetadataOptions = {}) {
    const finalTitle = title
        ? `${title} | ${MY_INFO.company}`
        : `${MY_INFO.company} - ${MY_INFO.sologun}`;

    const finalDescription = description || MY_INFO.description;
    const finalImage = image || MY_INFO.avatar;

    // Create structured data for the lesson
    const structuredData = type === "article" ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": finalImage,
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        "author": {
            "@type": "Person",
            "name": authors?.[0] || MY_INFO.name
        },
        "publisher": {
            "@type": "Organization",
            "name": MY_INFO.company,
            "logo": {
                "@type": "ImageObject",
                "url": MY_INFO.avatar
            }
        },
        "isAccessibleForFree": "False",
        "keywords": keywords?.join(", "),
        "articleSection": category || "Education",
        "inLanguage": language?.join(", ") || "Vietnamese"
    } : null;

    return {
        metadataBase: new URL(MY_INFO.metadataBase),
        title: {
            absolute: finalTitle,
        },
        description: finalDescription,
        keywords: keywords || [],
        authors: authors?.map(author => ({ name: author })) || [{ name: MY_INFO.name }],
        openGraph: {
            title: finalTitle,
            description: finalDescription,
            url: courseSlug ? `${MY_INFO.metadataBase}/learning/${courseSlug}` : MY_INFO.metadataBase,
            siteName: MY_INFO.company,
            images: [
                {
                    url: finalImage,
                    width: 1200,
                    height: 630,
                    alt: finalTitle,
                },
            ],
            locale: "vi_VN",
            type,
            ...(type === "article" && {
                article: {
                    publishedTime,
                    modifiedTime: modifiedTime || publishedTime,
                    authors: authors?.length ? authors : [MY_INFO.name],
                    tags: keywords,
                    section: category || "Education",
                },
            }),
        },
        twitter: {
            card: "summary_large_image",
            title: finalTitle,
            description: finalDescription,
            images: [finalImage],
            creator: authors?.[0] || MY_INFO.name,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        alternates: {
            canonical: courseSlug && title ? `${MY_INFO.metadataBase}/learning/${courseSlug}/lessons?lesson=${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}` : undefined,
        },
        other: {
            "og:site_name": MY_INFO.company,
            "apple-mobile-web-app-capable": "yes",
            "apple-mobile-web-app-status-bar-style": "black-translucent",
        },
        // Add structured data as script
        ...(structuredData && {
            other: {
                "script:ld+json": JSON.stringify(structuredData),
            },
        }),
    };
}

// Hàm helper để generate metadata cho bài học
export function generateLessonMetadata(lesson: LessonDto, courseSlug?: string) {
    const { metadata } = lesson;

    return generateSEOMetadata({
        title: metadata.title,
        description: metadata.description,
        image: metadata.thumbnail,
        type: "article",
        publishedTime: metadata.publishedTime,
        modifiedTime: metadata.lastModifiedTime,
        authors: [metadata.author],
        keywords: metadata.tags,
        category: metadata.category,
        chapterName: metadata.chapter_name,
        difficulty: metadata.difficulty,
        language: metadata.language,
        courseSlug: courseSlug,
    });
}
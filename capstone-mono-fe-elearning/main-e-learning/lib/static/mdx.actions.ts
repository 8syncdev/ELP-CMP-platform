import matter from 'gray-matter'
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { devBrandImg } from '@/constants/firebase';

export type BlogMetadata = {
    title: string;
    author: string;
    description?: string;
    publishedTime?: string;
    tags?: string[];
    privilege: 'public' | 'premium' | 'vip';
    isPublished: boolean;
    imageAuthor?: string;
    thumbnail?: string;
    slug?: string;
}

export type BlogPost = {
    metadata: BlogMetadata;
    content: string;
}

/**
 * Gets markdown data for a specific blog post
 * @param filename - Name of markdown file to read
 * @returns Promise containing blog post metadata and content
 */
export async function getMarkdownData(filename: string): Promise<BlogPost> {
    const filePath = path.join(process.cwd(), 'data/blogs', filename)
    const fileContent = await readFile(filePath, 'utf-8')

    // Parse frontmatter và content
    const { data, content } = matter(fileContent)

    return {
        metadata: {
            title: data.title,
            description: data.description,
            author: data.author,
            publishedTime: data.publishedTime?.toLocaleString('vi-VN') || undefined,
            tags: data.tags,
            imageAuthor: data.imageAuthor || devBrandImg["logo"],
            thumbnail: data.thumbnail || devBrandImg["bg-01"],
            privilege: data.privilege,
            isPublished: data.isPublished
        },
        content
    }
}

/**
 * Gets list of all blog post filenames
 * @returns Promise containing array of markdown filenames
 */
export async function getAllPosts(): Promise<string[]> {
    const files = await readdir(path.join(process.cwd(), 'data/blogs'))
    return files.filter(file => file.endsWith('.md'))
}
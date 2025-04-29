import matter from 'gray-matter';

interface MDXContent<T> {
    metadata: T;
    content: string;
}

/**
 * Extracts metadata and content from MDX string using gray-matter
 * @param mdxString Raw MDX content with frontmatter
 * @returns Object containing parsed metadata and content
 * @throws Error if MDX format is invalid or parsing fails
 */
export function extractMDX<T extends Record<string, any>>(mdxString: string): MDXContent<T> {
    try {
        const { data, content } = matter(mdxString.trim());
        
        return {
            metadata: data as T,
            content: content.trim()
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to parse MDX metadata: ${error.message}`);
        }
        throw new Error('Failed to parse MDX metadata: Unknown error');
    }
}

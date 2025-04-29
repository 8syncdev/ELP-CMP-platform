const textPatterns = {
    // Matches entire code block including closing ```
    blockCode: /(^|\n)```([^`]*?)```/g
};

export function processTextContent(content: string): string {
    let processedContent = content;

    // Thêm dòng trống trước và sau toàn bộ code block
    processedContent = processedContent
        .replace(textPatterns.blockCode, '\n\n```$2```\n\n');

    return processedContent;
}

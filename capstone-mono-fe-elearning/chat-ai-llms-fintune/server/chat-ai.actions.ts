'use server';

import { streamText } from 'ai';
import { mistral } from '@ai-sdk/mistral';
import { createStreamableValue } from 'ai/rsc';
import { CHAT_POLICIES } from '@/app/chat-ai/constants/policies';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export async function continueConversation(
    history: Message[],
    policy: keyof typeof CHAT_POLICIES = 'trial',
    apiKey: string = 'AhjH8mbZ51JANWzJRbkbBsESb4rQQKmu'
) {
    'use server';
    console.log(apiKey);
    process.env.MISTRAL_API_KEY = apiKey;

    const currentPolicy = CHAT_POLICIES[policy];
    const stream = createStreamableValue();

    // Kiểm tra giới hạn tin nhắn
    const userMessages = history.filter(m => m.role === 'user').length;
    if (currentPolicy.maxMessages !== -1 && userMessages > currentPolicy.maxMessages) {
        throw new Error('Đã vượt quá giới hạn tin nhắn cho phép');
    }

    // Lọc và format lại history để AI dễ hiểu hơn
    const formattedHistory = formatHistoryForAI(history, currentPolicy.historyLimit);

    // Tạo validHistory từ formatted history
    const validHistory = formattedHistory.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    (async () => {
        const { textStream } = streamText({
            model: mistral(
                currentPolicy.responseSpeed === 'fast'
                    ? 'pixtral-12b-2409'
                    : 'pixtral-12b-2409'
            ),
            system: `Tôi là 8 Sync Dev, một chuyên gia lập trình. Trả lời theo các quy tắc sau:
- Trả lời dựa trên ${currentPolicy.historyLimit} tin nhắn gần nhất
- Đảm bảo an toàn và không gây hại
- Giới hạn trong ${currentPolicy.maxTokens} token
- Trả lời ngắn gọn, dễ hiểu, code mẫu, giải thích chi tiết, tài liệu tham khảo
- Trả lời bằng tiếng Việt`,
            messages: validHistory,
            maxTokens: currentPolicy.maxTokens,
        });

        for await (const text of textStream) {
            stream.update(text);
        }

        stream.done();
    })();

    return {
        messages: history,
        newMessage: stream.value,
    };
}

// Hàm helper để format lại history
function formatHistoryForAI(history: Message[], historyLimit: number): Message[] {
    // Lọc lấy các tin nhắn gần nhất theo historyLimit
    const recentHistory = history.slice(-historyLimit);

    // Format lại nội dung các tin nhắn
    return recentHistory.map((msg, index, array) => {
        if (msg.role === 'user') {
            // Thêm context từ câu hỏi trước đó nếu có
            const prevQuestion = array
                .slice(0, index)
                .reverse()
                .find(m => m.role === 'user');

            return {
                ...msg,
                content: formatUserMessage(msg.content, prevQuestion?.content)
            };
        }
        return msg;
    });
}

// Hàm helper để format nội dung tin nhắn người dùng
function formatUserMessage(content: string, previousQuestion?: string): string {
    let formattedContent = content;

    // Thêm context từ câu hỏi trước nếu có
    if (previousQuestion) {
        formattedContent = `Context từ câu hỏi trước: "${previousQuestion}"\n\nCâu hỏi hiện tại: "${content}"`;
    }

    // Thêm các marker để AI dễ nhận biết
    formattedContent = `[QUESTION]\n${formattedContent}\n[/QUESTION]`;

    return formattedContent;
}
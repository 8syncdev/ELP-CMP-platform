import { CHAT_POLICIES } from "@/app/chat-ai/constants/policies";

export const pricingPlans = [
    {
        id: 'trial',
        name: CHAT_POLICIES.trial.name,
        description: 'Dành cho người mới bắt đầu',
        price: 0,
        features: [
            `Giới hạn ${CHAT_POLICIES.trial.maxMessages} tin nhắn`,
            `Tối đa ${CHAT_POLICIES.trial.maxTokens} tokens mỗi tin nhắn`,
            `Lưu trữ lịch sử ${CHAT_POLICIES.trial.historyDays} ngày`,
            `Không giới hạn cuộc hội thoại`,
            'Hỗ trợ giọng nói',
            'Tốc độ phản hồi thông thường'
        ]
    },
    {
        id: 'normal',
        name: CHAT_POLICIES.normal.name,
        description: 'Dành cho người dùng phổ thông',
        price: 99000,
        features: [
            `Giới hạn ${CHAT_POLICIES.normal.maxMessages} tin nhắn`,
            `Tối đa ${CHAT_POLICIES.normal.maxTokens} tokens mỗi tin nhắn`,
            `Lưu trữ lịch sử ${CHAT_POLICIES.normal.historyDays} ngày`,
            `Không giới hạn cuộc hội thoại`,
            'Hỗ trợ giọng nói',
            'Tốc độ phản hồi thông thường'
        ]
    },
    {
        id: 'vip',
        name: CHAT_POLICIES.vip.name,
        description: 'Dành cho người dùng chuyên nghiệp',
        price: 199000,
        features: [
            'Không giới hạn tin nhắn',
            `Tối đa ${CHAT_POLICIES.vip.maxTokens} tokens mỗi tin nhắn`,
            `Lưu trữ lịch sử ${CHAT_POLICIES.vip.historyDays} ngày`,
            `Không giới hạn cuộc hội thoại`,
            'Hỗ trợ giọng nói',
            'Tốc độ phản hồi nhanh'
        ]
    }
] as const;

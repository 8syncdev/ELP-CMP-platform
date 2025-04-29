export const CHAT_POLICIES = {
    trial: {
        name: 'Dùng thử',
        maxMessages: 20,
        maxTokens: 1000,
        responseSpeed: 'normal',
        voiceEnabled: true,
        historyDays: 1,
        historyLimit: 5
    },
    normal: {
        name: 'Thông dụng',
        maxMessages: 50,
        maxTokens: 1000,
        responseSpeed: 'normal',
        voiceEnabled: true,
        historyDays: 7,
        historyLimit: 10
    },
    vip: {
        name: 'VIP',
        maxMessages: -1, // không giới hạn
        maxTokens: 2000,
        responseSpeed: 'fast',
        voiceEnabled: true,
        historyDays: 30,
        historyLimit: 10
    }
} as const; 
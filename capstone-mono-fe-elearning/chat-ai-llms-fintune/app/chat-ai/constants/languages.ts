export const LANGUAGES = {
    'vi-VN': {
        code: 'vi-VN',
        name: 'Tiếng Việt',
        placeholder: 'Nhấn để nói...',
        listening: 'Đang nghe...',
        notSupported: 'Trình duyệt không hỗ trợ nhận dạng giọng nói'
    },
    'en-US': {
        code: 'en-US',
        name: 'English',
        placeholder: 'Click to speak...',
        listening: 'Listening...',
        notSupported: 'Browser does not support speech recognition'
    },
    'ja-JP': {
        code: 'ja-JP',
        name: '日本語',
        placeholder: '話すにはクリック...',
        listening: '聞いています...',
        notSupported: 'ブラウザが音声認識をサポートしていません'
    },
    'zh-CN': {
        code: 'zh-CN',
        name: '中文',
        placeholder: '点击说话...',
        listening: '正在听...',
        notSupported: '浏览器不支持语音识别'
    }
} as const; 
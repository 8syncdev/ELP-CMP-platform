---
title: Tích Hợp Tính Năng Ra Lệnh Bằng Giọng Nói Vào Website Sử Dụng Ollama LLM Kết Hợp LangChain
description: Tích Hợp Tính Năng Ra Lệnh Bằng Giọng Nói Vào Website Sử Dụng Ollama LLM Kết Hợp LangChain
author: 8 Sync Dev
publishedTime: 2024-12-08T08:00:00Z
tags: ['AI', 'Python']
privilege: 'public'
isPublished: true
slug: tich-hop-tinh-nang-ra-lenh-bang-gioi-noi-vao-website-su-dung-ollama-llm-ket-hop-langchain
imageAuthor: https://firebasestorage.googleapis.com/v0/b/nextjs-djninex-store.appspot.com/o/dev-brand%2Flogo%2Fadmin.jpg?alt=media&token=1c99d676-4db0-42d2-a35b-b8c18b5cba80
thumbnail: https://firebasestorage.googleapis.com/v0/b/nextjs-djninex-store.appspot.com/o/dev-brand%2Flogo%2Fbg-01.png?alt=media&token=01b8f679-865d-48af-854d-8f4803b442a0
---
# Tích Hợp Tính Năng Ra Lệnh Bằng Giọng Nói Vào Website Sử Dụng Ollama LLM Kết Hợp LangChain

## 1. Giới Thiệu
Tích hợp Ollama LLM và LangChain giúp xây dựng hệ thống xử lý ngôn ngữ tự nhiên mạnh mẽ. Khi kết hợp với tính năng ra lệnh bằng giọng nói, ứng dụng có thể hiểu và phản hồi chính xác các yêu cầu của người dùng.

## 2. Các Thành Phần Chính

### a. Ollama LLM
Ollama là nền tảng cung cấp mô hình ngôn ngữ lớn (LLM) có thể được triển khai cục bộ hoặc qua API. 

### b. LangChain
LangChain là một framework mạnh mẽ để xây dựng ứng dụng sử dụng LLM, hỗ trợ xử lý các luồng hội thoại, bộ nhớ, và nhiều tính năng khác.

### c. Web Speech API
Được sử dụng ở frontend để thu âm và chuyển giọng nói thành văn bản.

### d. Giao Tiếp Frontend - Backend
Kết nối frontend và backend qua giao thức HTTP/REST để xử lý dữ liệu giọng nói.

## 3. Hướng Dẫn Từng Bước

### Bước 1: Thiết Lập Backend Với Python

#### a. Cài Đặt Thư Viện
```bash
pip install flask flask-cors langchain openai
```

#### b. Tạo Backend API Kết Hợp Ollama và LangChain

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.llms import Ollama
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

# Khởi tạo LLM từ Ollama
llm = Ollama(model_name="llama2")

# Tạo chuỗi hội thoại với LangChain
memory = ConversationBufferMemory()
conversation_chain = ConversationChain(llm=llm, memory=memory)

app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST'])
def process_voice_command():
    data = request.json
    user_input = data.get('text')

    try:
        # Xử lý đầu vào với LangChain
        response = conversation_chain.run(input=user_input)

        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
```

#### Giải Thích
- **LangChain ConversationChain**: Tạo luồng hội thoại có bộ nhớ.
- **Ollama LLM**: Xử lý văn bản đầu vào để trả về kết quả từ mô hình.
- **Flask API**: Nhận và xử lý yêu cầu từ frontend.

---

### Bước 2: Tích Hợp Frontend

#### a. HTML và JavaScript
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voice Command with Ollama & LangChain</title>
</head>
<body>
    <h1>Voice Command Interface</h1>
    <button id="start-btn">Start Listening</button>
    <p id="transcription"></p>
    <p id="response"></p>

    <script>
        const startBtn = document.getElementById('start-btn');
        const transcriptionEl = document.getElementById('transcription');
        const responseEl = document.getElementById('response');

        // Kiểm tra hỗ trợ Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Trình duyệt của bạn không hỗ trợ Web Speech API.');
        } else {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            startBtn.addEventListener('click', () => {
                recognition.start();
            });

            recognition.onresult = async (event) => {
                const transcript = event.results[0][0].transcript;
                transcriptionEl.textContent = `You said: ${transcript}`;

                // Gửi văn bản đến backend
                try {
                    const response = await fetch('http://localhost:5000/process', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: transcript }),
                    });

                    const data = await response.json();

                    if (data.response) {
                        responseEl.textContent = `LLM Response: ${data.response}`;
                    } else {
                        responseEl.textContent = `Error: ${data.error}`;
                    }
                } catch (error) {
                    responseEl.textContent = `Error: ${error.message}`;
                }
            };

            recognition.onerror = (event) => {
                alert(`Error occurred in recognition: ${event.error}`);
            };
        }
    </script>
</body>
</html>
```

#### Giải Thích
- **Web Speech API**: Nhận diện giọng nói và chuyển đổi thành văn bản.
- **Fetch API**: Gửi văn bản đến backend để xử lý.

---

### Bước 3: Chạy Ứng Dụng
1. Chạy backend bằng lệnh:
   ```bash
   python app.py
   ```
2. Mở file HTML trong trình duyệt và thử nghiệm tính năng.

---

## 4. Kết Luận
Bằng cách sử dụng Ollama LLM và LangChain, hệ thống có khả năng xử lý ngôn ngữ tự nhiên và duy trì ngữ cảnh hội thoại. Tích hợp với tính năng ra lệnh bằng giọng nói giúp nâng cao trải nghiệm người dùng.

## 5. Tài Liệu Tham Khảo
- [LangChain Documentation](https://docs.langchain.com/)
- [Ollama LLM Documentation](https://ollama.ai/docs)
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Flask Documentation](https://flask.palletsprojects.com/)
# 🌐 CMP Communication Model Protocol
## Tổng Quan Dự Án

CMP (Communication Model Protocol) là một dự án được phát triển bởi Nguyễn Phương Anh Tú, được lấy cảm hứng từ MCP (Model Context Protocol). Dự án này tạo ra một hệ thống API cho phép mô phỏng cuộc trò chuyện giữa giáo viên và sinh viên để hỗ trợ quá trình học tập.

## Kiến Trúc Hệ Thống

```mermaid
graph TD
    A[Client] --> B[FastAPI Backend]
    B --> C[Routers]
    C --> D[Actions]
    D --> E[LLM Integration]
    D --> F[Web Scraping]
    D --> G[Database]
    D --> H[Summarization]
    E --- I[Mistral AI]
    E --- J[Langchain]
    F --- K[Google Search]
    F --- L[URL Content Extraction]
    G --- M[Vector Store]
    H --- N[Text Processing]
```

## Thành Phần Chính

### 1. API Backend (FastAPI)
- **Endpoint chính**: `/cmp-actions`
- **Rate Limiting**: Hệ thống có 2 cấp độ giới hạn tốc độ: `normal` và `mcp`
- **Xử lý CORS**: Cho phép các ứng dụng web khác nhau tương tác với API

### 2. Luồng Làm Việc
1. Tìm kiếm trên Google với câu hỏi của sinh viên
2. Lấy 5 liên kết liên quan đến câu hỏi
3. Trích xuất nội dung từ các liên kết
4. Tóm tắt nội dung thành đoạn văn ngắn
5. Giáo viên xem nội dung tóm tắt và trả lời câu hỏi
6. Sinh viên đặt câu hỏi tiếp theo dựa trên câu trả lời

### 3. Các Endpoint API Chính
- **search-google**: Tìm kiếm Google với từ khóa
- **get-content-from-url**: Trích xuất nội dung từ URL
- **get-content-from-urls**: Trích xuất nội dung từ nhiều URL
- **summarize**: Tóm tắt văn bản
- **ask-teacher**: Hỏi giáo viên (với context)
- **meeting-with-teacher**: Tạo cuộc họp với giáo viên
- **student-ask-teacher**: Sinh viên hỏi giáo viên
- **extract-questions**: Trích xuất câu hỏi từ văn bản

### 4. Xử Lý Ngôn Ngữ Tự Nhiên
- Sử dụng các mô hình LLM thông qua Langchain
- Hỗ trợ cả tiếng Việt và tiếng Anh
- Trích xuất câu hỏi thông minh từ văn bản

### 5. Lưu Trữ Dữ Liệu
- Vector Store để lưu trữ và truy vấn nhanh
- Tích hợp PostgreSQL cho dữ liệu cấu trúc

### 6. Kiến Trúc Module Actions

Module Actions là trái tim của hệ thống CMP, vận hành theo mô hình kiến trúc module cấp cao với các sub-module chuyên biệt:

```mermaid
graph TD
    A[actions/__init__.py] --> B[chains]
    A --> C[ctxs]
    A --> D[db]
    A --> E[summarize]
    
    B --> B1[llms.py]
    B --> B2[templates.py]
    B --> B3[mistral_chat.py]
    B --> B4[libs.py]
    
    C --> C1[gg.py]
    
    D --> D1[vector_store.py]
    D --> D2[mistral_embeddings.py]
    
    E --> E1[summarize.py]
    E --> E2[tokenizer.py]
```

#### 6.1. Mô hình thiết kế
- **Mô hình Modular**: Phân tách rõ ràng các chức năng thành các module riêng biệt
- **Factory Pattern**: Sử dụng trong `chains/llms.py` để khởi tạo các LLM chain
- **Dependency Injection**: Truyền các dependency qua tham số hàm
- **Singleton Pattern**: Áp dụng cho các kết nối cơ sở dữ liệu và mô hình embedding

#### 6.2. Các Module Con
- **chains**: Quản lý tương tác với các mô hình LLM
  - `llms.py`: Khởi tạo và cấu hình LLM chains
  - `templates.py`: Định nghĩa các prompt template cho mô hình LLM
  - `mistral_chat.py`: Triển khai custom Mistral AI chat interface
  - `libs.py`: Cung cấp thư viện và công cụ phổ biến
  
- **ctxs**: Module xử lý ngữ cảnh và thu thập thông tin
  - `gg.py`: Tìm kiếm Google và trích xuất nội dung từ URL
  
- **db**: Quản lý lưu trữ dữ liệu
  - `vector_store.py`: Interface với Postgres Vector Store
  - `mistral_embeddings.py`: Khởi tạo và sử dụng Mistral Embeddings

- **summarize**: Module tóm tắt văn bản
  - `summarize.py`: Tóm tắt văn bản sử dụng thuật toán LSA
  - `tokenizer.py`: Tokenizer đặc biệt cho tiếng Việt

#### 6.3. Kỹ thuật xử lý lỗi và tối ưu hiệu suất
- **Retry Pattern**: Sử dụng decorator `db_retry_decorator` để tự động thử lại khi xảy ra lỗi kết nối cơ sở dữ liệu
- **Caching**: Áp dụng caching cho kết quả tìm kiếm và embedding để tối ưu hiệu suất
- **Logging**: Hệ thống logging toàn diện để theo dõi và gỡ lỗi
- **Error Handling**: Xử lý lỗi tập trung thông qua try-except và custom exception

#### 6.4. Quy trình xử lý chính trong Actions
1. **Thu thập dữ liệu**: Sử dụng `ctxs` để tìm kiếm và trích xuất thông tin
2. **Xử lý ngữ cảnh**: Chuẩn bị ngữ cảnh cho LLM sử dụng các template
3. **Xử lý văn bản**: Tóm tắt thông tin thu thập được
4. **Tạo câu trả lời**: Sử dụng LLM chain để sinh câu trả lời với ngữ cảnh
5. **Lưu trữ**: Lưu trữ dữ liệu quan trọng vào vector store cho sử dụng trong tương lai

## 🛠️ Chi tiết các Submodules

### 1. `chains/` - Chuỗi xử lý LLM
Chịu trách nhiệm xây dựng và quản lý các chuỗi xử lý cho LLM.

- **llms.py**: Tạo và cấu hình các instance của Mistral API
- **templates.py**: Định nghĩa các prompt template cho các tác vụ khác nhau
- **mistral_chat.py**: Quản lý các cuộc hội thoại với Mistral LLM
- **libs.py**: Thư viện tiện ích chung cho module chains

```python
# Ví dụ về tạo chain trong llms.py
def create_mistral_chain(
    temperature: float = 0.7, 
    max_tokens: int = 1024,
    model_name: str = "mistral-medium"
) -> BaseChatModel:
    """Tạo instance của Mistral LLM với cấu hình được chỉ định."""
    mistral_api_key = os.getenv("MISTRAL_API_KEY")
    if not mistral_api_key:
        raise ValueError("MISTRAL_API_KEY không được cấu hình")
        
    chat = ChatMistralAI(
        temperature=temperature,
        max_tokens=max_tokens,
        model_name=model_name,
        mistral_api_key=mistral_api_key
    )
    return chat
```

### 2. `ctxs/` - Xử lý ngữ cảnh
Thu thập và xử lý thông tin từ các nguồn bên ngoài để tạo ngữ cảnh cho câu trả lời.

- **gg.py**: Thực hiện tìm kiếm Google và trích xuất thông tin từ các trang web

```python
# Ví dụ về hàm tìm kiếm trong gg.py
async def search_google(query: str, num_results: int = 5) -> List[Dict]:
    """Thực hiện tìm kiếm Google và trả về kết quả dưới dạng danh sách các URL."""
    search_results = []
    try:
        async with AsyncClient(timeout=15.0) as client:
            response = await client.get(
                "https://www.googleapis.com/customsearch/v1",
                params={
                    "key": os.getenv("GOOGLE_API_KEY"),
                    "cx": os.getenv("GOOGLE_CSE_ID"),
                    "q": query,
                    "num": num_results
                }
            )
            data = response.json()
            if "items" in data:
                for item in data["items"]:
                    search_results.append({
                        "title": item.get("title", ""),
                        "link": item.get("link", ""),
                        "snippet": item.get("snippet", "")
                    })
    except Exception as e:
        logger.error(f"Lỗi khi tìm kiếm Google: {str(e)}")
    
    return search_results
```

### 3. `db/` - Lưu trữ và truy xuất vector
Quản lý cơ sở dữ liệu vector để lưu trữ và truy xuất thông tin.

- **vector_store.py**: Interface với Vector DB (ChromaDB)
- **mistral_embeddings.py**: Tạo embedding từ text sử dụng Mistral API

```python
# Ví dụ về khởi tạo vector store
def init_vector_store() -> Chroma:
    """Khởi tạo và trả về instance của ChromaDB vector store."""
    embeddings = MistralEmbeddings(
        model="mistral-embed",
        mistral_api_key=os.getenv("MISTRAL_API_KEY")
    )
    
    persist_directory = os.path.join(os.getcwd(), "data/chroma_db")
    os.makedirs(persist_directory, exist_ok=True)
    
    vector_store = Chroma(
        persist_directory=persist_directory,
        embedding_function=embeddings
    )
    
    return vector_store
```

### 4. `summarize/` - Module tóm tắt
Tóm tắt nội dung dài từ các trang web để tạo ngữ cảnh ngắn gọn.

- **summarize.py**: Thuật toán tóm tắt văn bản
- **tokenizer.py**: Xử lý và phân tách văn bản thành các token để tóm tắt

```python
# Ví dụ về hàm tóm tắt văn bản
async def summarize_content(content: str, max_tokens: int = 1000) -> str:
    """Tóm tắt nội dung dài sử dụng Mistral API."""
    if not content or len(content) < 500:
        return content
        
    # Tokenize nội dung
    tokens = tokenize_text(content)
    
    # Nếu nội dung quá dài, chia thành các phần
    if len(tokens) > 4000:
        chunks = split_into_chunks(tokens, 4000)
        summaries = []
        
        for chunk in chunks:
            chunk_text = detokenize(chunk)
            summary = await summarize_chunk(chunk_text)
            summaries.append(summary)
            
        return "\n\n".join(summaries)
    else:
        return await summarize_chunk(content)
```

## 🔧 Công nghệ sử dụng

### Ngôn ngữ & Framework
- **Python 3.10+**: Ngôn ngữ lập trình chính
- **FastAPI**: Framework API hiệu năng cao
- **Uvicorn**: ASGI server để chạy FastAPI
- **AsyncIO**: Lập trình bất đồng bộ để xử lý các tác vụ I/O-bound

### AI & ML
- **Mistral AI API**: LLM chính được sử dụng trong hệ thống
- **langchain**: Framework để xây dựng các ứng dụng AI
- **chromadb**: Vector database để lưu trữ embedding

### Xử lý dữ liệu
- **BeautifulSoup4**: Trích xuất dữ liệu từ HTML
- **httpx**: HTTP client bất đồng bộ
- **tiktoken**: Tokenizer cho OpenAI/Mistral models

### Bảo mật & Networking
- **slowapi**: Rate limiting cho API
- **python-dotenv**: Quản lý biến môi trường
- **PyJWT**: Xử lý JSON Web Tokens

## 📥 Cài đặt & Chạy

### Yêu cầu hệ thống
- Python 3.10 hoặc cao hơn
- pip (Python package manager)
- Môi trường Linux, macOS, hoặc Windows

### Cài đặt
1. Clone repository:
```bash
git clone https://github.com/your-organization/cmp-backend.git
cd cmp-backend
```

2. Tạo và kích hoạt môi trường ảo:
```bash
python -m venv venv
# Trên Windows
venv\Scripts\activate
# Trên macOS/Linux
source venv/bin/activate
```

3. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

4. Cấu hình biến môi trường:
```bash
cp .env.example .env
# Chỉnh sửa file .env để thêm các API key cần thiết
```

### Chạy server
1. Chạy server phát triển:
```bash
uvicorn app.main:app --reload --port 8000
```

2. Chạy server production:
```bash
gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 4 --bind 0.0.0.0:8000
```

### Docker Deployment
1. Build Docker image:
```bash
docker build -t cmp-backend:latest .
```

2. Chạy container:
```bash
docker run -d -p 8000:8000 --env-file .env --name cmp-backend cmp-backend:latest
```

## 🔌 API Endpoints

### 1. `/cmp-actions/chat`
- **Method**: POST
- **Mô tả**: Endpoint chính để tương tác với hệ thống CMP
- **Rate Limit**: 150 requests/phút (normal), 250 requests/phút (mcp)

**Request Body:**
```json
{
  "message": "Làm thế nào để sử dụng Python cho phân tích dữ liệu?",
  "conversation_id": "optional-conversation-id",
  "use_search": true,
  "search_depth": 5
}
```

**Response:**
```json
{
  "response": "Python có nhiều thư viện mạnh mẽ cho phân tích dữ liệu...",
  "conversation_id": "conv-123456",
  "sources": [
    {
      "title": "Python Data Analysis Tutorial",
      "url": "https://example.com/python-data-analysis",
      "snippet": "Giới thiệu về phân tích dữ liệu với Python..."
    }
  ],
  "processing_time": 2.34
}
```

### 2. `/cmp-actions/conversations`
- **Method**: GET
- **Mô tả**: Lấy danh sách các cuộc hội thoại
- **Rate Limit**: 150 requests/phút

**Response:**
```json
{
  "conversations": [
    {
      "id": "conv-123456",
      "title": "Phân tích dữ liệu Python",
      "created_at": "2023-12-01T13:45:30Z",
      "message_count": 8
    }
  ],
  "count": 1
}
```

### 3. `/cmp-actions/conversations/{conversation_id}`
- **Method**: GET
- **Mô tả**: Lấy chi tiết một cuộc hội thoại
- **Rate Limit**: 150 requests/phút

**Response:**
```json
{
  "conversation": {
    "id": "conv-123456",
    "title": "Phân tích dữ liệu Python",
    "created_at": "2023-12-01T13:45:30Z",
    "messages": [
      {
        "role": "user",
        "content": "Làm thế nào để sử dụng Python cho phân tích dữ liệu?",
        "timestamp": "2023-12-01T13:45:30Z"
      },
      {
        "role": "assistant",
        "content": "Python có nhiều thư viện mạnh mẽ cho phân tích dữ liệu...",
        "timestamp": "2023-12-01T13:45:45Z",
        "sources": [...]
      }
    ]
  }
}
```

## 📚 Tài liệu tham khảo

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Mistral AI API Documentation](https://docs.mistral.ai/)
- [LangChain Documentation](https://python.langchain.com/docs/get_started)
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [Async Python](https://docs.python.org/3/library/asyncio.html)

## 👥 Liên hệ

- **Tác giả**: Nguyễn Phương Anh Tú
- **YouTube**: [https://www.youtube.com/@Dev8Sync/featured](https://www.youtube.com/@Dev8Sync/featured)
- **Facebook**: [https://www.facebook.com/8sync](https://www.facebook.com/8sync)
- **TikTok**: [https://www.tiktok.com/@8_sync](https://www.tiktok.com/@8_sync)
- **Zalo**: [https://zalo.me/0703930513](https://zalo.me/0703930513)
- **Zalo Group**: [https://zalo.me/g/mitxdi486](https://zalo.me/g/mitxdi486)
- **Email**: 8sync.dev.1111@gmail.com
- **Website**: [https://8syncdev.com/](https://8syncdev.com/)


# 🚀 Capstone Project - E-Learning Platform

## 📑 Mục lục
- [Tổng quan dự án](#tổng-quan-dự-án)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Thành phần dự án](#thành-phần-dự-án)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Thiết lập môi trường phát triển](#thiết-lập-môi-trường-phát-triển)
- [Hướng dẫn chạy toàn bộ hệ thống](#hướng-dẫn-chạy-toàn-bộ-hệ-thống)
- [Quản lý dự án và workflow](#quản-lý-dự-án-và-workflow)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)
- [Liên hệ](#liên-hệ)

## 🌟 Tổng quan dự án

Dự án Capstone E-Learning Platform là một hệ thống học tập trực tuyến toàn diện được phát triển bởi nhóm Nguyễn Phương Anh Tú. Dự án kết hợp nhiều công nghệ hiện đại để tạo ra trải nghiệm học tập tương tác, cá nhân hóa và hiệu quả.

Hệ thống bao gồm các thành phần chính:
- **NextJS Frontend**: Giao diện người dùng hiện đại
- **Python Backend**: API và xử lý dữ liệu 
- **AI Integration**: Tích hợp mô hình ngôn ngữ lớn (LLMs)
- **Admin Dashboard**: Quản lý toàn diện hệ thống

Dự án hướng đến việc cung cấp nền tảng học tập toàn diện, tích hợp AI để hỗ trợ người học, và hệ thống quản trị linh hoạt cho đội ngũ vận hành.

## 🏗️ Kiến trúc hệ thống

```mermaid
graph TB
    User[Người dùng] --> FE[Frontend]
    Admin[Quản trị viên] --> AdminPanel[Admin Dashboard]
    
    subgraph "Frontend Layer"
        FE --> MainApp[Main E-Learning App]
        FE --> ChatAI[Chat AI LLMs]
        AdminPanel --> AdminDashboard[Admin Dashboard]
    end
    
    subgraph "Backend Layer"
        MainApp --> API[API Gateway]
        ChatAI --> API
        AdminDashboard --> API
        
        API --> CMP[CMP Service]
        API --> Encore[Encore API]
    end
    
    subgraph "Database Layer"
        CMP --> CMPDB[(Vector Database)]
        Encore --> EnDB[(PostgreSQL)]
    end
    
    subgraph "External Services"
        CMP --> MistralAI[Mistral AI]
        CMP --> GoogleSearch[Google Search]
    end
    
    style "Frontend Layer" fill:#f5f5f5,stroke:#333,stroke-width:1px
    style "Backend Layer" fill:#e1f5fe,stroke:#333,stroke-width:1px
    style "Database Layer" fill:#e8f5e9,stroke:#333,stroke-width:1px
    style "External Services" fill:#fff8e1,stroke:#333,stroke-width:1px
```

## 📦 Thành phần dự án

### Backend

#### 1. [CMP New Generation](/capstone-be-dev/cmp_new_generation/README.md)
- **Mô tả**: Communication Model Protocol - hệ thống xử lý giao tiếp với AI
- **Công nghệ**: Python, FastAPI, Langchain, Mistral AI
- **Tính năng chính**: Tìm kiếm thông tin, tóm tắt, trò chuyện AI

#### 2. [Encore Backend API](/capstone-be-dev/cp-be-encore-clean/README.md)
- **Mô tả**: Backend API chính cho E-Learning Platform
- **Công nghệ**: Python, FastAPI, SQLAlchemy, PostgreSQL
- **Tính năng chính**: Quản lý khóa học, bài học, người dùng, thanh toán

### Frontend

#### 1. [Main E-Learning](/capstone-mono-fe-elearning/main-e-learning/README.md)
- **Mô tả**: Ứng dụng chính dành cho học viên
- **Công nghệ**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Tính năng chính**: Khóa học, bài học, bài tập, thanh toán

#### 2. [Chat AI LLMs Fine-tune](/capstone-mono-fe-elearning/chat-ai-llms-fintune/README.md)
- **Mô tả**: Tích hợp trò chuyện AI để hỗ trợ học tập
- **Công nghệ**: Next.js, React, Mistral AI SDK
- **Tính năng chính**: Trò chuyện thông minh, voice-to-text, hỗ trợ đa ngôn ngữ

#### 3. [Admin E-Learning Dashboard](/capstone-mono-fe-elearning/admin-e-learning/README.md)
- **Mô tả**: Bảng điều khiển quản trị cho hệ thống
- **Công nghệ**: Next.js, React, Recharts, TanStack Table
- **Tính năng chính**: Quản lý người dùng, khóa học, nội dung, báo cáo

## 🛠️ Thiết lập môi trường phát triển

### Yêu cầu hệ thống
- Node.js 18.17+ (Frontend)
- Python 3.10+ (Backend)
- PostgreSQL 14+ (Database)
- Docker & Docker Compose (Tùy chọn)
- Git

### Cài đặt toàn bộ dự án

1. Clone repository:
```bash
git clone https://github.com/yourusername/capstone-project.git
cd capstone-project
```

2. Thiết lập Backend:
```bash
# CMP Service
cd capstone-be-dev/cmp_new_generation
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Cập nhật biến môi trường

# Encore API
cd ../cp-be-encore-clean
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Cập nhật biến môi trường
```

3. Thiết lập Frontend:
```bash
# Main E-Learning
cd ../../capstone-mono-fe-elearning/main-e-learning
npm install
cp .env.example .env.local  # Cập nhật biến môi trường

# Chat AI
cd ../chat-ai-llms-fintune
npm install
cp .env.example .env.local  # Cập nhật biến môi trường

# Admin Dashboard
cd ../admin-e-learning
npm install
cp .env.example .env.local  # Cập nhật biến môi trường
```

### Sử dụng Docker (tùy chọn)

Chúng tôi cung cấp Docker Compose để dễ dàng chạy toàn bộ hệ thống:

```bash
docker-compose up
```

Cấu hình Docker có thể tìm thấy trong file `docker-compose.yml`.

## 🚀 Hướng dẫn chạy toàn bộ hệ thống

### Chạy Backend Services

1. CMP Service:
```bash
cd capstone-be-dev/cmp_new_generation
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

2. Encore API:
```bash
cd capstone-be-dev/cp-be-encore-clean
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8001
```

### Chạy Frontend Applications

1. Main E-Learning:
```bash
cd capstone-mono-fe-elearning/main-e-learning
npm run dev
# Truy cập: http://localhost:3000
```

2. Chat AI:
```bash
cd capstone-mono-fe-elearning/chat-ai-llms-fintune
npm run dev
# Truy cập: http://localhost:3001
```

3. Admin Dashboard:
```bash
cd capstone-mono-fe-elearning/admin-e-learning
npm run dev
# Truy cập: http://localhost:3002
```

## 📋 Quản lý dự án và workflow

### Cấu trúc branch
- `main`: Branch chính, production-ready code
- `develop`: Branch phát triển chính
- `feature/*`: Các tính năng mới
- `bugfix/*`: Sửa lỗi
- `release/*`: Chuẩn bị release

### Quy trình phát triển
1. Tạo branch từ `develop` cho tính năng mới
2. Phát triển và test trên branch đó
3. Tạo Pull Request vào `develop`
4. Code review và merge
5. Periodic merge từ `develop` vào `main` cho releases

## 🤝 Đóng góp

Chúng tôi chào đón mọi đóng góp! Vui lòng làm theo các bước sau:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

Xem thêm chi tiết tại [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 Giấy phép

Dự án được phân phối dưới giấy phép MIT. Xem `LICENSE` để biết thêm thông tin.

## 📞 Liên hệ

- **Nguyễn Phương Anh Tú** - Lead Developer
- **YouTube**: [https://www.youtube.com/@Dev8Sync/featured](https://www.youtube.com/@Dev8Sync/featured)
- **Facebook**: [https://www.facebook.com/8sync](https://www.facebook.com/8sync)
- **TikTok**: [https://www.tiktok.com/@8_sync](https://www.tiktok.com/@8_sync)
- **Zalo**: [https://zalo.me/0703930513](https://zalo.me/0703930513)
- **Zalo Group**: [https://zalo.me/g/mitxdi486](https://zalo.me/g/mitxdi486)
- **Email**: 8sync.dev.1111@gmail.com
- **Website**: [https://8syncdev.com/](https://8syncdev.com/)

---

Dự án được phát triển như một phần của khóa học Capstone Project. © 2024

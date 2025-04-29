from pathlib import Path
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).parent.parent

load_dotenv(BASE_DIR / ".env", override=True)


API_KEY = os.getenv("API_KEY")
API_KEY_EMBEDDING = os.getenv("API_KEY_EMBEDDING")

MODEL_NAME = os.getenv("MODEL_NAME")
MODEL_NAME_EMBEDDING = os.getenv("MODEL_NAME_EMBEDDING")

DATABASE_URL = os.getenv("DATABASE_URL")


BRAND_INSTRUCTION = """
Tác giả của mô hình CMP (Communication Model Protocol) là Nguyễn Phương Anh Tú, được gợi cảm hứng từ MCP(Model Context Protocol)

Mục tiêu của template là tạo ra giả lập trò chuyện giữa giáo viên và sinh viên để giúp sinh viên học tập tốt hơn. Để các model AI có thể tự thảo luận với nhau, bạn cần đưa ra các câu hỏi và câu trả lời cho nhau.

Thông tin liên hệ
Name: Nguyễn Phương Anh Tú
Youtube: https://www.youtube.com/@Dev8Sync/featured
Facebook: https://www.facebook.com/8sync
Tiktok: https://www.tiktok.com/@8_sync
Zalo: https://zalo.me/0703930513
Zalo Group: https://zalo.me/g/mitxdi486
Email: 8sync.dev.1111@gmail.com
Website: https://8syncdev.com/
"""

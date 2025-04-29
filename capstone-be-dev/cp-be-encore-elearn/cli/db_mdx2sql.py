import os
import argparse
from typing import List, Dict, Any, Optional, Union, Callable
from dataclasses import dataclass
from enum import Enum
import re
import json

class ValueType(Enum):
    AUTO_INCREMENT = "auto_increment"
    FIXED = "fixed"
    FRONTMATTER = "frontmatter"

@dataclass
class FieldDefinition:
    name: str
    type: str
    value_type: ValueType = ValueType.FRONTMATTER
    required: bool = True
    default: Optional[Any] = None
    start_value: Optional[int] = None  # Cho AUTO_INCREMENT
    fixed_value: Optional[Any] = None  # Cho FIXED
    constraints: List[str] = None

    def __post_init__(self):
        if self.constraints is None:
            self.constraints = []
        
        # Kiểm tra tính hợp lệ của cấu hình
        if self.value_type == ValueType.AUTO_INCREMENT and self.start_value is None:
            self.start_value = 1
        if self.value_type == ValueType.FIXED and self.fixed_value is None:
            raise ValueError(f"Trường {self.name} được cấu hình là FIXED nhưng không có fixed_value")

def extract_frontmatter(content: str) -> Dict:
    """Trích xuất frontmatter từ nội dung MD"""
    frontmatter = {}
    
    # Tìm phần frontmatter giữa dấu ---
    match = re.search(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if match:
        yaml_content = match.group(1)
        
        # Xử lý từng dòng trong frontmatter
        for line in yaml_content.split('\n'):
            if ':' not in line:
                continue
                
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            
            # Xử lý giá trị là mảng
            if value.startswith('[') and value.endswith(']'):
                try:
                    # Parse trực tiếp nếu là JSON array
                    value = json.loads(value)
                except:
                    # Nếu không phải JSON, xử lý thủ công
                    value = [v.strip().strip("'").strip('"') for v in value[1:-1].split(',')]
            # Xử lý giá trị chuỗi có dấu nháy
            elif (value.startswith("'") and value.endswith("'")) or \
                 (value.startswith('"') and value.endswith('"')):
                value = value[1:-1]
            # Xử lý giá trị boolean
            elif value.lower() == 'true':
                value = True
            elif value.lower() == 'false':
                value = False
            
            frontmatter[key] = value
            
    return frontmatter

def get_field_value(
    field: FieldDefinition,
    index: int,
    frontmatter: Dict,
    content: str
) -> Any:
    """Lấy giá trị cho trường dựa trên cấu hình"""
    
    if field.value_type == ValueType.AUTO_INCREMENT:
        return field.start_value + index
        
    elif field.value_type == ValueType.FIXED:
        return field.fixed_value
        
    elif field.value_type == ValueType.FRONTMATTER:
        # Xử lý các trường đặc biệt
        if field.name == 'metadata':
            # Tạo metadata từ tất cả frontmatter trừ một số trường
            metadata = {k: v for k, v in frontmatter.items() 
                      if k not in ['slug', 'raw_content']}
            return json.dumps(metadata, ensure_ascii=False)
        elif field.name.endswith('_slug') or field.name == 'slug':
            return frontmatter.get(field.name, None)
        elif field.name == 'content':
            # Lấy nội dung MD không bao gồm phần metadata
            match = re.search(r'^---\s*\n.*?\n---\s*\n(.*)', content, re.DOTALL)
            if match:
                return match.group(1).strip()
            return content
        elif field.name in frontmatter:
            return frontmatter[field.name]
        elif field.default is not None:
            return field.default
        elif not field.required:
            return None
        else:
            raise ValueError(f"Thiếu giá trị cho trường bắt buộc: {field.name}")

def format_value(value: Any) -> str:
    """Format giá trị cho SQL"""
    if value is None:
        return 'NULL'
    elif isinstance(value, (int, float)):
        return str(value)
    elif isinstance(value, bool):
        return str(value).lower()
    else:
        return f"'{str(value).replace("'", "''")}'"

def get_md_files_recursive(directory: str) -> List[tuple]:
    """Quét đệ quy để lấy tất cả file MD trong thư mục và thư mục con"""
    files = []
    
    for root, dirs, filenames in os.walk(directory):
        # Lấy số thứ tự của thư mục (nếu có)
        try:
            dir_number = int(os.path.basename(root).split('_')[0])
        except (ValueError, IndexError):
            dir_number = float('inf')
            
        # Xử lý các file trong thư mục hiện tại
        for filename in filenames:
            if filename.endswith('.md'):
                try:
                    # Detect loại file
                    file_type = None
                    if filename.startswith('bai'):
                        file_type = 'bai'
                    elif filename.startswith('lesson'):
                        file_type = 'lesson'
                    
                    # Lấy số thứ tự của file
                    if file_type == 'bai':
                        # Format: bai1-a1.md
                        parts = filename.split('-')[0]
                        file_number = int(''.join(filter(str.isdigit, parts)))
                        sub_number = ord(filename.split('-')[1][0].lower()) - ord('a')
                        sub_sub_number = int(filename.split('-')[1][1])
                    else:
                        # Format thông thường: 1_abc.md
                        file_number = int(filename.split('_')[0])
                        sub_number = 0
                        sub_sub_number = 0
                except (ValueError, IndexError):
                    file_number = float('inf')
                    sub_number = float('inf') 
                    sub_sub_number = float('inf')
                    
                # Chỉ trả về 3 giá trị để tương thích với code cũ
                files.append((dir_number, file_number, os.path.join(root, filename)))
    
    # Sắp xếp theo thứ tự thư mục và số file
    files.sort(key=lambda x: (x[0], x[1]))
    return files

def check_duplicate_slugs(
    files: List[tuple], 
    schema: List[FieldDefinition],
    check_duplicates: bool = True,
    slug_fields: List[str] = None
) -> Dict[str, List[str]]:
    """
    Kiểm tra slug trùng lặp trong tất cả các file
    Args:
        files: Danh sách các file cần kiểm tra
        schema: Schema định nghĩa các trường
        check_duplicates: Bật/tắt kiểm tra trùng lặp
        slug_fields: Danh sách các trường slug cần kiểm tra. Nếu None sẽ kiểm tra tất cả trường có đuôi _slug
    Returns:
        Dict với key là slug và value là list các đường dẫn file có slug trùng
    """
    if not check_duplicates:
        return {}

    slug_map = {}  # Dict để lưu {slug: [file_paths]}
    duplicates = {}  # Dict để lưu các slug trùng lặp

    # Xác định các trường slug cần kiểm tra
    if slug_fields is None:
        slug_fields = ['slug'] + [field.name for field in schema 
                                if field.name.endswith('_slug')]

    for _, _, file_path in files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        frontmatter = extract_frontmatter(content)
        
        # Kiểm tra từng trường slug được chỉ định
        for slug_field in slug_fields:
            slug = frontmatter.get(slug_field)
            if slug is None:
                continue

            if slug in slug_map:
                # Nếu đã có slug này, thêm vào dict trùng lặp
                if slug not in duplicates:
                    duplicates[slug] = [slug_map[slug]]  # Thêm file đầu tiên
                duplicates[slug].append(file_path)
            else:
                slug_map[slug] = file_path
            
    return duplicates

def mdx2sql(
    md_dir: str = "src/app/blog/mdx",
    sql_file: str = "data.up.sql",
    table: str = "lessons",
    schema: List[FieldDefinition] = None,
    check_duplicates: bool = True,
    slug_fields: List[str] = None
) -> None:
    """Chuyển đổi tất cả file MD trong thư mục và thư mục con thành câu lệnh SQL INSERT"""
    if schema is None:
        schema = [
            FieldDefinition("id", "SERIAL", value_type=ValueType.AUTO_INCREMENT),
            FieldDefinition("slug", "TEXT", value_type=ValueType.FRONTMATTER),
            FieldDefinition("raw_content", "TEXT", value_type=ValueType.FRONTMATTER)
        ]

    # Lấy danh sách file đã được sắp xếp
    files = get_md_files_recursive(md_dir)

    # Kiểm tra slug trùng lặp nếu được yêu cầu
    duplicate_slugs = check_duplicate_slugs(files, schema, check_duplicates, slug_fields)
    if duplicate_slugs:
        error_message = "Phát hiện slug trùng lặp:\n\n"
        for slug, file_paths in duplicate_slugs.items():
            error_message += f"Slug '{slug}' xuất hiện trong các file:\n"
            for path in file_paths:
                error_message += f"  - {path}\n"
            error_message += "\n"
        raise ValueError(error_message)

    # Lọc ra các trường không phải SERIAL để thêm vào câu INSERT
    insert_fields = [field for field in schema if field.type != "SERIAL"]
    field_names = [field.name for field in insert_fields]
    
    sql_content = f"INSERT INTO {table} ({', '.join(field_names)}) VALUES\n"
    values = []

    # Xử lý từng file
    for i, (_, _, file_path) in enumerate(files):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        frontmatter = extract_frontmatter(content)
        
        # Tạo giá trị cho từng trường (bỏ qua trường SERIAL)
        field_values = []
        for field in insert_fields:
            value = get_field_value(field, i, frontmatter, content)
            field_values.append(format_value(value))

        values.append(f"(\n    {',\n    '.join(field_values)}\n)")

    sql_content += ",\n".join(values) + ";"
    
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)

def load_schema_from_json(json_file: str) -> List[FieldDefinition]:
    """Đọc schema từ file JSON"""
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Map giá trị value_type từ JSON sang enum
    value_type_map = {
        "auto_increment": "AUTO_INCREMENT",
        "fixed": "FIXED",
        "frontmatter": "FRONTMATTER"
    }
    
    schema = []
    for field in data['fields']:
        value_type_str = field['value_type'].lower()
        if value_type_str not in value_type_map:
            raise ValueError(f"Giá trị value_type không hợp lệ: {value_type_str}. Các giá trị hợp lệ: {', '.join(value_type_map.keys())}")
        
        value_type = ValueType[value_type_map[value_type_str]]
        
        schema.append(
            FieldDefinition(
                name=field['name'],
                type=field['type'],
                value_type=value_type,
                required=field.get('required', True),
                default=field.get('default'),
                start_value=field.get('start_value'),
                fixed_value=field.get('fixed_value'),
                constraints=field.get('constraints', [])
            )
        )
    return schema

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Chuyển đổi các file MD thành file SQL INSERT")
    parser.add_argument("--md-dir", default="md", help="Thư mục chứa file MD")
    parser.add_argument("--sql-file", default="data.up.sql", help="File SQL đầu ra")
    parser.add_argument("--table", default="lessons", help="Tên bảng SQL")
    parser.add_argument("--schema", help="Đường dẫn đến file schema JSON")
    parser.add_argument("--no-check-duplicates", action="store_true", 
                       help="Tắt kiểm tra slug trùng lặp")
    parser.add_argument("--slug-fields", nargs="+", 
                       help="Danh sách các trường slug cần kiểm tra (VD: lesson_slug chapter_slug)")
    
    args = parser.parse_args()

    # Nếu có file schema, sử dụng nó
    if args.schema:
        custom_schema = load_schema_from_json(args.schema)
    else:
        # Schema mặc định nếu không có file
        custom_schema = [
            FieldDefinition(
                name="id",
                type="INT",
                value_type=ValueType.AUTO_INCREMENT,
                start_value=1
            ),
            FieldDefinition(
                name="slug",
                type="TEXT",
                value_type=ValueType.FRONTMATTER,
                required=True
            ),
            FieldDefinition(
                name="raw_content",
                type="TEXT",
                value_type=ValueType.FRONTMATTER,
                required=True
            )
        ]

    mdx2sql(
        args.md_dir,
        args.sql_file,
        args.table,
        schema=custom_schema,
        check_duplicates=not args.no_check_duplicates,
        slug_fields=args.slug_fields
    )

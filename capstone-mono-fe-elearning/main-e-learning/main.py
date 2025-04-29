import os
import json
import hashlib
import random
import uuid
import platform
from pathlib import Path

# Tạo chuỗi tương tự machineId gốc (64 ký tự hex viết thường)
def generate_machine_id():
    # Tạo dữ liệu ngẫu nhiên
    data = os.urandom(32)

    # Hash dữ liệu bằng SHA256
    hash_object = hashlib.sha256()
    hash_object.update(data)

    # Trả về chuỗi hex viết thường
    return hash_object.hexdigest()

# Tạo chuỗi tương tự macMachineId gốc (64 ký tự hex viết thường)
def generate_mac_machine_id():
    return generate_machine_id()  # Sử dụng cùng định dạng

# Tạo chuỗi tương tự devDeviceId gốc (dạng UUID chuẩn)
def generate_dev_device_id():
    # Tạo UUID v4
    return str(uuid.uuid4())

# Lấy đường dẫn tới file cấu hình
def get_config_path():
    try:
        system = platform.system()
        if system == "Darwin":
            home_dir = Path.home()
            return home_dir / "Library" / "Application Support" / "Cursor" / "User" / "globalStorage" / "storage.json"
        elif system == "Windows":
            app_data = os.getenv("APPDATA")
            return Path(app_data) / "Cursor" / "User" / "globalStorage" / "storage.json"
        elif system == "Linux":
            home_dir = Path.home()
            return home_dir / ".config" / "Cursor" / "User" / "globalStorage" / "storage.json"
        else:
            raise Exception(f"Hệ điều hành không được hỗ trợ: {system}")
    except Exception as e:
        print(f"Lỗi khi lấy đường dẫn cấu hình: {e}")
        return None

# Sửa đổi quyền truy cập file
def set_file_permissions(file_path, read_only=True):
    try:
        system = platform.system()
        
        if system == "Windows":
            if read_only:
                # Đặt file là chỉ đọc
                os.system(f'powershell Start-Process cmd -ArgumentList \'/c attrib +r "{file_path}"\' -Verb RunAs')
            else:
                # Cấp full quyền và remove read-only
                os.system(f'powershell Start-Process cmd -ArgumentList \'/c attrib -r "{file_path}"\' -Verb RunAs')
                os.system(f'powershell Start-Process cmd -ArgumentList \'/c icacls "{file_path}" /grant:r "%USERNAME%":(F)\' -Verb RunAs')
        
        elif system == "Darwin":  # macOS
            if read_only:
                # Đặt quyền chỉ đọc (444)
                os.system(f'sudo chmod 444 "{file_path}"')
            else:
                # Cấp full quyền (666)
                os.system(f'sudo chmod 666 "{file_path}"')
                # Đảm bảo user hiện tại là chủ sở hữu
                os.system(f'sudo chown $(whoami):staff "{file_path}"')
        
        elif system == "Linux":
            if read_only:
                # Đặt quyền chỉ đọc (444)
                os.system(f'sudo chmod 444 "{file_path}"')
            else:
                # Cấp full quyền (666)
                os.system(f'sudo chmod 666 "{file_path}"')
                # Đảm bảo user hiện tại là chủ sở hữu
                os.system(f'sudo chown $(whoami):$(whoami) "{file_path}"')
        
        else:
            raise Exception(f"Hệ điều hành không được hỗ trợ: {system}")
            
    except Exception as e:
        print(f"Lỗi khi đặt quyền file: {e}")

# Hàm chính
def main():
    # Lấy đường dẫn file cấu hình
    config_path = get_config_path()
    if not config_path or not config_path.exists():
        print("Không thể tìm thấy file cấu hình.")
        return

    try:
        # Cấp quyền ghi trước khi thay đổi
        set_file_permissions(config_path, read_only=False)
        
        # Đọc nội dung file
        with open(config_path, "r") as f:
            content = f.read()
        
        # Phân tích JSON
        config = json.loads(content)

        # Cập nhật các trường
        config["telemetry.macMachineId"] = generate_mac_machine_id()
        config["telemetry.machineId"] = generate_machine_id()
        config["telemetry.devDeviceId"] = generate_dev_device_id()

        # Ghi lại JSON vào file
        with open(config_path, "w") as f:
            json.dump(config, f, indent=4)

        # Đặt lại quyền file thành chỉ đọc
        set_file_permissions(config_path, read_only=True)

        print("Cập nhật file cấu hình thành công. Vui lòng khởi động lại Cursor để áp dụng thay đổi.")
    except Exception as e:
        print(f"Lỗi trong quá trình xử lý: {e}")

if __name__ == "__main__":
    main()

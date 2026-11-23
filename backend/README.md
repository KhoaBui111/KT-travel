# 🧳 KT Travel API

Backend (máy chủ) cho website đặt tour du lịch **KT Travel**, xây dựng bằng **Python + Django REST Framework**.
Đây là phiên bản **MVP** (Minimum Viable Product, sản phẩm tối thiểu chạy được): CRUD cho bảng `tours`, đã **deploy lên Render** với **CI/CD tự động** bằng GitHub Actions.

> 🌐 **API đang chạy:** <https://kt-travel.onrender.com/api/tours/>
> 🔗 Frontend (React): [KhoaBui111/KT-travel](https://github.com/KhoaBui111/KT-travel) · <https://kt-travel.vercel.app>
> 📚 Đồ án môn **Phân tích thiết kế hệ thống thông tin** và **Thực tập chuyên ngành**

---

## ⚡ Dành cho Frontend: dùng API ngay, không cần cài gì

| | Giá trị |
|---|---|
| **Base URL (host)** | `https://kt-travel.onrender.com/api` |
| Base URL (khi chạy backend ở máy) | `http://127.0.0.1:8000/api` |
| Các địa chỉ FE **được phép gọi** (CORS) | `http://localhost:3000`, `https://kt-travel.vercel.app` |

1. Trong repo React, tạo file `.env` (hoặc khai báo biến môi trường trên Vercel):
   ```env
   REACT_APP_API_URL=https://kt-travel.onrender.com/api
   ```
2. Gọi API như ví dụ ở mục [Gọi API từ React](#gọi-api-từ-react-ví-dụ).
3. Xem danh sách endpoint và cấu trúc dữ liệu ở mục [Tài liệu API](#-tài-liệu-api).
4. Muốn thử tay: mở <https://kt-travel.onrender.com/api/tours/> trên trình duyệt, kéo xuống cuối trang có form để thêm tour.

> ⏳ Host dùng gói **Free**: sau 15 phút không ai gọi, server "ngủ", lần gọi đầu tiên mất khoảng **50 giây**. Trước khi demo, mở link API trước 1–2 phút.
> ⚠️ FE chạy ở **cổng khác 3000** hoặc **tên miền khác** sẽ bị trình duyệt chặn (lỗi `blocked by CORS policy`). Báo backend để thêm địa chỉ vào `CORS_ALLOWED_ORIGINS`.
> ⚠️ API **chưa có đăng nhập**: ai có link cũng thêm, sửa, xoá được. Đừng chia sẻ link công khai; dữ liệu trên host là **dùng chung** cả nhóm.

---

## 📑 Mục lục
1. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
2. [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
3. [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
4. [Cài đặt và chạy](#-cài-đặt-và-chạy)
5. [Biến môi trường](#-biến-môi-trường)
6. [Tài liệu API](#-tài-liệu-api)
7. [Kiểm thử API](#-kiểm-thử-api)
8. [Quy trình làm việc nhóm với Git](#-quy-trình-làm-việc-nhóm-với-git)
9. [Lộ trình phát triển](#-lộ-trình-phát-triển)
10. [Thành viên](#-thành-viên)

---

## 🛠 Công nghệ sử dụng

| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| Ngôn ngữ | Python | 3.11+ |
| Framework | Django (bản hỗ trợ dài hạn – LTS) | 5.2 |
| API | Django REST Framework | 3.18 |
| Cơ sở dữ liệu | SQLite (ở máy) · **PostgreSQL** (trên host) | – |
| Kết nối CSDL | dj-database-url + psycopg 3 (đọc `DATABASE_URL`) | 3.1 / 3.3 |
| Máy chủ ứng dụng | gunicorn (thay `runserver` trên host) | 27 |
| File tĩnh | WhiteNoise | 6.12 |
| CORS | django-cors-headers | 4.9 |
| Quản lý cấu hình | python-dotenv (đọc file `.env`) | – |
| Host | Render (Web Service + PostgreSQL, gói Free, Singapore) | – |
| CI/CD | GitHub Actions + Ruff (kiểm tra code) | – |
| Frontend | React 18 (repo riêng, deploy trên Vercel) | – |

---

## 🏗 Kiến trúc hệ thống

```
 [React – Frontend]  ──HTTP / JSON──►  [Django REST API – repo này]  ──ORM──►  [CSDL: bảng tours]
   localhost:3000                         localhost:8000/api/                         SQLite
   kt-travel.vercel.app                   kt-travel.onrender.com/api/                 PostgreSQL (Neon)
```

Luồng xử lý một request bên trong Django:

```
Request  →  config/urls.py (Router)  →  TourViewSet (xử lý)  →  Tour (Model, truy vấn CSDL)
                                              │
Response ←────────── TourSerializer (đổi sang JSON, kiểm tra dữ liệu) ←┘
```

| Thành phần | File | Vai trò |
|---|---|---|
| **Model** | `tours/models.py` | Mô tả bảng `tours` trong CSDL |
| **Serializer** | `tours/serializers.py` | Đổi dữ liệu ↔ JSON, kiểm tra ràng buộc (giá tối thiểu…) |
| **ViewSet** | `tours/views.py` | Xử lý 5 thao tác CRUD |
| **Router** | `config/urls.py` | Tự sinh đường dẫn `/api/tours/` |

---

## 📂 Cấu trúc thư mục

```
kt-travel-api/
├── config/                 # Cấu hình dự án
│   ├── settings.py         # Cài đặt chung (đọc bí mật từ .env)
│   └── urls.py             # Bảng đường dẫn gốc + Router API
├── tours/                  # App quản lý tour
│   ├── models.py           # Model Tour (bảng tours_tour)
│   ├── serializers.py      # TourSerializer
│   ├── views.py            # TourViewSet
│   ├── admin.py            # Cấu hình trang quản trị
│   ├── tests.py            # 7 test tự động (CRUD + CORS)
│   └── migrations/         # Lịch sử thay đổi cấu trúc CSDL
├── .github/workflows/
│   └── ci.yml              # CI/CD: test → tự deploy lên Render
├── manage.py               # Công cụ dòng lệnh của Django
├── requirements.txt        # Danh sách thư viện
├── requests.http           # Request mẫu để thử API
├── .env.example            # Mẫu biến môi trường
├── .python-version         # Phiên bản Python (3.11) cho CI và Render
├── ruff.toml               # Cấu hình công cụ kiểm tra code
└── README.md
```

---

## 🚀 Cài đặt và chạy

### Yêu cầu
- **Python 3.11** trở lên ([python.org](https://www.python.org/downloads/), nhớ tick *Add python.exe to PATH*)
- **Git**

### Các bước (Windows / PowerShell)

```powershell
# 1. Lấy code về
git clone https://github.com/hachi1401/kt-travel-api.git
cd kt-travel-api

# 2. Tạo và kích hoạt môi trường ảo
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. Cài thư viện
pip install -r requirements.txt

# 4. Tạo file cấu hình .env từ mẫu
copy .env.example .env
```

**5. Tạo khoá bí mật** rồi dán vào dòng `DJANGO_SECRET_KEY=` trong file `.env`:
```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

```powershell
# 6. Tạo bảng trong CSDL
python manage.py migrate

# 7. Tạo tài khoản quản trị
python manage.py createsuperuser

# 8. Chạy server
python manage.py runserver
```

✅ Mở trình duyệt:
- API: <http://127.0.0.1:8000/api/tours/>
- Trang quản trị: <http://127.0.0.1:8000/admin/>

> ⚠️ PowerShell báo *"running scripts is disabled"* khi kích hoạt `venv`? Chạy lệnh dưới (chỉ áp dụng cho tài khoản của bạn) rồi kích hoạt lại:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

<details>
<summary>macOS / Linux</summary>

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```
</details>

---

## 🔐 Biến môi trường

Khai báo trong file `.env` (file này **không** đưa lên GitHub, xem `.gitignore`).

| Biến | Bắt buộc | Ví dụ | Ý nghĩa |
|---|---|---|---|
| `DJANGO_SECRET_KEY` | ✅ | *(chuỗi ngẫu nhiên)* | Khoá bí mật của Django. **Mỗi máy, mỗi môi trường một khoá riêng** |
| `DJANGO_DEBUG` | | `True` | `True` khi phát triển; **`False`** khi chạy thật |
| `DJANGO_ALLOWED_HOSTS` | | `127.0.0.1,localhost` | Các tên miền được phép truy cập, cách nhau bằng dấu phẩy |
| `CORS_ALLOWED_ORIGINS` | | `http://localhost:3000,https://kt-travel.vercel.app` | Các địa chỉ Frontend được gọi API từ trình duyệt |
| `DATABASE_URL` | chỉ trên host | *(Render cấp)* | Có biến này → dùng PostgreSQL; không có → dùng SQLite. **Không** đặt ở máy |

> Trên Render, các biến được đặt trong mục **Environment** của service; `RENDER_EXTERNAL_HOSTNAME` do Render tự cấp và được tự thêm vào `ALLOWED_HOSTS`.

---

## 📖 Tài liệu API

**Đường dẫn gốc:** `https://kt-travel.onrender.com/api` (host) · `http://127.0.0.1:8000/api` (máy)
**Định dạng dữ liệu:** JSON

### Danh sách endpoint

| Phương thức | Đường dẫn | Chức năng | Mã thành công |
|---|---|---|---|
| `GET` | `/tours/` | Danh sách tour (mới nhất lên đầu) | `200 OK` |
| `POST` | `/tours/` | Thêm tour | `201 Created` |
| `GET` | `/tours/{id}/` | Xem 1 tour | `200 OK` |
| `PUT` | `/tours/{id}/` | Sửa **toàn bộ** tour (gửi đủ mọi trường) | `200 OK` |
| `PATCH` | `/tours/{id}/` | Sửa **một phần** tour | `200 OK` |
| `DELETE` | `/tours/{id}/` | Xoá tour | `204 No Content` |

### Cấu trúc dữ liệu `Tour`

| Trường | Kiểu | Bắt buộc | Ràng buộc | Ghi chú |
|---|---|---|---|---|
| `id` | số nguyên | – | tự sinh | Chỉ đọc |
| `name` | chuỗi | ✅ | tối đa 200 ký tự | Tên tour |
| `price` | số nguyên | ✅ | ≥ 100.000 | Giá người lớn, đơn vị VND |
| `duration` | chuỗi | ✅ | tối đa 50 ký tự | Ví dụ: `"4 ngày 3 đêm"` |
| `departure` | chuỗi | ✅ | tối đa 100 ký tự | Nơi khởi hành |
| `created_at` | ngày giờ (ISO 8601) | – | tự sinh | Chỉ đọc |

### Ví dụ

**Thêm tour**
```http
POST /api/tours/
Content-Type: application/json

{
  "name": "Đà Lạt – Thác Dambri – Samten Hills",
  "price": 3990000,
  "duration": "4 ngày 3 đêm",
  "departure": "TP. Hồ Chí Minh"
}
```
Phản hồi `201 Created`:
```json
{
  "id": 1,
  "name": "Đà Lạt – Thác Dambri – Samten Hills",
  "price": 3990000,
  "duration": "4 ngày 3 đêm",
  "departure": "TP. Hồ Chí Minh",
  "created_at": "2026-11-06T11:04:30.481396Z"
}
```

**Sửa giá (một phần)**
```http
PATCH /api/tours/1/
Content-Type: application/json

{ "price": 3590000 }
```

**Dữ liệu không hợp lệ** → `400 Bad Request`:
```json
{
  "name": ["This field is required."],
  "price": ["Giá tour tối thiểu là 100.000 Đ."]
}
```

**Không tìm thấy** → `404 Not Found`:
```json
{ "detail": "No Tour matches the given query." }
```

### Bảng mã trạng thái

| Mã | Ý nghĩa |
|---|---|
| `200 OK` | Thành công |
| `201 Created` | Đã tạo mới |
| `204 No Content` | Đã xoá |
| `400 Bad Request` | Dữ liệu gửi lên không hợp lệ (xem chi tiết lỗi từng trường) |
| `404 Not Found` | Không tồn tại tour với `id` này |

### Gọi API từ React (ví dụ)
```js
// src/services/tourService.js
const API_URL = process.env.REACT_APP_API_URL; // https://kt-travel.onrender.com/api

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return null;          // DELETE thành công, không có nội dung
  const data = await res.json();
  if (!res.ok) throw data;                       // 400/404: data chứa lỗi từng trường
  return data;
}

export const getTours   = ()         => request("/tours/");
export const getTour    = (id)       => request(`/tours/${id}/`);
export const createTour = (tour)     => request("/tours/", { method: "POST", body: JSON.stringify(tour) });
export const updateTour = (id, part) => request(`/tours/${id}/`, { method: "PATCH", body: JSON.stringify(part) });
export const deleteTour = (id)       => request(`/tours/${id}/`, { method: "DELETE" });
```
> 💡 Nhớ thêm dấu `/` ở cuối đường dẫn (`/tours/`, `/tours/1/`): Django bắt buộc có dấu này.

---

## 🧪 Kiểm thử API

File [`requests.http`](requests.http) có sẵn **8 request mẫu** (thêm, xem, sửa, xoá, dữ liệu sai, không tồn tại).

1. Cài extension **REST Client** trong VS Code.
2. Chạy server (`python manage.py runserver`).
3. Mở `requests.http` → bấm **Send Request** phía trên mỗi request.

Kết quả kiểm thử ngày 06/11/2026: **11/11 trường hợp đúng mã trạng thái mong đợi.**

**Test tự động** (CI cũng chạy đúng lệnh này):
```powershell
python manage.py test
```
✅ `Ran 7 tests ... OK`: danh sách, thêm, chặn giá thấp, sửa giá, xoá, CORS cho phép Vercel, CORS chặn trang lạ.

---

## 🌿 Quy trình làm việc nhóm với Git

- **`main`**: nhánh ổn định, **không code trực tiếp** trên nhánh này.
- Mỗi chức năng một nhánh: `feature/<tên-chức-năng>`, ví dụ `feature/api-bookings`.
- Xong chức năng → mở **Pull Request** vào `main` → **CI tự chạy test** → thành viên còn lại review → gộp.
- Gộp vào `main` → GitHub Actions **tự deploy lên Render** (khoảng 2 phút). **Không** bấm deploy tay trên Render.

```
push nhánh feature → Pull Request → CI: test ✅ (deploy: Skipped)
                                       → Merge vào main → CI: test ✅ → deploy ✅ → Render live
```

```powershell
git checkout main
git pull                              # luôn lấy code mới nhất trước khi làm
git checkout -b feature/ten-chuc-nang
# ... code ...
git add .
git commit -m "feat: mô tả ngắn"
git push -u origin feature/ten-chuc-nang
```

**Quy ước commit message:**

| Tiền tố | Dùng khi |
|---|---|
| `feat:` | Thêm chức năng |
| `fix:` | Sửa lỗi |
| `docs:` | Sửa tài liệu |
| `test:` | Thêm hoặc sửa test |
| `chore:` | Cấu hình, thư viện |
| `ci:` | CI/CD |

> 🔒 **Không bao giờ** commit file `.env`, mật khẩu hay khoá bí mật.

---

## 🗺 Lộ trình phát triển

- [x] CRUD bảng `tours` (Django REST Framework)
- [x] Trang quản trị Django Admin
- [x] Tách bí mật ra file `.env`, đưa code lên GitHub
- [x] Deploy lên host (Render + PostgreSQL)
- [x] CI: GitHub Actions tự kiểm tra code và chạy test
- [x] CD: tự động deploy khi gộp vào `main`
- [x] Cho phép Frontend gọi API (CORS)
- [ ] Frontend React chuyển từ dữ liệu mẫu sang gọi API thật
- [ ] Mở rộng: lịch khởi hành và số chỗ, đơn đặt tour, tài khoản và đăng nhập (JWT), thanh toán PayPal sandbox

---

## 👥 Thành viên

| Thành viên | GitHub | Phụ trách |
|---|---|---|
| Hachi | [@hachi1401](https://github.com/hachi1401) | Backend (API, cơ sở dữ liệu, triển khai) |
| Khoa | [@KhoaBui111](https://github.com/KhoaBui111) | Frontend (React) |

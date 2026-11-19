# 🧳 KT Travel – Website đặt tour du lịch

Đồ án môn **Phân tích thiết kế hệ thống thông tin** và **Thực tập chuyên ngành**.
Repo gộp chung (**monorepo**) gồm 2 phần:

| Thư mục | Nội dung | Công nghệ | Chạy trên |
|---|---|---|---|
| [`backend/`](backend/) | API quản lý tour | Python 3.11 · Django 5.2 · Django REST Framework · PostgreSQL (Neon) | Render: <https://kt-travel-api.onrender.com/api/tours/> |
| [`frontend/`](frontend/) | Giao diện khách hàng và trang quản trị | React 18 | Vercel |

```
kt-travel-api/
├── backend/            # Django REST API  → xem backend/README.md
├── frontend/           # React            → npm install && npm start
├── .github/workflows/  # CI/CD: test backend + build frontend → deploy backend lên Render
└── README.md
```

## Chạy ở máy

**Backend** (PowerShell, từ thư mục gốc repo):
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt
copy .env.example .env      # rồi điền DJANGO_SECRET_KEY
python manage.py migrate
python manage.py runserver
```

**Frontend** (cửa sổ Terminal khác):
```powershell
cd frontend
npm install
npm start
```

## Quy trình làm việc nhóm
`main` là nhánh ổn định. Mỗi chức năng một nhánh `feature/...` → Pull Request → CI chạy test backend và build frontend → merge → GitHub Actions tự deploy backend lên Render, Vercel tự deploy frontend.

## Thành viên
| Thành viên | GitHub | Phụ trách |
|---|---|---|
| Hachi | [@hachi1401](https://github.com/hachi1401) | Backend |
| Khoa | [@KhoaBui111](https://github.com/KhoaBui111) | Frontend |

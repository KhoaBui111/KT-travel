/* ============================================
   AUTH SERVICE - đăng ký / đăng nhập qua Backend API
   Backend lưu tài khoản vào bảng tai_khoan (PostgreSQL),
   mật khẩu được băm ở backend, frontend KHÔNG lưu mật khẩu.
   ============================================ */

const API_URL =
  process.env.REACT_APP_API_URL || 'https://kt-travel.onrender.com/api';

async function request(path, body) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Không kết nối được máy chủ. Kiểm tra backend đã chạy chưa.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(gopLoi(data));
  return data;
}

// Gộp lỗi DRF { email: ['...'], non_field_errors: ['...'] } thành 1 chuỗi để hiển thị
export function gopLoi(data) {
  if (!data || typeof data !== 'object') return 'Có lỗi xảy ra, vui lòng thử lại.';
  if (data.detail) return data.detail;
  const dong = Object.values(data).flat().filter((x) => typeof x === 'string');
  return dong.length ? dong.join('\n') : 'Có lỗi xảy ra, vui lòng thử lại.';
}

// Đăng ký: { email, matKhau, hoTen, soDienThoai } -> tài khoản vừa tạo
export const register = ({ email, matKhau, hoTen, soDienThoai }) =>
  request('/auth/register/', {
    email,
    mat_khau: matKhau,
    ho_ten: hoTen,
    so_dien_thoai: soDienThoai || null,
  });

// Đăng nhập: lưu token + thông tin hiển thị vào localStorage
// (giữ các key cũ isLoggedIn/userName/userRole để Header, Sidebar... chạy như trước)
export async function login(email, matKhau) {
  const { token, tai_khoan: tk } = await request('/auth/login/', {
    email,
    mat_khau: matKhau,
  });
  const role = tk.vai_tro === 'QUAN_TRI' ? 'admin' : 'user';
  localStorage.setItem('authToken', token);
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', tk.email);
  localStorage.setItem('userName', tk.ho_ten);
  localStorage.setItem('userRole', role);
  window.dispatchEvent(new Event('authChange'));
  return { ...tk, role };
}

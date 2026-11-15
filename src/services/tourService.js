/* ============================================
   TOUR SERVICE - gọi Backend API (Django REST Framework)
   Base URL lấy từ biến môi trường REACT_APP_API_URL
   ============================================ */

const API_URL =
  process.env.REACT_APP_API_URL || 'https://kt-travel-api.onrender.com/api';

// Hàm chung: gửi request, đổi kết quả sang JSON, ném lỗi nếu mã 4xx/5xx
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null; // DELETE thành công, không có nội dung

  const data = await res.json();
  if (!res.ok) throw data; // 400: { ten_truong: ['lỗi'] } · 404: { detail: '...' }
  return data;
}

export const getTours = () => request('/tours/');
export const getTour = (id) => request(`/tours/${id}/`);
export const createTour = (tour) =>
  request('/tours/', { method: 'POST', body: JSON.stringify(tour) });
export const updateTour = (id, tour) =>
  request(`/tours/${id}/`, { method: 'PATCH', body: JSON.stringify(tour) });
export const deleteTour = (id) => request(`/tours/${id}/`, { method: 'DELETE' });

// Đổi lỗi trả về từ API thành danh sách câu dễ đọc
export const errorMessages = (err) => {
  if (!err || typeof err !== 'object') return ['Không kết nối được máy chủ.'];
  if (err.detail) return [err.detail];
  return Object.entries(err).map(([field, msgs]) =>
    `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
  );
};

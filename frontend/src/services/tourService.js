/* ============================================
   TOUR SERVICE - gọi Backend API (Django REST Framework)
   Base URL lấy từ biến môi trường REACT_APP_API_URL
   ============================================ */

const API_URL =
  process.env.REACT_APP_API_URL || 'https://kt-travel.onrender.com/api';

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

/* ============================================
   DÀNH CHO TRANG KHÁCH (Trang chủ, Tìm kiếm, Chi tiết)
   API có: id, name, price, duration, departure, airline, description,
   highlights, dates (YYYY-MM-DD), gallery, image (ảnh đầu tiên).
   toPublicTour() bù các trường còn trống và đổi ngày sang dd/mm/yyyy.
   ============================================ */
export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop';

// "2026-12-20" -> "20/12/2026" (giữ nguyên nếu không đúng định dạng ISO)
export const formatDate = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
};

export const toPublicTour = (t) => {
  const image = t.image || DEFAULT_IMAGE;
  return {
    ...t,
    image,
    gallery: t.gallery?.length ? t.gallery : [image],
    airline: t.airline || 'Đang cập nhật',
    country: t.country || 'Việt Nam',
    durationDays: t.durationDays ?? (parseInt(t.duration, 10) || 0), // "5 ngày 4 đêm" -> 5
    dates: t.dates?.length ? t.dates.map(formatDate) : [],
    description: t.description || 'Lịch trình chi tiết đang được cập nhật.',
    highlights: t.highlights || [],
  };
};

export const getPublicTours = () =>
  getTours().then((list) => list.map(toPublicTour));
export const getPublicTour = (id) => getTour(id).then(toPublicTour);

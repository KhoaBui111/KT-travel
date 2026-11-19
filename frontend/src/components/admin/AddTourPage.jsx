import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../common/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload, FiX, FiPlus } from 'react-icons/fi';
import { getTour, createTour, updateTour, errorMessages, formatDate } from '../../services/tourService';
import './AddTourPage.css';

const AIRLINE_OPTIONS = ['VietJet', 'Vietnam Airlines', 'Bamboo Airways', 'Xe khách'];
const MAX_IMAGES = 10;

/**
 * Đọc file ảnh, thu nhỏ (tối đa 1280px) và nén JPEG -> data URL (base64)
 * để gửi kèm JSON lên Backend, tránh ảnh gốc quá nặng.
 */
const compressImage = (file, maxSize = 1280, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

/**
 * AddTourPage - Trang thêm / chỉnh sửa tour du lịch
 * Form nhập thông tin tour: tên, lịch trình, điểm nổi bật, hình ảnh,
 * ngày khởi hành, thời lượng, hãng/phương tiện, nơi khởi hành, giá
 * Hỗ trợ cả 2 chế độ: Tạo mới và Chỉnh sửa (isEdit / có param id)
 */
const AddTourPage = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = isEdit || Boolean(id);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    highlights: '',   // mỗi dòng 1 điểm nổi bật
    gallery: [],      // URL hoặc data URL
    dates: [],        // 'YYYY-MM-DD'
    duration: '',
    airline: '',
    departure: '',
    price: ''
  });
  const [newDate, setNewDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState([]);       // lỗi trả về từ API
  const [saving, setSaving] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);

  // Load dữ liệu tour từ API nếu ở chế độ Edit
  useEffect(() => {
    if (id) {
      getTour(id)
        .then((tour) => {
          setFormData({
            name: tour.name || '',
            description: tour.description || '',
            highlights: (tour.highlights || []).join('\n'),
            gallery: tour.gallery || [],
            dates: tour.dates || [],
            duration: tour.duration || '',
            airline: tour.airline || '',
            departure: tour.departure || '',
            price: tour.price ? String(tour.price) : ''
          });
        })
        .catch((err) => setErrors(errorMessages(err)));
    }
  }, [id]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* ---------- Ngày khởi hành ---------- */
  const handleAddDate = () => {
    if (!newDate) return;
    setFormData(prev => (
      prev.dates.includes(newDate)
        ? prev
        : { ...prev, dates: [...prev.dates, newDate].sort() }
    ));
    setNewDate('');
  };

  const handleRemoveDate = (date) => {
    setFormData(prev => ({ ...prev, dates: prev.dates.filter(d => d !== date) }));
  };

  /* ---------- Hình ảnh ---------- */
  const addImageFiles = async (fileList) => {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;
    const room = MAX_IMAGES - formData.gallery.length;
    if (room <= 0) {
      alert(`Tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }
    setProcessingImages(true);
    try {
      const images = await Promise.all(files.slice(0, room).map(f => compressImage(f)));
      setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...images].slice(0, MAX_IMAGES) }));
      if (files.length > room) alert(`Chỉ thêm được ${room} ảnh (tối đa ${MAX_IMAGES} ảnh).`);
    } catch {
      alert('Không đọc được file ảnh.');
    } finally {
      setProcessingImages(false);
    }
  };

  const handleFileChange = (e) => {
    addImageFiles(e.target.files);
    e.target.value = ''; // cho phép chọn lại cùng file
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addImageFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAddImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      alert('Link ảnh phải bắt đầu bằng http:// hoặc https://');
      return;
    }
    if (formData.gallery.length >= MAX_IMAGES) {
      alert(`Tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }
    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
    setImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  // Đặt ảnh làm ảnh đại diện (đưa lên đầu danh sách)
  const handleMakeCover = (index) => {
    setFormData(prev => {
      const gallery = [...prev.gallery];
      const [img] = gallery.splice(index, 1);
      return { ...prev, gallery: [img, ...gallery] };
    });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      price: Number(formData.price),
      duration: formData.duration,
      departure: formData.departure,
      airline: formData.airline,
      description: formData.description,
      highlights: formData.highlights.split('\n').map(s => s.trim()).filter(Boolean),
      dates: formData.dates,
      gallery: formData.gallery
    };
    setSaving(true);
    setErrors([]);
    try {
      if (isEditMode) {
        await updateTour(id, payload);
      } else {
        await createTour(payload);
      }
      alert(isEditMode ? 'Cập nhật tour thành công!' : 'Thêm tour thành công!');
      navigate('/admin/tours');
    } catch (err) {
      setErrors(errorMessages(err)); // ví dụ: price: Giá tour tối thiểu là 100.000 Đ.
    } finally {
      setSaving(false);
    }
  };

  // Xử lý hủy
  const handleCancel = () => {
    navigate('/admin/tours');
  };

  // Giữ được giá trị hãng cũ nếu không nằm trong danh sách có sẵn
  const airlineOptions = formData.airline && !AIRLINE_OPTIONS.includes(formData.airline)
    ? [formData.airline, ...AIRLINE_OPTIONS]
    : AIRLINE_OPTIONS;

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <h1 className="page-title">{isEditMode ? 'Chỉnh sửa tour du lịch' : 'Thêm tour du lịch'}</h1>

        {errors.length > 0 && (
          <div style={{ color: 'red', marginBottom: 16 }}>
            {errors.map((msg) => <p key={msg}>⚠️ {msg}</p>)}
          </div>
        )}

        <form className="add-tour-form" onSubmit={handleSubmit}>
          {/* Tên tour */}
          <div className="form-group">
            <label className="form-label">Tên tour</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên tour du lịch"
              className="form-input"
              required
            />
          </div>

          {/* Lịch trình / mô tả tour */}
          <div className="form-group">
            <label className="form-label">Lịch trình / Mô tả tour</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={'VD:\nNgày 1: Đón khách tại sân bay, nhận phòng khách sạn...\nNgày 2: Tham quan...'}
              className="form-textarea"
              rows={8}
            />
          </div>

          {/* Điểm nổi bật */}
          <div className="form-group">
            <label className="form-label">Điểm nổi bật (mỗi dòng một ý)</label>
            <textarea
              name="highlights"
              value={formData.highlights}
              onChange={handleChange}
              placeholder={'Tham quan tháp Eiffel\nDu thuyền trên sông Seine'}
              className="form-textarea"
              rows={4}
            />
          </div>

          {/* Hình ảnh */}
          <div className="form-group">
            <label className="form-label">
              Hình ảnh ({formData.gallery.length}/{MAX_IMAGES}) — ảnh đầu tiên là ảnh đại diện
            </label>

            {formData.gallery.length > 0 && (
              <div className="image-preview-grid">
                {formData.gallery.map((src, index) => (
                  <div key={index} className={`image-preview ${index === 0 ? 'is-cover' : ''}`}>
                    <img src={src} alt={`Ảnh ${index + 1}`} />
                    {index === 0 ? (
                      <span className="image-cover-badge">Ảnh đại diện</span>
                    ) : (
                      <button
                        type="button"
                        className="image-cover-btn"
                        onClick={() => handleMakeCover(index)}
                      >
                        Đặt làm đại diện
                      </button>
                    )}
                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={() => handleRemoveImage(index)}
                      title="Xoá ảnh"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className="upload-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload size={32} className="upload-icon" />
              <p className="upload-text">
                {processingImages ? 'Đang xử lý ảnh...' : 'Kéo thả hoặc click để thêm ảnh'}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            <div className="inline-add">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                placeholder="Hoặc dán link ảnh (https://...)"
                className="form-input"
              />
              <button type="button" className="btn-inline-add" onClick={handleAddImageUrl}>
                <FiPlus size={16} /> Thêm link
              </button>
            </div>
          </div>

          {/* Ngày khởi hành */}
          <div className="form-group">
            <label className="form-label">Ngày khởi hành</label>
            <div className="inline-add">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDate(); } }}
                className="form-input"
              />
              <button type="button" className="btn-inline-add" onClick={handleAddDate} disabled={!newDate}>
                <FiPlus size={16} /> Thêm ngày
              </button>
            </div>
            {formData.dates.length > 0 ? (
              <div className="date-chips">
                {formData.dates.map((date) => (
                  <span key={date} className="date-chip">
                    {formatDate(date)}
                    <button type="button" onClick={() => handleRemoveDate(date)} title="Xoá ngày">
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="field-hint">Chưa có ngày khởi hành nào.</p>
            )}
          </div>

          {/* Row 2 cột: Thời lượng + Hãng */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thời lượng</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="VD: 5 ngày 4 đêm"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hãng / Phương tiện</label>
              <select
                name="airline"
                value={formData.airline}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Chọn hãng / phương tiện</option>
                {airlineOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 cột: Nơi khởi hành + Giá */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nơi khởi hành</label>
              <input
                type="text"
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                placeholder="VD: TP. Hồ Chí Minh"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Giá</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Nhập giá tour (VND)"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Buttons: Hủy + Xác nhận / Cập nhật */}
          <div className="form-buttons">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
            <button type="submit" className="btn-confirm" disabled={saving || processingImages}>
              {saving ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddTourPage;

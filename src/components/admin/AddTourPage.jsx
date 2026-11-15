import React, { useState, useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import { getTour, createTour, updateTour, errorMessages } from '../../services/tourService';
import './AddTourPage.css';

/**
 * AddTourPage - Trang thêm / chỉnh sửa tour du lịch
 * Form nhập thông tin tour: tên, mô tả, hình ảnh, ngày, thời lượng, phương tiện, giá
 * Hỗ trợ cả 2 chế độ: Tạo mới và Chỉnh sửa (isEdit / có param id)
 */
const AddTourPage = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = isEdit || Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [],
    date: '',
    duration: '',
    transport: '',
    departure: '',
    price: ''
  });
  const [errors, setErrors] = useState([]);       // lỗi trả về từ API
  const [saving, setSaving] = useState(false);

  // Load dữ liệu tour từ API nếu ở chế độ Edit
  useEffect(() => {
    if (id) {
      getTour(id)
        .then((tour) => {
          setFormData((prev) => ({
            ...prev,
            name: tour.name || '',
            duration: tour.duration || '',
            departure: tour.departure || '',
            price: tour.price ? String(tour.price) : ''
          }));
        })
        .catch((err) => setErrors(errorMessages(err)));
    }
  }, [id]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý upload file
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));
  };

  // Xử lý kéo thả file
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setFormData(prev => ({ ...prev, images: files }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Xử lý submit form: gửi 4 trường mà Backend MVP đang lưu
  // (mô tả, hình, ngày, phương tiện chưa có trong Backend nên chưa gửi)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      price: Number(formData.price),
      duration: formData.duration,
      departure: formData.departure
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

          {/* Mô tả tour */}
          <div className="form-group">
            <label className="form-label">Mô tả tour</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chi tiết về tour"
              className="form-textarea"
              rows={5}
            />
          </div>

          {/* Upload hình ảnh */}
          <div className="form-group">
            <label className="form-label">Thêm hình</label>
            <div
              className="upload-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <FiUpload size={32} className="upload-icon" />
              <p className="upload-text">Kéo thả hoặc click để chọn ảnh</p>
              {formData.images.length > 0 && (
                <p className="upload-count">{formData.images.length} ảnh đã chọn</p>
              )}
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Row 2 cột: Ngày + Thời lượng */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ngày</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Thời lượng</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="VD: 5 ngày 4 đêm"
                className="form-input"
              />
            </div>
          </div>

          {/* Row 2 cột: Phương tiện + Giá */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phương tiện</label>
              <select
                name="transport"
                value={formData.transport}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Chọn phương tiện</option>
                <option value="VietJet">VietJet</option>
                <option value="Vietnam Airlines">Vietnam Airlines</option>
                <option value="Bamboo Airways">Bamboo Airways</option>
                <option value="Xe khách">Xe khách</option>
              </select>
            </div>
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Giá</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Nhập giá tour (VND)"
                className="form-input"
              />
            </div>
          </div>

          {/* Buttons: Hủy + Xác nhận / Cập nhật */}
          <div className="form-buttons">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
            <button type="submit" className="btn-confirm" disabled={saving}>
              {saving ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddTourPage;

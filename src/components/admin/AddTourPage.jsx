import React, { useState, useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import { tours } from '../../data/mockData';
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
    price: ''
  });

  // Load dữ liệu tour nếu ở chế độ Edit
  useEffect(() => {
    if (id) {
      const tour = tours.find(t => t.id === parseInt(id));
      if (tour) {
        // Chuyển đổi ngày từ DD/MM/YYYY sang YYYY-MM-DD cho input date
        let formattedDate = '';
        if (tour.dates && tour.dates.length > 0) {
          const parts = tour.dates[0].split('/');
          if (parts.length === 3) {
            formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }

        setFormData({
          name: tour.name || '',
          description: tour.description || '',
          images: [],
          date: formattedDate,
          duration: tour.duration || '',
          transport: tour.airline || '',
          price: tour.price ? String(tour.price) : ''
        });
      }
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

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isEditMode ? 'Update tour data:' : 'Create tour data:', formData);
    alert(isEditMode ? 'Cập nhật tour thành công!' : 'Thêm tour thành công!');
    navigate('/admin/tours');
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
            <button type="submit" className="btn-confirm">
              {isEditMode ? 'Cập nhật' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddTourPage;

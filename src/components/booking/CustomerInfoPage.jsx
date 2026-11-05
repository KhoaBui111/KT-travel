import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Stepper from '../common/Stepper';
import './CustomerInfoPage.css';

/**
 * CustomerInfoPage - Trang điền thông tin khách hàng (Bước 2)
 * Form thu thập: Họ tên, giới tính, SĐT, email, quốc tịch, phương tiện
 */
const CustomerInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingState = location.state || {};

  // State quản lý form
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Nam',
    phone: '',
    email: '',
    nationality: 'Việt Nam',
    transport: bookingState.tour?.airline || 'Vietnam Airlines'
  });

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Chuyển sang trang xác nhận kèm thông tin tour và khách hàng
    navigate('/booking/confirm', {
      state: {
        ...bookingState,
        customerInfo: formData,
        transport: formData.transport
      }
    });
  };

  // Xử lý hủy - quay lại trang trước
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="customer-info-page">
      <Header isLoggedIn={true} />
      <Stepper currentStep={2} />

      <div className="customer-info-container">
        {/* Heading */}
        <div className="customer-info-heading">
          <h2>Thông tin khách hàng</h2>
        </div>

        {/* Form điền thông tin */}
        <form className="customer-info-form" onSubmit={handleSubmit}>
          {/* Họ tên */}
          <div className="form-group">
            <label htmlFor="fullName">Họ tên</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          {/* Giới tính */}
          <div className="form-group">
            <label>Giới tính</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  checked={formData.gender === 'Nam'}
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                Nam
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  checked={formData.gender === 'Nữ'}
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                Nữ
              </label>
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
            />
          </div>

          {/* Quốc tịch */}
          <div className="form-group">
            <label htmlFor="nationality">Quốc tịch</label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Nhập quốc tịch"
            />
          </div>

          {/* Chọn phương tiện */}
          <div className="form-group">
            <label htmlFor="transport">Chọn phương tiện</label>
            <select
              id="transport"
              name="transport"
              value={formData.transport}
              onChange={handleChange}
            >
              <option value="Vietnam Airlines">Vietnam Airlines</option>
              <option value="VietJet">VietJet</option>
              <option value="Xe khách">Xe khách</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
            <button type="submit" className="btn-confirm">
              Xác nhận thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerInfoPage;

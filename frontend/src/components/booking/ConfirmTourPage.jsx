import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Header from '../common/Header';
import Stepper from '../common/Stepper';
import { formatCurrency } from '../../data/mockData';
import './ConfirmTourPage.css';

/**
 * ConfirmTourPage - Trang xác nhận thông tin tour trước khi thanh toán (Bước 3)
 * Hiển thị tóm tắt thông tin khách hàng + tour đã chọn
 */
const ConfirmTourPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingState = location.state || {};
  const tour = bookingState.tour;
  const customer = bookingState.customerInfo;

  // Dữ liệu xác nhận (lấy từ state hoặc fallback về mock data)
  const confirmData = {
    fullName: customer?.fullName || 'Hoàng Văn Tuấn',
    gender: customer?.gender || 'Nam',
    phone: customer?.phone || '0387456127',
    email: customer?.email || 'tuanh123@gmail.com',
    nationality: customer?.nationality || 'Việt Nam',
    tourName: tour?.name || 'Châu Âu (Pháp - Đức - Hà Lan - Bỉ)',
    quantity: bookingState.quantity || 1,
    transport: bookingState.transport || customer?.transport || tour?.airline || 'Vietnam Airlines',
    duration: tour?.duration || '10 ngày 9 đêm',
    price: bookingState.totalPrice || tour?.price || 70000000,
    selectedDate: bookingState.selectedDate || '11/11/2024'
  };

  // Xử lý xác nhận thanh toán
  const handleConfirmPayment = () => {
    navigate('/booking/payment', {
      state: {
        ...bookingState,
        confirmData
      }
    });
  };

  // Xử lý hủy
  const handleCancel = () => {
    navigate(-1);
  };

  // Xử lý trở về chỉnh sửa
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="confirm-tour-page">
      <Header isLoggedIn={true} />
      <Stepper currentStep={3} />

      <div className="confirm-tour-container">
        {/* Heading */}
        <div className="confirm-tour-heading">
          <h2>Thông tin tour</h2>
        </div>

        {/* Nội dung xác nhận */}
        <div className="confirm-tour-content">
          {/* Link trở về */}
          <button className="confirm-back-link" onClick={handleGoBack}>
            <FiArrowLeft size={18} />
            <span>Trở về chỉnh sửa</span>
          </button>

          {/* Bảng thông tin */}
          <div className="confirm-info-box">
            <div className="confirm-info-row">
              <span className="confirm-info-label">HVT</span>
              <span className="confirm-info-value">{confirmData.fullName}</span>
            </div>
            <div className="confirm-info-row">
              <span className="confirm-info-label">Giới tính</span>
              <span className="confirm-info-value">{confirmData.gender}</span>
            </div>
            <div className="confirm-info-row">
              <span className="confirm-info-label">SĐT</span>
              <span className="confirm-info-value">{confirmData.phone}</span>
            </div>
            <div className="confirm-info-row">
              <span className="confirm-info-label">Email</span>
              <span className="confirm-info-value">{confirmData.email}</span>
            </div>
            <div className="confirm-info-row">
              <span className="confirm-info-label">Quốc tịch</span>
              <span className="confirm-info-value">{confirmData.nationality}</span>
            </div>
            <div className="confirm-info-row">
              <span className="confirm-info-label">Tên tour</span>
              <span className="confirm-info-value">{confirmData.tourName}</span>
            </div>
            <div className="confirm-info-row">
              <span className="confirm-info-label">Số lượng vé</span>
              <span className="confirm-info-value">{confirmData.quantity}</span>
            </div>
            <div className="confirm-info-row">
              <span className="confirm-info-label">Phương tiện</span>
              <span className="confirm-info-value">{confirmData.transport}</span>
            </div>
            <div className="confirm-info-row">
              <span className="confirm-info-label">Thời lượng</span>
              <span className="confirm-info-value">{confirmData.duration}</span>
            </div>
            <div className="confirm-info-row highlight">
              <span className="confirm-info-label">Giá</span>
              <span className="confirm-info-value price">{formatCurrency(confirmData.price)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="confirm-buttons">
            <button className="btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
            <button className="btn-confirm-payment" onClick={handleConfirmPayment}>
              Xác nhận thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTourPage;

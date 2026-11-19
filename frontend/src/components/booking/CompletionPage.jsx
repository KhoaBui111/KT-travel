import React, { useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import Header from '../common/Header';
import Stepper from '../common/Stepper';
import { formatCurrency } from '../../data/mockData';
import { getStoredNotifications } from '../common/NotificationDropdown';
import './CompletionPage.css';

/**
 * CompletionPage - Trang thông báo thanh toán thành công (Bước 4)
 * Hiển thị thông tin giao dịch hoàn tất dựa trên dữ liệu booking hoặc mock
 * Tự động tạo thông báo đặt tour thành công và đẩy vào Notification Center
 */
const CompletionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingState = location.state || {};
  const tour = bookingState.tour;
  const customer = bookingState.customerInfo;
  const confirmData = bookingState.confirmData;
  const hasNotified = useRef(false);

  // Dữ liệu giao dịch thành công (sử dụng useMemo để mã GD không bị random lại khi re-render)
  const transactionData = useMemo(() => {
    const randomCode = Math.floor(100 + Math.random() * 900);
    return {
      transactionId: `GD${randomCode}`,
      customerName: customer?.fullName || confirmData?.fullName || 'Hoàng Văn Tuấn',
      bookingDate: new Date().toLocaleDateString('vi-VN'),
      tourName: tour?.name || confirmData?.tourName || 'Châu Âu (Pháp - Đức - Hà Lan - Bỉ)',
      totalAmount: bookingState.totalPrice || confirmData?.price || 70000000
    };
  }, [customer, confirmData, tour, bookingState.totalPrice]);

  // Tự động đẩy thông báo mới vào Notification Center khi giao dịch hoàn tất
  useEffect(() => {
    if (hasNotified.current) return;
    hasNotified.current = true;

    try {
      const existingNotifs = getStoredNotifications();
      const newNotif = {
        id: Date.now(),
        type: 'booking',
        title: 'Thanh toán & Đặt tour thành công!',
        content: `Đơn đặt tour "${transactionData.tourName}" đã được thanh toán thành công. Mã giao dịch: ${transactionData.transactionId}.`,
        time: 'Vừa xong',
        isRead: false,
        link: '/history'
      };

      const updated = [newNotif, ...existingNotifs];
      localStorage.setItem('userNotifications', JSON.stringify(updated));
      window.dispatchEvent(new Event('notificationChange'));
    } catch (err) {
      console.error('Lỗi khi thêm thông báo mới:', err);
    }
  }, [transactionData.tourName, transactionData.transactionId]);

  // Về trang chủ
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="completion-page">
      <Header isLoggedIn={true} />
      <Stepper currentStep={4} />

      <div className="completion-container">
        {/* Icon check xanh lớn */}
        <div className="completion-icon">
          <FiCheckCircle />
        </div>

        {/* Heading thành công */}
        <h2 className="completion-title">THANH TOÁN THÀNH CÔNG</h2>

        {/* Thông tin giao dịch */}
        <div className="completion-info-box">
          <div className="completion-info-row">
            <span className="completion-info-label">Mã giao dịch</span>
            <span className="completion-info-value">{transactionData.transactionId}</span>
          </div>
          <div className="completion-info-row">
            <span className="completion-info-label">Khách hàng</span>
            <span className="completion-info-value">{transactionData.customerName}</span>
          </div>
          <div className="completion-info-row">
            <span className="completion-info-label">Ngày đặt</span>
            <span className="completion-info-value">{transactionData.bookingDate}</span>
          </div>
          <div className="completion-info-row">
            <span className="completion-info-label">Chi tiết tour</span>
            <span className="completion-info-value">{transactionData.tourName}</span>
          </div>
          <div className="completion-info-row">
            <span className="completion-info-label">Tổng thanh toán</span>
            <span className="completion-info-value total-amount">
              {formatCurrency(transactionData.totalAmount)}
            </span>
          </div>
        </div>

        {/* Button về trang chủ */}
        <button className="btn-go-home" onClick={handleGoHome}>
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default CompletionPage;

import React from 'react';
import Sidebar from '../common/Sidebar';
import { transactions, formatCurrency } from '../../data/mockData';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './CustomerDetailPage.css';

/**
 * CustomerDetailPage - Chi tiết booking của khách hàng (admin xem)
 * Hiển thị đầy đủ thông tin cá nhân + thông tin tour đã đặt
 */
const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tìm transaction theo ticketCode hoặc id
  const booking = transactions.find(t => t.ticketCode === id || t.id === id);

  // Nếu không tìm thấy
  if (!booking) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-main">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <FiArrowLeft size={18} />
            Trở về
          </button>
          <div className="not-found-box">
            <h2>Không tìm thấy thông tin</h2>
            <p>Mã vé hoặc giao dịch không tồn tại.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <h1 className="page-title">Thông tin tour khách hàng</h1>

        {/* Link trở về */}
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FiArrowLeft size={18} />
          Trở về
        </button>

        {/* Box thông tin chi tiết */}
        <div className="customer-detail-box">
          {/* Thông tin cá nhân */}
          <div className="detail-section">
            <h3 className="detail-section-title">Thông tin cá nhân</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Họ và tên</span>
                <span className="detail-value">{booking.customerName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Giới tính</span>
                <span className="detail-value">{booking.gender}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Số điện thoại</span>
                <span className="detail-value">{booking.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{booking.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Quốc tịch</span>
                <span className="detail-value">{booking.nationality}</span>
              </div>
            </div>
          </div>

          {/* Thông tin tour */}
          <div className="detail-section">
            <h3 className="detail-section-title">Thông tin tour</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Tên tour</span>
                <span className="detail-value">{booking.flag} {booking.tourName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Số lượng vé</span>
                <span className="detail-value">{booking.quantity}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phương tiện</span>
                <span className="detail-value">{booking.transport}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Thời lượng</span>
                <span className="detail-value">{booking.duration}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Giá</span>
                <span className="detail-value detail-value--price">{formatCurrency(booking.totalPrice)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Mã vé</span>
                <span className="detail-value detail-value--code">{booking.ticketCode}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Mã giao dịch</span>
                <span className="detail-value detail-value--code">{booking.id}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDetailPage;

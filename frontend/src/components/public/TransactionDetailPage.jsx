import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import Header from '../common/Header';
import { transactions, formatCurrency } from '../../data/mockData';
import './TransactionDetailPage.css';

/**
 * TransactionDetailPage Component - Chi tiết 1 giao dịch
 * Hiển thị toàn bộ thông tin booking: khách hàng, tour, trạng thái
 */
const TransactionDetailPage = () => {
  const { id } = useParams();

  // Tìm giao dịch theo ID
  const transaction = transactions.find((t) => t.id === id);

  // Map trạng thái sang tiếng Việt và class
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { label: 'Đã hoàn thành', className: 'status-completed' };
      case 'pending':
        return { label: 'Đang xử lý', className: 'status-pending' };
      case 'cancelled':
        return { label: 'Đã hủy', className: 'status-cancelled' };
      default:
        return { label: status, className: '' };
    }
  };

  // Nếu không tìm thấy giao dịch
  if (!transaction) {
    return (
      <div className="transaction-detail-page">
        <Header isLoggedIn={true} />
        <div className="container txn-not-found">
          <h2>Không tìm thấy giao dịch</h2>
          <Link to="/history">Quay lại lịch sử giao dịch</Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(transaction.status);

  // Danh sách các field hiển thị
  const fields = [
    { label: 'Họ và tên', value: transaction.customerName },
    { label: 'Giới tính', value: transaction.gender },
    { label: 'Số điện thoại', value: transaction.phone },
    { label: 'Email', value: transaction.email },
    { label: 'Quốc tịch', value: transaction.nationality },
    { label: 'Tên tour', value: transaction.tourName },
    { label: 'Số lượng vé', value: `${transaction.quantity} vé` },
    { label: 'Phương tiện', value: transaction.transport },
    { label: 'Thời lượng', value: transaction.duration },
    { label: 'Giá', value: formatCurrency(transaction.totalPrice) },
    {
      label: 'Tình trạng',
      value: statusInfo.label,
      className: statusInfo.className,
    },
    { label: 'Mã giao dịch', value: transaction.id },
  ];

  return (
    <div className="transaction-detail-page">
      {/* Header - đã đăng nhập */}
      <Header isLoggedIn={true} />

      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/history" className="breadcrumb-link">Lịch sử giao dịch</Link>
          <FiChevronRight className="breadcrumb-sep" />
          <span className="breadcrumb-current">Chi tiết giao dịch</span>
        </nav>

        <h1 className="txn-detail-heading">Thông tin tour</h1>

        {/* Box thông tin */}
        <div className="txn-info-box">
          {fields.map((field, index) => (
            <div className="txn-field" key={index}>
              <span className="txn-field-label">{field.label}</span>
              <span className={`txn-field-value ${field.className || ''}`}>
                {field.value}
              </span>
            </div>
          ))}
        </div>

        {/* Nút quay lại */}
        <div className="txn-actions">
          <Link to="/history" className="txn-back-btn">
            ← Quay lại lịch sử
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;

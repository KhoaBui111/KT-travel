import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import Header from '../common/Header';
import { transactions, formatCurrency } from '../../data/mockData';
import './TransactionHistoryPage.css';

/**
 * TransactionHistoryPage Component - Lịch sử giao dịch
 * Hiển thị bảng danh sách các giao dịch đã đặt tour của khách hàng
 */
const TransactionHistoryPage = () => {
  const navigate = useNavigate();

  // Xem chi tiết giao dịch
  const handleViewDetail = (id) => {
    navigate(`/transaction/${id}`);
  };

  return (
    <div className="transaction-history-page">
      {/* Header - đã đăng nhập */}
      <Header isLoggedIn={true} />

      <div className="container">
        <h1 className="history-heading">Lịch sử giao dịch</h1>

        {/* Bảng giao dịch */}
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Mã vé</th>
                <th>Tên tour</th>
                <th>Giá</th>
                <th>Thời lượng</th>
                <th>Số lượng</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={txn.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                  <td className="td-ticket">{txn.ticketCode}</td>
                  <td className="td-tour">
                    <span className="tour-flag">{txn.flag}</span>
                    <span className="tour-name-text">{txn.tourName}</span>
                  </td>
                  <td className="td-price">{formatCurrency(txn.price)}</td>
                  <td>{txn.duration}</td>
                  <td className="td-quantity">{txn.quantity}</td>
                  <td>
                    <button
                      className="detail-btn"
                      onClick={() => handleViewDetail(txn.id)}
                      title="Xem chi tiết"
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Thông báo nếu không có giao dịch */}
        {transactions.length === 0 && (
          <div className="history-empty">
            <p>Bạn chưa có giao dịch nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;

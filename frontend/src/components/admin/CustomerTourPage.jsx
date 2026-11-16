import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import { transactions, formatCurrency } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { FiSearch, FiEye, FiTrash2 } from 'react-icons/fi';
import './CustomerTourPage.css';

/**
 * CustomerTourPage - Quản lý tour đã đặt của khách hàng
 * Hiển thị bảng các booking/vé với tìm kiếm, lọc
 */
const CustomerTourPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Lọc transactions theo tìm kiếm mã vé và trạng thái
  const filteredTransactions = transactions.filter(t => {
    const matchSearch = t.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tourName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchFilter;
  });

  // Xử lý xóa booking (giả lập)
  const handleDelete = (ticketCode) => {
    if (window.confirm(`Bạn có chắc muốn xóa vé ${ticketCode}?`)) {
      // TODO: Gọi API xóa
      alert(`Đã xóa vé ${ticketCode}`);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <h1 className="page-title">Quản lý Tour khách hàng</h1>

        {/* Header: Search + Filter */}
        <div className="customer-tour-header">
          <div className="customer-tour-search">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm mã vé"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            className="customer-tour-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="pending">Đang chờ</option>
          </select>
        </div>

        {/* Bảng danh sách booking */}
        <div className="customer-tour-table-wrapper">
          <table className="customer-tour-table">
            <thead>
              <tr>
                <th>Mã vé</th>
                <th>Tên tour</th>
                <th>Giá</th>
                <th>Thời lượng</th>
                <th>Số lượng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id}>
                  <td className="ticket-code">{t.ticketCode}</td>
                  <td className="tour-name-flag">
                    <span className="flag">{t.flag}</span>
                    <span>{t.tourName}</span>
                  </td>
                  <td>{formatCurrency(t.price)}</td>
                  <td>{t.duration}</td>
                  <td>{t.quantity}</td>
                  <td className="customer-actions-cell">
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(t.ticketCode)}
                    >
                      <FiTrash2 size={14} />
                      Xóa
                    </button>
                    <Link to={`/admin/customer/${t.ticketCode}`} className="btn-detail-blue">
                      <FiEye size={14} />
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CustomerTourPage;

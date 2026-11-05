import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import { tours, formatCurrency } from '../../data/mockData';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiEdit, FiEye, FiPlus } from 'react-icons/fi';
import './TourManagementPage.css';

/**
 * TourManagementPage - Trang quản lý danh sách tour
 * Hiển thị bảng tour với tìm kiếm, lọc, thêm mới
 */
const TourManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');

  // Lọc tours theo tìm kiếm và vùng miền
  const filteredTours = tours.filter(tour => {
    const matchSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterRegion === 'all' || tour.region === filterRegion;
    return matchSearch && matchFilter;
  });

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <h1 className="page-title">Quản lý Tour</h1>

        {/* Header: Search + Filter + Thêm */}
        <div className="tour-mgmt-header">
          <div className="tour-mgmt-search">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm tour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            className="tour-mgmt-filter"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="domestic">Tour trong nước</option>
            <option value="international">Tour ngoài nước</option>
          </select>
          <Link to="/admin/tours/add" className="btn-add-tour">
            <FiPlus size={16} />
            Thêm
          </Link>
        </div>

        {/* Bảng danh sách tour */}
        <div className="tour-table-wrapper">
          <table className="tour-table">
            <thead>
              <tr>
                <th>Hình</th>
                <th>Tên tour</th>
                <th>Giá</th>
                <th>Thời lượng</th>
                <th>Số lượng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.map((tour) => (
                <tr key={tour.id}>
                  <td>
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="tour-thumbnail"
                    />
                  </td>
                  <td className="tour-name-cell">{tour.name}</td>
                  <td>{formatCurrency(tour.price)}</td>
                  <td>{tour.duration}</td>
                  <td>{tour.currentBookings}/{tour.maxPeople}</td>
                  <td className="tour-actions-cell">
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}
                    >
                      <FiEdit size={14} />
                      Sửa
                    </button>
                    <Link to={`/tour/${tour.id}`} className="btn-detail">
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

export default TourManagementPage;

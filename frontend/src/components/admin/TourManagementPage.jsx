import React, { useState, useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import { formatCurrency } from '../../data/mockData';
import { getTours, deleteTour, errorMessages } from '../../services/tourService';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiEdit, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import './TourManagementPage.css';

/**
 * TourManagementPage - Trang quản lý danh sách tour
 * Hiển thị bảng tour với tìm kiếm, lọc, thêm mới
 */
const TourManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [tours, setTours] = useState([]);       // dữ liệu lấy từ API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy danh sách tour từ Backend khi mở trang
  useEffect(() => {
    getTours()
      .then(setTours)
      .catch((err) => setError(errorMessages(err).join(' ')))
      .finally(() => setLoading(false));
  }, []);

  // Xoá tour: hỏi xác nhận → gọi API → bỏ tour khỏi danh sách đang hiển thị
  const handleDelete = async (tour) => {
    if (!window.confirm(`Xoá tour "${tour.name}"?`)) return;
    try {
      await deleteTour(tour.id);
      setTours((prev) => prev.filter((t) => t.id !== tour.id));
    } catch (err) {
      alert(errorMessages(err).join('\n'));
    }
  };

  // Lọc tours theo tìm kiếm và vùng miền
  // (Backend MVP chưa có trường region: tour không có region vẫn hiện ở mọi bộ lọc)
  const filteredTours = tours.filter(tour => {
    const matchSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterRegion === 'all' || !tour.region || tour.region === filterRegion;
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

        {loading && <p>Đang tải dữ liệu... (lần đầu có thể mất khoảng 50 giây vì máy chủ đang khởi động)</p>}
        {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

        {/* Bảng danh sách tour */}
        <div className="tour-table-wrapper">
          <table className="tour-table">
            <thead>
              <tr>
                <th>Hình</th>
                <th>Tên tour</th>
                <th>Giá</th>
                <th>Thời lượng</th>
                <th>Khởi hành</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.map((tour) => (
                <tr key={tour.id}>
                  <td>
                    <img
                      src={tour.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop'}
                      alt={tour.name}
                      className="tour-thumbnail"
                    />
                  </td>
                  <td className="tour-name-cell">{tour.name}</td>
                  <td>{formatCurrency(tour.price)}</td>
                  <td>{tour.duration}</td>
                  <td>{tour.departure}</td>
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
                    <button
                      className="btn-edit"
                      style={{ background: '#dc3545' }}
                      onClick={() => handleDelete(tour)}
                    >
                      <FiTrash2 size={14} />
                      Xoá
                    </button>
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

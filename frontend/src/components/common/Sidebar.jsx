import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import logoImg from '../../assets/logo.png';
import './Sidebar.css';

/**
 * Sidebar Component - Thanh điều hướng bên trái cho Admin
 * Hiển thị logo, menu items với dot indicators
 * Tự động active menu item phù hợp với URL hiện tại (bao gồm các route con)
 * Hỗ trợ Đăng xuất an toàn cho Quản trị viên
 */
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.dispatchEvent(new Event('authChange'));
    alert('Đã đăng xuất thành công khỏi hệ thống Quản trị!');
    navigate('/', { replace: true });
  };

  const menuItems = [
    { 
      key: 'dashboard', 
      label: 'Dashboard', 
      path: '/admin/dashboard',
      isActive: currentPath === '/admin/dashboard'
    },
    { 
      key: 'accounts', 
      label: 'Quản lý Tài khoản', 
      path: '/admin/permissions',
      isActive: currentPath.startsWith('/admin/permissions')
    },
    { 
      key: 'tours', 
      label: 'Quản lý Tour', 
      path: '/admin/tours',
      isActive: currentPath.startsWith('/admin/tours')
    },
    { 
      key: 'customer-tours', 
      label: 'Quản lý Tour khách', 
      path: '/admin/customer-tours',
      isActive: currentPath.startsWith('/admin/customer-tours') || currentPath.startsWith('/admin/customer/')
    },
  ];

  return (
    <aside className="sidebar">
      {/* Header sidebar: Logo + actions */}
      <div className="sidebar-header">
        <Link to="/admin/dashboard" className="sidebar-logo">
          <img src={logoImg} alt="KT Travel" className="sidebar-logo-img" />
        </Link>
        <div className="sidebar-header-actions">
          <Link to="/" className="sidebar-icon-btn" title="Về trang chủ">
            <FiHome size={18} />
          </Link>
          <button className="sidebar-avatar-btn" title="Tài khoản Admin">
            <FaUserCircle size={28} className="sidebar-avatar-icon" />
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="sidebar-menu">
        <h3 className="sidebar-menu-title">Danh mục quản lý</h3>
        <ul className="sidebar-menu-list">
          {menuItems.map((item) => (
            <li key={item.key} className="sidebar-menu-item">
              <Link 
                to={item.path}
                className={`sidebar-menu-link ${item.isActive ? 'active' : ''}`}
              >
                <span className="sidebar-dot"></span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Phần cuối Sidebar: Nút Đăng xuất */}
      <div className="sidebar-footer">
        <button 
          type="button" 
          className="sidebar-logout-btn" 
          onClick={handleLogout}
          title="Đăng xuất khỏi hệ thống Quản trị"
        >
          <FiLogOut size={18} className="sidebar-logout-icon" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

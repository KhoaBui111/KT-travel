import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiChevronDown, FiShoppingCart, FiKey, FiLogOut, FiShield } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { tourMenuData } from '../../data/mockData';
import NotificationDropdown, { getStoredNotifications } from './NotificationDropdown';
import ChangePasswordModal from './ChangePasswordModal';
import logoImg from '../../assets/logo.png';
import './Header.css';

/**
 * Header Component - Thanh điều hướng chính
 * Quản lý trạng thái đăng nhập, menu danh mục, thanh tìm kiếm
 * Phân quyền hiển thị Menu Admin/User và gắn badge vai trò
 * Tích hợp Notification Center thông báo theo thời gian thực
 */
const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(
    isLoggedIn !== undefined ? (isLoggedIn || localStorage.getItem('isLoggedIn') === 'true') : (localStorage.getItem('isLoggedIn') === 'true')
  );
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');
  const [activeDrop, setActiveDrop] = useState(null); // 'domestic' | 'international' | 'user' | 'notifications' | null
  const [showSearch, setShowSearch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Cập nhật số thông báo chưa đọc từ localStorage
  const updateUnreadCount = () => {
    const list = getStoredNotifications();
    const count = list.filter(item => !item.isRead).length;
    setUnreadCount(count);
  };

  // Lắng nghe sự kiện authChange, storage và notificationChange để đồng bộ
  useEffect(() => {
    const updateAuth = () => {
      setLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      setUserName(localStorage.getItem('userName') || '');
      setUserRole(localStorage.getItem('userRole') || '');
    };

    updateUnreadCount();

    window.addEventListener('authChange', updateAuth);
    window.addEventListener('storage', updateAuth);
    window.addEventListener('notificationChange', updateUnreadCount);
    window.addEventListener('storage', updateUnreadCount);

    return () => {
      window.removeEventListener('authChange', updateAuth);
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('notificationChange', updateUnreadCount);
      window.removeEventListener('storage', updateUnreadCount);
    };
  }, []);

  // Cập nhật khi prop isLoggedIn thay đổi
  useEffect(() => {
    if (isLoggedIn !== undefined) {
      setLoggedIn(isLoggedIn || localStorage.getItem('isLoggedIn') === 'true');
      setUserName(localStorage.getItem('userName') || '');
      setUserRole(localStorage.getItem('userRole') || '');
    }
  }, [isLoggedIn]);

  // Toggle dropdown menu
  const toggleDropdown = (menu) => {
    setActiveDrop(activeDrop === menu ? null : menu);
  };

  // Đóng tất cả dropdown khi click ra ngoài
  const closeAll = () => {
    setActiveDrop(null);
    setShowSearch(false);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    closeAll();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.dispatchEvent(new Event('authChange'));
    setLoggedIn(false);
    setUserName('');
    setUserRole('');
    if (onLogout) onLogout();
    navigate('/', { replace: true });
  };

  // Xử lý submit tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate('/search?q=' + encodeURIComponent(searchKeyword.trim()));
    } else {
      navigate('/search');
    }
    setShowSearch(false);
    setSearchKeyword('');
  };

  return (
    <>
      {/* Overlay để đóng dropdown khi click ra ngoài */}
      {activeDrop && <div className="header-overlay" onClick={closeAll} />}
      
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="header-logo" onClick={closeAll}>
            <img src={logoImg} alt="KT Travel" className="header-logo-img" />
          </Link>

          {/* Navigation chính */}
          <nav className="header-nav">
            {/* Tour trong nước */}
            <div className="nav-item">
              <button 
                className={`nav-link ${activeDrop === 'domestic' ? 'active' : ''}`}
                onClick={() => toggleDropdown('domestic')}
              >
                Tour trong nước <FiChevronDown className="chevron-icon" />
              </button>
              {activeDrop === 'domestic' && (
                <div className="dropdown-menu">
                  {tourMenuData.domestic.regions.map((region) => (
                    <div key={region.name} className="dropdown-section">
                      <h4 className="dropdown-heading">{region.name}</h4>
                      <ul className="dropdown-list">
                        {region.destinations.map((dest) => (
                          <li key={dest}>
                            <Link 
                              to={`/search?q=${encodeURIComponent(dest)}`} 
                              className="dropdown-link" 
                              onClick={closeAll}
                            >
                              {dest}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tour ngoài nước */}
            <div className="nav-item">
              <button 
                className={`nav-link ${activeDrop === 'international' ? 'active' : ''}`}
                onClick={() => toggleDropdown('international')}
              >
                Tour ngoài nước <FiChevronDown className="chevron-icon" />
              </button>
              {activeDrop === 'international' && (
                <div className="dropdown-menu">
                  {tourMenuData.international.regions.map((region) => (
                    <div key={region.name} className="dropdown-section">
                      <h4 className="dropdown-heading">{region.name}</h4>
                      <ul className="dropdown-list">
                        {region.destinations.map((dest) => (
                          <li key={dest}>
                            <Link 
                              to={`/search?q=${encodeURIComponent(dest)}`} 
                              className="dropdown-link" 
                              onClick={closeAll}
                            >
                              {dest}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Phần bên phải */}
          <div className="header-right">
            {/* Search */}
            <button 
              className="icon-btn" 
              onClick={() => setShowSearch(!showSearch)}
              title="Tìm kiếm"
            >
              <FiSearch size={20} />
            </button>

            {loggedIn ? (
              <>
                {/* Bell notification */}
                <div className="nav-item notif-menu">
                  <button 
                    className={`icon-btn notif-btn ${activeDrop === 'notifications' ? 'active' : ''}`} 
                    onClick={() => toggleDropdown('notifications')}
                    title="Thông báo"
                    aria-label="Thông báo"
                  >
                    <FiBell size={20} />
                    {unreadCount > 0 && (
                      <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                  </button>

                  {activeDrop === 'notifications' && (
                    <NotificationDropdown onClose={closeAll} />
                  )}
                </div>

                {/* User avatar */}
                <div className="nav-item user-menu">
                  <button 
                    className="user-avatar-btn"
                    onClick={() => toggleDropdown('user')}
                    title="Tài khoản"
                  >
                    <FaUserCircle size={32} className="user-avatar-icon" />
                  </button>
                  {activeDrop === 'user' && (
                    <div className="dropdown-menu user-dropdown">
                      {/* Tên người dùng & Role Badge */}
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-name">
                          {userName || 'Người dùng'} {userRole === 'admin' && <span className="admin-badge">Admin</span>}
                        </div>
                      </div>

                      {/* Nút vào Trang Quản Trị dành riêng cho Admin */}
                      {userRole === 'admin' && (
                        <Link to="/admin/dashboard" className="dropdown-link user-link admin-nav-link" onClick={closeAll}>
                          <FiShield className="user-link-icon admin-icon" />
                          Trang Quản Trị
                        </Link>
                      )}

                      <Link to="/history" className="dropdown-link user-link" onClick={closeAll}>
                        <FiShoppingCart className="user-link-icon" />
                        Đơn đặt tour
                      </Link>
                      <button 
                        type="button"
                        className="dropdown-link user-link" 
                        onClick={() => {
                          closeAll();
                          setShowChangePassword(true);
                        }}
                      >
                        <FiKey className="user-link-icon" />
                        Đổi mật khẩu
                      </button>
                      <button 
                        type="button"
                        className="dropdown-link user-link logout-link"
                        onClick={handleLogout}
                      >
                        <FiLogOut className="user-link-icon" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-link">Đăng nhập</Link>
                <Link to="/register" className="auth-link auth-register">Đăng ký</Link>
              </>
            )}
          </div>
        </div>

        {/* Search bar (expandable) */}
        {showSearch && (
          <div className="search-bar">
            <div className="header-container">
              <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm tour du lịch... (Nhấn Enter để tìm)" 
                  className="search-input"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  autoFocus
                />
              </form>
            </div>
          </div>
        )}
        {/* Modal Popup Đổi Mật Khẩu */}
        <ChangePasswordModal 
          isOpen={showChangePassword} 
          onClose={() => setShowChangePassword(false)} 
        />
      </header>
    </>
  );
};

export default Header;

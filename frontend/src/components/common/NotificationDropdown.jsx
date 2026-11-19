import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiTag, FiMapPin, FiCheck, FiBell, FiClock, FiTrash2 } from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import './NotificationDropdown.css';

/**
 * Danh sách thông báo mặc định (Mock Notifications)
 */
export const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    type: 'booking', // 'booking' | 'promo' | 'tour'
    title: 'Đặt tour thành công!',
    content: 'Đơn đặt tour Châu Âu (Pháp - Đức - Hà Lan - Bỉ) đã được xác nhận. Mã vé: VE002.',
    time: '15 phút trước',
    isRead: false,
    link: '/history'
  },
  {
    id: 2,
    type: 'promo',
    title: 'Ưu đãi mùa lễ hội - Giảm 15%',
    content: 'Nhập mã KTTRAVEL15 để nhận ưu đãi giảm 15% cho tất cả các tour mùa thu - đông.',
    time: '2 giờ trước',
    isRead: false,
    link: '/search'
  },
  {
    id: 3,
    type: 'tour',
    title: 'Tour mới vừa mở bán!',
    content: 'Hành trình mới khám phá Đất Nước Mặt Trời Mọc: Tokyo - Núi Phú Sĩ - Kyoto 6 ngày 5 đêm.',
    time: '1 ngày trước',
    isRead: true,
    link: '/tour/2'
  }
];

/**
 * Helper lấy danh sách thông báo từ localStorage
 */
export const getStoredNotifications = () => {
  try {
    const raw = localStorage.getItem('userNotifications');
    if (!raw) {
      localStorage.setItem('userNotifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Lỗi khi đọc userNotifications từ localStorage:', err);
    return DEFAULT_NOTIFICATIONS;
  }
};

/**
 * NotificationDropdown Component - Panel hiển thị danh sách thông báo
 * Cho phép xem chi tiết, đánh dấu đã đọc, điều hướng đến trang liên quan
 */
const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Load danh sách thông báo từ localStorage
  const loadNotifications = () => {
    const data = getStoredNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();

    // Lắng nghe sự kiện khi có thông báo mới hoặc thay đổi
    const handleNotifChange = () => {
      loadNotifications();
    };

    window.addEventListener('notificationChange', handleNotifChange);
    window.addEventListener('storage', handleNotifChange);

    return () => {
      window.removeEventListener('notificationChange', handleNotifChange);
      window.removeEventListener('storage', handleNotifChange);
    };
  }, []);

  // Cập nhật lại localStorage và gửi custom event
  const saveAndNotify = (updatedList) => {
    setNotifications(updatedList);
    localStorage.setItem('userNotifications', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('notificationChange'));
  };

  // Đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    const updated = notifications.map(item => ({ ...item, isRead: true }));
    saveAndNotify(updated);
  };

  // Click vào từng thông báo -> chuyển thành đã đọc, đóng panel, navigate
  const handleItemClick = (item) => {
    if (!item.isRead) {
      const updated = notifications.map(n => 
        n.id === item.id ? { ...n, isRead: true } : n
      );
      saveAndNotify(updated);
    }

    if (onClose) onClose();

    if (item.link) {
      navigate(item.link);
    }
  };

  // Xóa tất cả thông báo
  const handleClearAll = (e) => {
    e.stopPropagation();
    saveAndNotify([]);
  };

  // Render Icon theo loại thông báo
  const renderIcon = (type) => {
    switch (type) {
      case 'booking':
        return (
          <div className="notif-icon-badge notif-icon-booking">
            <FiCheckCircle size={18} />
          </div>
        );
      case 'promo':
        return (
          <div className="notif-icon-badge notif-icon-promo">
            <FiTag size={18} />
          </div>
        );
      case 'tour':
        return (
          <div className="notif-icon-badge notif-icon-tour">
            <MdFlight size={19} />
          </div>
        );
      default:
        return (
          <div className="notif-icon-badge notif-icon-default">
            <FiMapPin size={18} />
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
      {/* Header Panel */}
      <div className="notif-dropdown-header">
        <div className="notif-header-title">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <span className="notif-unread-count-pill">{unreadCount} mới</span>
          )}
        </div>
        <div className="notif-header-actions">
          {unreadCount > 0 && (
            <button 
              className="notif-action-btn"
              onClick={handleMarkAllAsRead}
              title="Đánh dấu tất cả đã đọc"
            >
              <FiCheck className="action-icon" /> Đã đọc tất cả
            </button>
          )}
          {notifications.length > 0 && (
            <button
              className="notif-action-btn notif-clear-btn"
              onClick={handleClearAll}
              title="Xóa danh sách thông báo"
            >
              <FiTrash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Danh sách thông báo */}
      <div className="notif-list-container">
        {notifications.length === 0 ? (
          <div className="notif-empty-state">
            <div className="notif-empty-icon">
              <FiBell size={42} />
            </div>
            <p className="notif-empty-text">Bạn không có thông báo nào</p>
            <span className="notif-empty-sub">Các ưu đãi và cập nhật tour sẽ hiển thị tại đây</span>
          </div>
        ) : (
          <ul className="notif-list">
            {notifications.map((item) => (
              <li
                key={item.id}
                className={`notif-item ${!item.isRead ? 'notif-item-unread' : 'notif-item-read'}`}
                onClick={() => handleItemClick(item)}
              >
                {/* Icon loại thông báo */}
                <div className="notif-item-left">
                  {renderIcon(item.type)}
                </div>

                {/* Nội dung thông báo */}
                <div className="notif-item-center">
                  <div className="notif-item-title-row">
                    <span className="notif-item-title">{item.title}</span>
                  </div>
                  <p className="notif-item-desc">{item.content}</p>
                  <div className="notif-item-meta">
                    <FiClock className="notif-time-icon" size={12} />
                    <span className="notif-item-time">{item.time}</span>
                  </div>
                </div>

                {/* Chấm tròn chưa đọc */}
                {!item.isRead && (
                  <div className="notif-item-right">
                    <span className="notif-unread-dot" title="Chưa đọc" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Panel */}
      {notifications.length > 0 && (
        <div className="notif-dropdown-footer">
          <button 
            type="button" 
            className="notif-footer-link"
            onClick={() => {
              if (onClose) onClose();
              navigate('/history');
            }}
          >
            Xem lịch sử đơn đặt tour
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

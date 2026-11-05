import React, { useState, useEffect } from 'react';
import Sidebar from '../common/Sidebar';
import { users } from '../../data/mockData';
import { FaCrown, FaUser, FaLock, FaKey } from 'react-icons/fa';
import './PermissionPage.css';

// Danh sách email cũ mẫu cần loại bỏ hoàn toàn
const DEPRECATED_EMAILS = [
  'admin@kttravel.com',
  'binh.tran@gmail.com',
  'cuong.le@gmail.com',
  'duc.pham@gmail.com',
  'ha.hoang@gmail.com'
];

// Tài khoản Admin chính thức bắt buộc phải có
const OFFICIAL_ADMIN = {
  id: 1,
  name: 'Bùi Solo Quản Trị Viên',
  email: 'buisolodmid@gmail.com',
  password: '676767',
  phone: '0901234567',
  role: 'admin',
  status: 'active',
  avatar: null
};

// Hàm tiện ích: Đọc, dọn dẹp cache tài khoản cũ và đồng bộ danh sách hợp lệ
const getCleanUsers = () => {
  let registered = [];
  try {
    registered = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  } catch (e) {
    registered = [];
  }

  // Lọc bỏ tài khoản cũ khỏi registeredUsers nếu có
  const cleanRegistered = registered.filter(
    (u) => u.email && !DEPRECATED_EMAILS.includes(u.email.toLowerCase())
  );
  if (cleanRegistered.length !== registered.length) {
    localStorage.setItem('registeredUsers', JSON.stringify(cleanRegistered));
  }

  // Đọc managedUsers
  const saved = localStorage.getItem('managedUsers');
  let rawList = [];
  if (saved) {
    try {
      rawList = JSON.parse(saved);
    } catch (e) {
      console.error('Lỗi khi đọc managedUsers:', e);
      rawList = [...users];
    }
  } else {
    rawList = [...users];
  }

  // Lọc bỏ hoàn toàn các email nằm trong DEPRECATED_EMAILS
  let cleanList = rawList.filter(
    (u) => u.email && !DEPRECATED_EMAILS.includes(u.email.toLowerCase())
  );

  // Hợp nhất thêm các user mới từ registeredUsers (không nằm trong DEPRECATED_EMAILS)
  cleanRegistered.forEach((regUser) => {
    if (
      !cleanList.some(
        (u) => u.email && regUser.email && u.email.toLowerCase() === regUser.email.toLowerCase()
      )
    ) {
      cleanList.push(regUser);
    }
  });

  // Kiểm tra xem buisolodmid@gmail.com đã có chưa: nếu chưa có -> chèn OFFICIAL_ADMIN lên đầu danh sách
  const adminIndex = cleanList.findIndex(
    (u) => u.email && u.email.toLowerCase() === OFFICIAL_ADMIN.email.toLowerCase()
  );

  if (adminIndex === -1) {
    cleanList.unshift(OFFICIAL_ADMIN);
  } else {
    // Đảm bảo tài khoản buisolodmid@gmail.com luôn có role: 'admin', status: 'active' và luôn đứng đầu danh sách
    const adminUser = {
      ...cleanList[adminIndex],
      role: 'admin',
      status: 'active'
    };
    if (adminIndex > 0) {
      cleanList.splice(adminIndex, 1);
      cleanList.unshift(adminUser);
    } else {
      cleanList[0] = adminUser;
    }
  }

  // Ghi đè danh sách sạch này vào localStorage
  localStorage.setItem('managedUsers', JSON.stringify(cleanList));
  return cleanList;
};

/**
 * PermissionPage - Trang phân quyền người dùng
 * Hiển thị bảng user với vai trò, trạng thái và các nút phân quyền
 * Đồng bộ với localStorage: managedUsers & registeredUsers
 */
const PermissionPage = () => {
  const [userList, setUserList] = useState(getCleanUsers);

  // Dọn dẹp cache và cập nhật danh sách khi component mount
  useEffect(() => {
    const cleaned = getCleanUsers();
    setUserList(cleaned);
  }, []);

  // Lưu danh sách người dùng vào cả managedUsers và registeredUsers
  const saveUsers = (updated) => {
    setUserList(updated);
    localStorage.setItem('managedUsers', JSON.stringify(updated));

    // Đồng thời đồng bộ cập nhật vào registeredUsers (nếu tài khoản nằm trong registeredUsers)
    try {
      const registered = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedRegistered = registered.map((regUser) => {
        const found = updated.find(
          (u) => u.email && regUser.email && u.email.toLowerCase() === regUser.email.toLowerCase()
        );
        return found ? { ...regUser, role: found.role, status: found.status } : regUser;
      });
      localStorage.setItem('registeredUsers', JSON.stringify(updatedRegistered));
    } catch (e) {
      console.error('Lỗi khi đồng bộ registeredUsers:', e);
    }
  };

  // Làm mới và dọn sạch dữ liệu tài khoản cũ
  const handleResetData = () => {
    try {
      const registered = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const cleanRegistered = registered.filter(
        (u) =>
          u.email &&
          !DEPRECATED_EMAILS.includes(u.email.toLowerCase()) &&
          u.email.toLowerCase() !== OFFICIAL_ADMIN.email.toLowerCase()
      );
      localStorage.setItem('registeredUsers', JSON.stringify(cleanRegistered));

      const resetList = [OFFICIAL_ADMIN, ...cleanRegistered];
      setUserList(resetList);
      localStorage.setItem('managedUsers', JSON.stringify(resetList));
      alert('Đã làm mới danh sách tài khoản thành công! Các tài khoản mẫu cũ đã được loại bỏ hoàn toàn.');
    } catch (e) {
      console.error('Lỗi khi làm mới dữ liệu:', e);
      alert('Có lỗi xảy ra khi làm mới danh sách tài khoản.');
    }
  };

  // Xử lý nâng/hạ quyền
  const handleToggleRole = (userId, currentRole) => {
    const action = currentRole === 'admin' ? 'hạ quyền' : 'nâng quyền';
    if (window.confirm(`Bạn có chắc muốn ${action} người dùng này?`)) {
      const nextRole = currentRole === 'admin' ? 'user' : 'admin';
      const updated = userList.map((u) =>
        u.id === userId ? { ...u, role: nextRole } : u
      );
      saveUsers(updated);
    }
  };

  // Xử lý khóa / mở khóa tài khoản
  const handleToggleLock = (userId, currentStatus) => {
    const action = currentStatus === 'active' ? 'khóa' : 'mở khóa';
    if (window.confirm(`Bạn có chắc muốn ${action} tài khoản này?`)) {
      const nextStatus = currentStatus === 'active' ? 'locked' : 'active';
      const updated = userList.map((u) =>
        u.id === userId ? { ...u, status: nextStatus } : u
      );
      saveUsers(updated);
    }
  };

  // Xử lý đổi mật khẩu (giả lập)
  const handleChangePassword = (userId) => {
    alert(`Đã gửi yêu cầu đổi mật khẩu cho user ID: ${userId}`);
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        {/* Tiêu đề & Nút bấm tiện ích làm mới */}
        <div className="permission-header-row">
          <h2 className="admin-page-title">Quản lý Tài khoản</h2>
          <button
            className="reset-users-btn"
            onClick={handleResetData}
            title="Dọn dẹp tài khoản cũ và đưa về mặc định"
          >
            🔄 Làm mới danh sách tài khoản
          </button>
        </div>

        {/* Bảng quản lý tài khoản */}
        <div className="permission-table-wrapper">
          <table className="permission-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Phân quyền</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id}>
                  <td className="user-email">{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                      {user.role === 'admin' ? (
                        <><FaCrown size={12} /> Admin</>
                      ) : (
                        <><FaUser size={12} /> User</>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status === 'active' ? 'status-active' : 'status-locked'}`}>
                      {user.status === 'active' ? (
                        <><span className="status-dot active-dot"></span> Hoạt động</>
                      ) : (
                        <><FaLock size={11} /> Bị khóa</>
                      )}
                    </span>
                  </td>
                  <td className="permission-actions">
                    {/* Nâng/Hạ quyền */}
                    <button
                      className={`btn-perm ${user.role === 'admin' ? 'btn-demote' : 'btn-promote'}`}
                      onClick={() => handleToggleRole(user.id, user.role)}
                      title={user.role === 'admin' ? 'Hạ quyền' : 'Nâng quyền'}
                    >
                      {user.role === 'admin' ? 'Hạ quyền ↓' : 'Nâng quyền ↑'}
                    </button>

                    {/* Khóa/Mở khóa */}
                    <button
                      className="btn-perm btn-lock"
                      onClick={() => handleToggleLock(user.id, user.status)}
                      title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                    >
                      {user.status === 'active' ? 'Khóa 🔒' : 'Mở khóa 🔓'}
                    </button>

                    {/* Đổi mật khẩu */}
                    <button
                      className="btn-perm btn-password"
                      onClick={() => handleChangePassword(user.id)}
                      title="Đổi mật khẩu"
                    >
                      Đổi pass 🔑
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

export default PermissionPage;

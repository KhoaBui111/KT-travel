import React, { useState, useEffect } from 'react';
import { FiX, FiEye, FiEyeOff, FiLock, FiCheckCircle } from 'react-icons/fi';
import { users } from '../../data/mockData';
import './ChangePasswordModal.css';

/**
 * ChangePasswordModal - Modal popup đổi mật khẩu cho người dùng và admin
 * Hỗ trợ xác thực mật khẩu hiện tại, kiểm tra tính hợp lệ và lưu vào localStorage
 */
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset form khi đóng/mở modal
  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Xử lý xác thực và cập nhật mật khẩu
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const userEmail = (localStorage.getItem('userEmail') || '').trim().toLowerCase();

    if (!userEmail) {
      setError('Không tìm thấy thông tin phiên đăng nhập. Vui lòng đăng nhập lại!');
      return;
    }

    // 1. Kiểm tra các trường không được để trống
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Vui lòng nhập đầy đủ tất cả các trường thông tin!');
      return;
    }

    // 2. Kiểm tra độ dài mật khẩu mới tối thiểu 6 ký tự
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có tối thiểu 6 ký tự!');
      return;
    }

    // 3. Kiểm tra mật khẩu mới không được trùng mật khẩu cũ
    if (newPassword === currentPassword) {
      setError('Mật khẩu mới không được trùng với mật khẩu hiện tại!');
      return;
    }

    // 4. Kiểm tra mật khẩu mới và xác nhận mật khẩu mới phải khớp nhau
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    // 5. Kiểm tra mật khẩu hiện tại
    let validCurrentPassword = null;

    if (userEmail === 'buisolodmid@gmail.com') {
      // Đối với tài khoản Admin chính thức
      const managedUsers = JSON.parse(localStorage.getItem('managedUsers') || 'null');
      const managedAdmin = (managedUsers || []).find(
        (u) => u.email?.toLowerCase() === 'buisolodmid@gmail.com'
      );
      validCurrentPassword = managedAdmin?.password || '676767';
    } else {
      // Đối với tài khoản người dùng thông thường
      const rawManaged = JSON.parse(localStorage.getItem('managedUsers') || 'null');
      const rawRegistered = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const allUsers = [
        ...(rawManaged || users),
        ...rawRegistered.filter(
          (r) => !(rawManaged || users).some((b) => b.email?.toLowerCase() === r.email?.toLowerCase())
        )
      ];

      const currentUser = allUsers.find(
        (u) => u.email && u.email.toLowerCase() === userEmail
      );

      if (currentUser) {
        validCurrentPassword = currentUser.password;
      }
    }

    // So khớp mật khẩu hiện tại
    if (validCurrentPassword !== null && currentPassword !== validCurrentPassword) {
      setError('Mật khẩu hiện tại không chính xác!');
      return;
    }

    // 6. Cập nhật mật khẩu mới vào localStorage (managedUsers & registeredUsers)
    try {
      // Cập nhật managedUsers
      const rawManaged = localStorage.getItem('managedUsers');
      let managedUsers = rawManaged ? JSON.parse(rawManaged) : [...users];
      const managedIdx = managedUsers.findIndex(
        (u) => u.email?.toLowerCase() === userEmail
      );

      if (managedIdx !== -1) {
        managedUsers[managedIdx].password = newPassword;
      } else {
        managedUsers.push({
          id: Date.now(),
          email: userEmail,
          password: newPassword,
          name: localStorage.getItem('userName') || 'Người dùng',
          role: localStorage.getItem('userRole') || 'user',
          status: 'active'
        });
      }
      localStorage.setItem('managedUsers', JSON.stringify(managedUsers));

      // Cập nhật registeredUsers
      const rawRegistered = localStorage.getItem('registeredUsers');
      if (rawRegistered) {
        let registeredUsers = JSON.parse(rawRegistered);
        const regIdx = registeredUsers.findIndex(
          (u) => u.email?.toLowerCase() === userEmail
        );
        if (regIdx !== -1) {
          registeredUsers[regIdx].password = newPassword;
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
      }

      /* ==========================================================================
         LƯU Ý: Sau này khi tích hợp Backend API, chỉ cần thay thế logic trên bằng:
         // await axios.post('/api/auth/change-password', { currentPassword, newPassword });
         ========================================================================== */

      setSuccess('Đổi mật khẩu thành công! Mật khẩu mới đã được lưu.');
      alert('✅ Đổi mật khẩu thành công! Mật khẩu mới đã được lưu.');

      // Tự động đóng modal sau khi thành công
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (err) {
      console.error('Lỗi khi cập nhật mật khẩu:', err);
      setError('Đã xảy ra lỗi trong quá trình lưu mật khẩu. Vui lòng thử lại!');
    }
  };

  return (
    <div className="change-password-backdrop" onClick={onClose}>
      <div 
        className="change-password-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header Modal */}
        <div className="change-password-header">
          <div className="change-password-title-wrap">
            <div className="change-password-icon-badge">
              <FiLock size={20} />
            </div>
            <div>
              <h2 id="modal-title" className="change-password-title">Đổi Mật Khẩu</h2>
              <p className="change-password-subtitle">
                Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật tài khoản của bạn
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="change-password-close-btn" 
            onClick={onClose}
            aria-label="Đóng"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Thông báo lỗi / thành công */}
        {error && <div className="change-password-alert error">{error}</div>}
        {success && (
          <div className="change-password-alert success">
            <FiCheckCircle size={16} /> {success}
          </div>
        )}

        {/* Form Đổi mật khẩu */}
        <form onSubmit={handleSubmit} className="change-password-form">
          {/* Mật khẩu hiện tại */}
          <div className="change-password-field">
            <label className="change-password-label" htmlFor="currentPassword">
              Mật khẩu hiện tại <span className="required-star">*</span>
            </label>
            <div className="change-password-input-wrap">
              <input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu hiện tại"
                className="change-password-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                title={showCurrentPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div className="change-password-field">
            <label className="change-password-label" htmlFor="newPassword">
              Mật khẩu mới <span className="required-star">*</span>
            </label>
            <div className="change-password-input-wrap">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Tối thiểu 6 ký tự"
                className="change-password-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
                title={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="change-password-field">
            <label className="change-password-label" htmlFor="confirmPassword">
              Xác nhận mật khẩu mới <span className="required-star">*</span>
            </label>
            <div className="change-password-input-wrap">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu mới"
                className="change-password-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Hàng nút hành động */}
          <div className="change-password-actions">
            <button
              type="button"
              className="change-password-btn cancel-btn"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="change-password-btn submit-btn"
            >
              Cập nhật mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

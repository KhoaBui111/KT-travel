import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { users } from '../../data/mockData';
import './LoginPage.css';

// Danh sách email cũ mẫu cần loại bỏ hoàn toàn
const DEPRECATED_EMAILS = [
  'admin@kttravel.com',
  'binh.tran@gmail.com',
  'cuong.le@gmail.com',
  'duc.pham@gmail.com',
  'ha.hoang@gmail.com'
];

/**
 * LoginPage - Trang đăng nhập
 * Card nền xám nhạt, center màn hình
 * Hỗ trợ xác thực phân quyền Admin / User
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    const inputPassword = password;

    // Chặn hoàn toàn các email mẫu cũ không còn sử dụng
    if (DEPRECATED_EMAILS.includes(trimmedEmail)) {
      alert('Tài khoản này không còn khả dụng trên hệ thống! Vui lòng kiểm tra lại thông tin hoặc đăng ký tài khoản mới.');
      return;
    }

    // 1. Kiểm tra tài khoản Admin chính thức cố định buisolodmid@gmail.com
    if (trimmedEmail === 'buisolodmid@gmail.com') {
      const managedUsers = JSON.parse(localStorage.getItem('managedUsers') || 'null');
      const managedAdmin = (managedUsers || []).find(
        (u) => u.email?.toLowerCase() === 'buisolodmid@gmail.com'
      );
      const validPassword = managedAdmin?.password || '676767';

      if (inputPassword !== validPassword && inputPassword !== '676767') {
        alert('Mật khẩu không chính xác!');
        return;
      }
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', 'buisolodmid@gmail.com');
      localStorage.setItem('userName', managedAdmin?.name || 'Bùi Solo Quản Trị Viên');
      localStorage.setItem('userRole', 'admin');
      window.dispatchEvent(new Event('authChange'));

      alert('Đăng nhập thành công!');
      navigate('/admin/dashboard');
      return;
    }

    // 2. Tìm kiếm trong danh sách tài khoản (managedUsers, users trong mockData, registeredUsers)
    const rawManaged = JSON.parse(localStorage.getItem('managedUsers') || 'null');
    const rawRegistered = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Tự động dọn dẹp các email cũ khỏi cache nếu có
    const cleanBaseUsers = (rawManaged || users).filter(
      (u) => u.email && !DEPRECATED_EMAILS.includes(u.email.toLowerCase())
    );
    const cleanRegisteredUsers = rawRegistered.filter(
      (r) => r.email && !DEPRECATED_EMAILS.includes(r.email.toLowerCase())
    );

    const allUsers = [
      ...cleanBaseUsers,
      ...cleanRegisteredUsers.filter(
        (r) => !cleanBaseUsers.some((b) => b.email?.toLowerCase() === r.email?.toLowerCase())
      )
    ];

    // Tìm kiếm tài khoản theo email (không phân biệt hoa thường)
    const existingUser = allUsers.find(
      (u) => u.email && u.email.toLowerCase() === trimmedEmail
    );

    if (!existingUser) {
      alert('Tài khoản không tồn tại! Vui lòng kiểm tra lại thông tin hoặc đăng ký tài khoản mới.');
      return;
    }

    // Kiểm tra tài khoản bị khóa
    if (existingUser.status === 'locked') {
      alert('⚠️ Tài khoản này hiện đang bị khóa! Vui lòng liên hệ ban quản trị để được hỗ trợ.');
      return;
    }

    // Kiểm tra mật khẩu nếu tài khoản có mật khẩu
    if (existingUser.password && existingUser.password !== inputPassword) {
      alert('Mật khẩu không chính xác!');
      return;
    }

    // Xác định vai trò (Role):
    const isAdmin = existingUser.role === 'admin' || trimmedEmail.includes('admin');
    const role = isAdmin ? 'admin' : 'user';
    const name = existingUser.name || email.trim().split('@')[0];

    // Lưu thông tin đăng nhập vào localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', existingUser.email || email.trim());
    localStorage.setItem('userName', name);
    localStorage.setItem('userRole', role);
    window.dispatchEvent(new Event('authChange'));

    alert('Đăng nhập thành công!');

    // Điều hướng dựa trên vai trò
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', 'user@gmail.com');
    localStorage.setItem('userName', 'Khách hàng');
    localStorage.setItem('userRole', 'user');
    window.dispatchEvent(new Event('authChange'));
    alert('Đăng nhập Google thành công!');
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Title */}
        <h1 className="login-title">Đăng nhập</h1>
        <p className="login-subtitle">
          Sử dụng email và mật khẩu đã đăng ký để tiếp tục
        </p>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              Email<span className="required">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="Nhập địa chỉ email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Mật khẩu */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">
                Mật khẩu<span className="required">*</span>
              </label>
              <Link to="/" className="forgot-link">Quên mật khẩu?</Link>
            </div>
            <div className="input-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Button đăng nhập */}
          <button type="submit" className="login-btn">
            Đăng nhập
          </button>
        </form>

        {/* Link đăng ký */}
        <p className="login-register-text">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="register-link">Đăng ký</Link>
        </p>

        {/* Divider */}
        <div className="login-divider">
          <span>Hoặc</span>
        </div>

        {/* Google login */}
        <button type="button" className="google-btn" onClick={handleGoogleLogin}>
          <FcGoogle size={22} />
          <span>Tiếp tục với Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

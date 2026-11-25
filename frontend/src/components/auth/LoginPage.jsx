import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { login } from '../../services/authService';
import './LoginPage.css';

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Backend kiểm tra email + mật khẩu (đã băm) trong bảng tai_khoan, trả token
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      alert('Đăng nhập thành công!');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      alert(err.message); // vd: "Email hoặc mật khẩu không đúng."
    } finally {
      setLoading(false);
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
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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

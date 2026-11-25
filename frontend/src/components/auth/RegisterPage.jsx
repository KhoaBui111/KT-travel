import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { users } from '../../data/mockData';
import { register } from '../../services/authService';
import './RegisterPage.css';

/**
 * RegisterPage - Trang đăng ký
 * Card tương tự login, nhiều fields hơn
 * Fields: Họ tên, SĐT, Email, Mật khẩu, Xác nhận mật khẩu
 * Gửi thông tin lên Backend API (/api/auth/register/), lưu vào bảng tai_khoan
 * Chuyển hướng tới /login sau khi đăng ký thành công
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với Điều khoản sử dụng');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    // Gửi lên backend: kiểm tra trùng email, độ mạnh mật khẩu, băm mật khẩu, lưu vào CSDL
    setLoading(true);
    try {
      await register({
        email: formData.email.trim(),
        matKhau: formData.password,
        hoTen: formData.fullName.trim(),
        soDienThoai: formData.phone.trim(),
      });
      alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục.');
      navigate('/login');
    } catch (err) {
      alert(err.message); // vd: "Email này đã được đăng ký."
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const googleUser = {
      id: Date.now(),
      name: 'Khách hàng Google',
      email: 'user@gmail.com',
      password: '',
      phone: '0900000000',
      role: 'user',
      status: 'active',
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    if (!registeredUsers.some((u) => u.email && u.email.toLowerCase() === googleUser.email.toLowerCase())) {
      const updated = [...registeredUsers, googleUser];
      localStorage.setItem('registeredUsers', JSON.stringify(updated));

      try {
        const savedManagedUsers = localStorage.getItem('managedUsers');
        const managedUsers = savedManagedUsers ? JSON.parse(savedManagedUsers) : [...users];
        if (!managedUsers.some((u) => u.email && u.email.toLowerCase() === googleUser.email.toLowerCase())) {
          managedUsers.push(googleUser);
          localStorage.setItem('managedUsers', JSON.stringify(managedUsers));
        }
      } catch (err) {
        console.error('Lỗi khi cập nhật managedUsers:', err);
      }
    }

    alert('Đăng ký với Google thành công! Vui lòng đăng nhập.');
    navigate('/login');
  };

  return (
    <div className="register-page">
      <div className="register-card">
        {/* Title */}
        <h1 className="register-title">Đăng ký</h1>
        <p className="register-subtitle">
          Tạo tài khoản để nhận ưu đãi và quản lý đặt chỗ
        </p>

        {/* Form */}
        <form className="register-form" onSubmit={handleSubmit}>
          {/* Họ và tên */}
          <div className="form-group">
            <label className="form-label">
              Họ và tên<span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              name="fullName"
              placeholder="Nhập họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Số điện thoại */}
          <div className="form-group">
            <label className="form-label">
              Số điện thoại<span className="required">*</span>
            </label>
            <input
              type="tel"
              className="form-input"
              name="phone"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              Email<span className="required">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mật khẩu + Xác nhận (2 cột) */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Mật khẩu<span className="required">*</span>
              </label>
              <div className="input-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="form-group">
              <label className="form-label">
                Xác nhận<span className="required">*</span>
              </label>
              <div className="input-password-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="form-input"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Checkbox điều khoản */}
          <div className="terms-group">
            <label className="terms-label">
              <input
                type="checkbox"
                className="terms-checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span className="terms-text">
                Tôi đồng ý với{' '}
                <Link to="/" className="terms-link">Điều khoản sử dụng</Link>
                {' '}và{' '}
                <Link to="/" className="terms-link">Chính sách bảo mật</Link>
                {' '}của KT Travel
              </span>
            </label>
          </div>

          {/* Button đăng ký */}
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        {/* Link đăng nhập */}
        <p className="register-login-text">
          Đã có tài khoản?{' '}
          <Link to="/login" className="login-link">Đăng nhập</Link>
        </p>

        {/* Divider */}
        <div className="register-divider">
          <span>Hoặc</span>
        </div>

        {/* Google register */}
        <button type="button" className="google-btn" onClick={handleGoogleRegister}>
          <FcGoogle size={22} />
          <span>Tiếp tục với Google</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;

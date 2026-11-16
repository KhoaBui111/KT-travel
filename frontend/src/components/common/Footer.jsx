import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import './Footer.css';

/**
 * Footer Component - Chân trang chung cho toàn bộ website KT Travel
 * (Hiển thị trên tất cả các trang khách hàng & đặt tour, ngoại trừ trang Admin)
 */
const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-content">
          {/* Cột 1: Thương hiệu & Logo */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src={logoImg} alt="KT Travel" className="footer-logo-img" />
            </Link>
            <p className="footer-desc">
              Đồng hành cùng bạn trên mọi hành trình khám phá thế giới. Dịch vụ đặt tour uy tín, chuyên nghiệp và tận tâm.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="footer-links">
            <h4>Khám phá</h4>
            <Link to="/">Trang chủ</Link>
            <Link to="/search">Tìm kiếm tour</Link>
            <Link to="/search?q=Vi%E1%BB%87t%20Nam">Tour trong nước</Link>
            <Link to="/search?q=Ch%C3%A2u%20%C3%82u">Tour ngoài nước</Link>
          </div>

          {/* Cột 3: Hỗ trợ & Chính sách */}
          <div className="footer-links">
            <h4>Hỗ trợ khách hàng</h4>
            <Link to="/">Liên hệ hỗ trợ</Link>
            <Link to="/">Chính sách bảo mật</Link>
            <Link to="/">Điều khoản sử dụng</Link>
            <Link to="/history">Tra cứu đơn tour</Link>
          </div>

          {/* Cột 4: Thông tin liên hệ */}
          <div className="footer-links">
            <h4>Thông tin liên hệ</h4>
            <p>📍 TP. Hồ Chí Minh, Việt Nam</p>
            <p>📞 Hotline: 0901 234 567</p>
            <p>✉️ Email: info@kttravel.com</p>
            <p>⏰ Hỗ trợ 24/7 các ngày trong tuần</p>
          </div>
        </div>

        {/* Dòng bản quyền 2026 */}
        <div className="footer-bottom">
          <p>© 2026 KT Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

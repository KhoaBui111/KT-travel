import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiChevronRight, FiMapPin, FiClock, FiCalendar } from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import { FaPlus, FaMinus, FaCheckCircle } from 'react-icons/fa';
import Header from '../common/Header';
import { tours, formatCurrency } from '../../data/mockData';
import './TourDetailPage.css';

/**
 * TourDetailPage Component - Trang chi tiết tour
 * Hiển thị gallery, thông tin tour, chọn ngày, số người và đặt tour
 */
const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tìm tour theo ID
  const tour = tours.find((t) => t.id === parseInt(id));

  // State quản lý ảnh gallery đang chọn
  const [selectedImage, setSelectedImage] = useState(0);
  // State ngày khởi hành được chọn
  const [selectedDate, setSelectedDate] = useState(0);
  // State số lượng người
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // Nếu không tìm thấy tour
  if (!tour) {
    return (
      <div className="tour-detail-page">
        <Header />
        <div className="container tour-not-found">
          <h2>Không tìm thấy tour</h2>
          <Link to="/">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  // Lấy gallery (đảm bảo luôn có ảnh)
  const gallery = tour.gallery && tour.gallery.length > 0 ? tour.gallery : [tour.image];

  // Tính tổng cộng (trẻ em 75%, em bé miễn phí)
  const totalPrice = tour.price * adults + tour.price * 0.75 * children;

  // Hàm tăng/giảm số lượng
  const adjustCount = (setter, current, delta, min = 0) => {
    const next = current + delta;
    if (next >= min) setter(next);
  };

  // Xử lý đặt tour
  const handleBooking = () => {
    navigate('/booking/customer-info', {
      state: {
        tour,
        selectedDate: tour.dates && tour.dates.length > 0 ? tour.dates[selectedDate] : '31/10/2024',
        adults,
        children,
        infants,
        quantity: adults + children + infants,
        totalPrice
      }
    });
  };

  return (
    <div className="tour-detail-page">
      <Header />

      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Trang chủ</Link>
          <FiChevronRight className="breadcrumb-sep" />
          <span className="breadcrumb-current">{tour.name}</span>
        </nav>

        {/* Nội dung chính */}
        <div className="tour-detail-content">
          {/* Cột trái: Gallery ảnh */}
          <div className="tour-gallery">
            <div className="gallery-main">
              <img
                src={gallery[selectedImage]}
                alt={tour.name}
                className="gallery-main-img"
              />
            </div>
            <div className="gallery-thumbs">
              {gallery.map((img, index) => (
                <button
                  key={index}
                  className={`gallery-thumb ${index === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${tour.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Cột phải: Thông tin tour */}
          <div className="tour-info-panel">
            <h1 className="tour-detail-title">{tour.name}</h1>

            {/* Giá */}
            <div className="tour-price-box">
              <span className="tour-price-value">{formatCurrency(tour.price)}</span>
              <span className="tour-price-unit">/ người</span>
            </div>

            {/* Thông tin cơ bản */}
            <div className="tour-meta">
              <div className="tour-meta-item">
                <FiMapPin className="tour-meta-icon" />
                <span className="tour-meta-label">Khởi hành:</span>
                <span className="tour-meta-value">{tour.departure}</span>
              </div>
              <div className="tour-meta-item">
                <FiClock className="tour-meta-icon" />
                <span className="tour-meta-label">Thời lượng:</span>
                <span className="tour-meta-value">{tour.duration}</span>
              </div>
              <div className="tour-meta-item">
                <MdFlight className="tour-meta-icon" />
                <span className="tour-meta-label">Hãng:</span>
                <span className="tour-meta-value">{tour.airline}</span>
              </div>
            </div>

            {/* Chọn ngày khởi hành */}
            <div className="tour-dates">
              <h3 className="info-label">
                <FiCalendar className="info-label-icon" />
                Ngày khởi hành
              </h3>
              <div className="date-buttons">
                {tour.dates.map((date, index) => (
                  <button
                    key={index}
                    className={`date-btn ${index === selectedDate ? 'active' : ''}`}
                    onClick={() => setSelectedDate(index)}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn số người */}
            <div className="tour-people">
              <h3 className="info-label">Số người</h3>
              {/* Người lớn */}
              <div className="people-row">
                <div className="people-label">
                  <span className="people-type">Người lớn</span>
                  <span className="people-note">{formatCurrency(tour.price)}/người</span>
                </div>
                <div className="people-counter">
                  <button
                    className="counter-btn"
                    onClick={() => adjustCount(setAdults, adults, -1, 1)}
                    disabled={adults <= 1}
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="counter-value">{adults}</span>
                  <button
                    className="counter-btn"
                    onClick={() => adjustCount(setAdults, adults, 1)}
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>
              {/* Trẻ em */}
              <div className="people-row">
                <div className="people-label">
                  <span className="people-type">Trẻ em</span>
                  <span className="people-note">{formatCurrency(tour.price * 0.75)}/người</span>
                </div>
                <div className="people-counter">
                  <button
                    className="counter-btn"
                    onClick={() => adjustCount(setChildren, children, -1)}
                    disabled={children <= 0}
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="counter-value">{children}</span>
                  <button
                    className="counter-btn"
                    onClick={() => adjustCount(setChildren, children, 1)}
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>
              {/* Em bé */}
              <div className="people-row">
                <div className="people-label">
                  <span className="people-type">Em bé</span>
                  <span className="people-note">Miễn phí</span>
                </div>
                <div className="people-counter">
                  <button
                    className="counter-btn"
                    onClick={() => adjustCount(setInfants, infants, -1)}
                    disabled={infants <= 0}
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="counter-value">{infants}</span>
                  <button
                    className="counter-btn"
                    onClick={() => adjustCount(setInfants, infants, 1)}
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tổng cộng */}
            <div className="tour-total">
              <span className="total-label">Tổng cộng:</span>
              <span className="total-value">{formatCurrency(totalPrice)}</span>
            </div>

            {/* Nút đặt tour */}
            <button className="booking-btn" onClick={handleBooking}>
              Đặt tour ngay
            </button>
          </div>
        </div>

        {/* Mô tả tour */}
        <div className="tour-description-section">
          <h2 className="tour-desc-heading">Lịch trình có gì hay?</h2>
          <p className="tour-desc-text">{tour.description}</p>

          {/* Highlights */}
          {tour.highlights && tour.highlights.length > 0 && (
            <div className="tour-highlights">
              <h3 className="highlights-title">Điểm nổi bật</h3>
              <ul className="highlights-list">
                {tour.highlights.map((item, index) => (
                  <li key={index} className="highlight-item">
                    <FaCheckCircle className="highlight-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;

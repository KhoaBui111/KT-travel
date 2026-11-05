import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import Header from '../common/Header';
import TourCard from '../common/TourCard';
import { tours, destinations } from '../../data/mockData';
import './HomePage.css';

/**
 * HomePage Component - Trang chủ KT Travel
 * Bao gồm: Hero Banner, Destinations, Sản phẩm nổi bật, Footer
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Xử lý tìm kiếm từ Hero Banner
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/search?q=' + encodeURIComponent(searchTerm.trim()));
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="homepage">
      {/* Header - Tự động nhận diện trạng thái đăng nhập qua localStorage và sự kiện authChange */}
      <Header />

      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Khám phá Thế giới cùng KT Travel</h1>
          <p className="hero-subtitle">
            Hàng ngàn tour du lịch trong nước và quốc tế đang chờ bạn khám phá
          </p>
          {/* Thanh tìm kiếm */}
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Bạn muốn đi đâu?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">
              <FiSearch size={20} />
              <span>Tìm kiếm</span>
            </button>
          </form>
        </div>
      </section>

      {/* Destinations Section - Điểm đến phổ biến */}
      <section className="destinations-section">
        <div className="container">
          <h2 className="section-title">Điểm đến phổ biến</h2>
          <div className="destinations-grid">
            {destinations.map((dest) => (
              <Link 
                to={`/search?q=${encodeURIComponent(dest.name)}`} 
                className="destination-item" 
                key={dest.id}
              >
                <div className="destination-image">
                  <img src={dest.image} alt={dest.name} />
                </div>
                <span className="destination-name">{dest.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sản phẩm nổi bật Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Sản phẩm nổi bật</h2>
          <div className="tours-grid">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

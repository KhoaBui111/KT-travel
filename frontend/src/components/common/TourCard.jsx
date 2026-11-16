import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import { formatCurrency } from '../../data/mockData';
import './TourCard.css';

/**
 * TourCard Component - Card hiển thị thông tin tour
 * Thiết kế: Ảnh + badge thời gian, country tag, tên tour, 
 * khởi hành, hãng bay, giá, nút chi tiết
 */
const TourCard = ({ tour }) => {
  const {
    id,
    name,
    duration,
    price,
    departure,
    airline,
    country,
    image
  } = tour;

  return (
    <div className="tour-card">
      {/* Ảnh tour + badge */}
      <div className="tour-card-image">
        <img 
          src={image} 
          alt={name}
          loading="lazy"
        />
        <span className="tour-card-badge">{duration}</span>
      </div>

      {/* Nội dung */}
      <div className="tour-card-content">
        {/* Country tag */}
        <span className="tour-card-country">{country}</span>

        {/* Tên tour */}
        <h3 className="tour-card-title">{name}</h3>

        {/* Thông tin khởi hành */}
        <div className="tour-card-info">
          <div className="tour-card-info-item">
            <FiMapPin className="tour-card-icon" />
            <span>Khởi hành từ {departure}</span>
          </div>
          <div className="tour-card-info-item">
            <MdFlight className="tour-card-icon" />
            <span>{airline}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="tour-card-divider"></div>

        {/* Giá + Button */}
        <div className="tour-card-footer">
          <div className="tour-card-price">
            <span className="price-label">Giá Từ</span>
            <span className="price-value">{formatCurrency(price)}</span>
          </div>
          <Link to={`/tour/${id}`} className="tour-card-btn">
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  FiSearch, 
  FiFilter, 
  FiRefreshCw, 
  FiX, 
  FiCalendar, 
  FiDollarSign, 
  FiChevronRight,
  FiSliders,
  FiAlertCircle
} from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import Header from '../common/Header';
import TourCard from '../common/TourCard';
import { tours } from '../../data/mockData';
import './SearchPage.css';

/**
 * Hàm loại bỏ dấu tiếng Việt để tìm kiếm không dấu
 */
const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

/**
 * SearchPage Component - Trang tìm kiếm tour du lịch với bộ lọc nâng cao
 * - Cột trái: Sidebar bộ lọc (Giá, Phương tiện, Thời lượng)
 * - Cột phải: Thanh tìm kiếm, đếm số lượng kết quả, danh sách TourCard & Empty State
 */
const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State tìm kiếm từ khóa
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // State bộ lọc
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedAirline, setSelectedAirline] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Trạng thái mở bộ lọc trên mobile/tablet
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Đọc query param '?q=' từ URL khi load trang hoặc URL thay đổi
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setKeyword(query);
    setSearchInput(query);
  }, [location.search]);

  // Xử lý submit tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setKeyword(trimmed);

    const params = new URLSearchParams(location.search);
    if (trimmed) {
      params.set('q', trimmed);
    } else {
      params.delete('q');
    }
    navigate({ search: params.toString() });
  };

  // Xóa từ khóa tìm kiếm
  const handleClearKeyword = () => {
    setSearchInput('');
    setKeyword('');
    const params = new URLSearchParams(location.search);
    params.delete('q');
    navigate({ search: params.toString() });
  };

  // Reset tất cả các bộ lọc
  const handleResetFilters = () => {
    setSelectedPrice('all');
    setSelectedAirline('all');
    setSelectedDuration('all');
    setSortBy('default');
    setSearchInput('');
    setKeyword('');
    navigate('/search');
  };

  // Đếm số lượng bộ lọc đang áp dụng
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (keyword) count++;
    if (selectedPrice !== 'all') count++;
    if (selectedAirline !== 'all') count++;
    if (selectedDuration !== 'all') count++;
    return count;
  }, [keyword, selectedPrice, selectedAirline, selectedDuration]);

  // Lọc và sắp xếp danh sách tour
  const filteredTours = useMemo(() => {
    let result = [...tours];

    // 1. Lọc theo từ khóa (Tên tour, quốc gia, khu vực, mô tả, điểm đến)
    if (keyword) {
      const normalizedKeyword = removeAccents(keyword);
      result = result.filter((tour) => {
        const nameMatch = removeAccents(tour.name).includes(normalizedKeyword);
        const countryMatch = removeAccents(tour.country).includes(normalizedKeyword);
        const continentMatch = tour.continent ? removeAccents(tour.continent).includes(normalizedKeyword) : false;
        const departureMatch = removeAccents(tour.departure).includes(normalizedKeyword);
        const descMatch = tour.description ? removeAccents(tour.description).includes(normalizedKeyword) : false;
        const highlightsMatch = tour.highlights ? tour.highlights.some(h => removeAccents(h).includes(normalizedKeyword)) : false;

        return nameMatch || countryMatch || continentMatch || departureMatch || descMatch || highlightsMatch;
      });
    }

    // 2. Lọc theo khoảng giá
    if (selectedPrice !== 'all') {
      result = result.filter((tour) => {
        const price = tour.price;
        switch (selectedPrice) {
          case 'under10':
            return price < 10000000;
          case '10to50':
            return price >= 10000000 && price <= 50000000;
          case '50to80':
            return price >= 50000000 && price <= 80000000;
          case 'above80':
            return price > 80000000;
          default:
            return true;
        }
      });
    }

    // 3. Lọc theo phương tiện
    if (selectedAirline !== 'all') {
      result = result.filter((tour) => {
        if (!tour.airline) return false;
        return tour.airline.toLowerCase() === selectedAirline.toLowerCase();
      });
    }

    // 4. Lọc theo thời lượng ngày
    if (selectedDuration !== 'all') {
      result = result.filter((tour) => {
        const days = tour.durationDays;
        switch (selectedDuration) {
          case 'under5':
            return days < 5;
          case '5to10':
            return days >= 5 && days <= 10;
          case 'above10':
            return days > 10;
          default:
            return true;
        }
      });
    }

    // 5. Sắp xếp kết quả
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'duration-asc') {
      result.sort((a, b) => a.durationDays - b.durationDays);
    } else if (sortBy === 'duration-desc') {
      result.sort((a, b) => b.durationDays - a.durationDays);
    }

    return result;
  }, [keyword, selectedPrice, selectedAirline, selectedDuration, sortBy]);

  // Cấu hình danh sách options bộ lọc giá
  const priceOptions = [
    { value: 'all', label: 'Tất cả mức giá' },
    { value: 'under10', label: 'Dưới 10.000.000 đ' },
    { value: '10to50', label: '10.000.000 đ - 50.000.000 đ' },
    { value: '50to80', label: '50.000.000 đ - 80.000.000 đ' },
    { value: 'above80', label: 'Trên 80.000.000 đ' }
  ];

  // Cấu hình danh sách options phương tiện
  const airlineOptions = [
    { value: 'all', label: 'Tất cả phương tiện' },
    { value: 'Vietnam Airlines', label: 'Vietnam Airlines' },
    { value: 'VietJet', label: 'VietJet' },
    { value: 'Xe khách', label: 'Xe khách' }
  ];

  // Cấu hình danh sách options thời lượng
  const durationOptions = [
    { value: 'all', label: 'Tất cả thời lượng' },
    { value: 'under5', label: 'Dưới 5 ngày' },
    { value: '5to10', label: '5 - 10 ngày' },
    { value: 'above10', label: 'Trên 10 ngày' }
  ];

  return (
    <div className="search-page">
      {/* Header chính */}
      <Header />

      {/* Breadcrumb & Search Hero Bar */}
      <div className="search-hero">
        <div className="container">
          <div className="search-breadcrumb">
            <Link to="/" className="breadcrumb-link">Trang chủ</Link>
            <FiChevronRight className="breadcrumb-separator" />
            <span className="breadcrumb-current">Tìm kiếm tour du lịch</span>
          </div>

          <div className="search-bar-wrapper">
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <div className="search-input-group">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input-field"
                  placeholder="Bạn muốn đi đâu? (Ví dụ: Châu Âu, Pháp, Đà Nẵng, Thụy Sĩ...)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                  <button 
                    type="button" 
                    className="clear-search-btn"
                    onClick={handleClearKeyword}
                    title="Xóa từ khóa"
                  >
                    <FiX />
                  </button>
                )}
              </div>
              <button type="submit" className="search-submit-btn">
                <FiSearch />
                <span>Tìm kiếm</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container search-container">
        {/* Nút bật bộ lọc trên Mobile */}
        <div className="mobile-filter-trigger">
          <button 
            type="button" 
            className="mobile-filter-btn"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <FiSliders />
            <span>Bộ lọc</span>
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
          </button>

          <div className="mobile-results-count">
            Tìm thấy <strong>{filteredTours.length}</strong> tour
          </div>
        </div>

        <div className="search-layout">
          {/* CỘT TRÁI: SIDEBAR FILTER */}
          <aside className={`search-sidebar ${isMobileFilterOpen ? 'is-open' : ''}`}>
            {/* Backdrop đóng filter trên mobile */}
            {isMobileFilterOpen && (
              <div 
                className="sidebar-backdrop" 
                onClick={() => setIsMobileFilterOpen(false)} 
              />
            )}

            <div className="sidebar-inner">
              {/* Header của Sidebar */}
              <div className="sidebar-header">
                <div className="sidebar-title-wrapper">
                  <FiFilter className="sidebar-icon" />
                  <h3 className="sidebar-title">Bộ lọc tìm kiếm</h3>
                </div>
                <div className="sidebar-actions">
                  <button
                    type="button"
                    className="reset-filters-btn"
                    onClick={handleResetFilters}
                    title="Đặt lại tất cả bộ lọc"
                  >
                    <FiRefreshCw className="reset-icon" />
                    <span>Xóa bộ lọc</span>
                  </button>
                  {isMobileFilterOpen && (
                    <button
                      type="button"
                      className="close-mobile-filter"
                      onClick={() => setIsMobileFilterOpen(false)}
                      title="Đóng bộ lọc"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </div>

              {/* BỘ LỌC 1: LỌC THEO GIÁ */}
              <div className="filter-group">
                <div className="filter-group-header">
                  <FiDollarSign className="group-icon" />
                  <h4 className="filter-group-title">Mức giá tour</h4>
                </div>
                <div className="filter-options-list">
                  {priceOptions.map((opt) => (
                    <label 
                      key={opt.value} 
                      className={`filter-option-item ${selectedPrice === opt.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="filter-price"
                        value={opt.value}
                        checked={selectedPrice === opt.value}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                      />
                      <span className="custom-radio"></span>
                      <span className="option-label">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* BỘ LỌC 2: LỌC THEO PHƯƠNG TIỆN */}
              <div className="filter-group">
                <div className="filter-group-header">
                  <MdFlight className="group-icon" />
                  <h4 className="filter-group-title">Phương tiện di chuyển</h4>
                </div>
                <div className="filter-options-list">
                  {airlineOptions.map((opt) => (
                    <label 
                      key={opt.value} 
                      className={`filter-option-item ${selectedAirline === opt.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="filter-airline"
                        value={opt.value}
                        checked={selectedAirline === opt.value}
                        onChange={(e) => setSelectedAirline(e.target.value)}
                      />
                      <span className="custom-radio"></span>
                      <span className="option-label">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* BỘ LỌC 3: LỌC THEO THỜI LƯỢNG NGÀY */}
              <div className="filter-group">
                <div className="filter-group-header">
                  <FiCalendar className="group-icon" />
                  <h4 className="filter-group-title">Thời lượng tour</h4>
                </div>
                <div className="filter-options-list">
                  {durationOptions.map((opt) => (
                    <label 
                      key={opt.value} 
                      className={`filter-option-item ${selectedDuration === opt.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="filter-duration"
                        value={opt.value}
                        checked={selectedDuration === opt.value}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                      />
                      <span className="custom-radio"></span>
                      <span className="option-label">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Nút hoàn tất áp dụng trên Mobile */}
              {isMobileFilterOpen && (
                <div className="sidebar-mobile-footer">
                  <button 
                    type="button" 
                    className="apply-filter-btn"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    Xem {filteredTours.length} kết quả
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* CỘT PHẢI: KẾT QUẢ TÌM KIẾM */}
          <main className="search-results-area">
            {/* Thanh tiêu đề kết quả & Sắp xếp */}
            <div className="results-header-bar">
              <div className="results-count-wrapper">
                <h2 className="results-heading">
                  Tìm thấy <span className="highlight-count">{filteredTours.length}</span> tour phù hợp
                </h2>
                {keyword && (
                  <p className="search-query-info">
                    kết quả cho từ khóa: <strong>"{keyword}"</strong>
                  </p>
                )}
              </div>

              <div className="results-sort-wrapper">
                <label htmlFor="sort-select" className="sort-label">Sắp xếp theo:</label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Phổ biến nhất</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                  <option value="duration-asc">Thời gian: Ngắn nhất</option>
                  <option value="duration-desc">Thời gian: Dài nhất</option>
                </select>
              </div>
            </div>

            {/* Danh sách các tag bộ lọc đang kích hoạt */}
            {activeFiltersCount > 0 && (
              <div className="active-filters-bar">
                <span className="active-filters-label">Đang lọc theo:</span>
                <div className="active-tags-list">
                  {keyword && (
                    <span className="filter-tag">
                      Từ khóa: {keyword}
                      <button type="button" onClick={handleClearKeyword}><FiX /></button>
                    </span>
                  )}
                  {selectedPrice !== 'all' && (
                    <span className="filter-tag">
                      Giá: {priceOptions.find(p => p.value === selectedPrice)?.label}
                      <button type="button" onClick={() => setSelectedPrice('all')}><FiX /></button>
                    </span>
                  )}
                  {selectedAirline !== 'all' && (
                    <span className="filter-tag">
                      Phương tiện: {selectedAirline}
                      <button type="button" onClick={() => setSelectedAirline('all')}><FiX /></button>
                    </span>
                  )}
                  {selectedDuration !== 'all' && (
                    <span className="filter-tag">
                      Thời lượng: {durationOptions.find(d => d.value === selectedDuration)?.label}
                      <button type="button" onClick={() => setSelectedDuration('all')}><FiX /></button>
                    </span>
                  )}
                  <button 
                    type="button" 
                    className="clear-all-tags-btn"
                    onClick={handleResetFilters}
                  >
                    Xóa tất cả
                  </button>
                </div>
              </div>
            )}

            {/* DANH SÁCH TOUR HOẶC EMPTY STATE */}
            {filteredTours.length > 0 ? (
              <div className="search-tours-grid">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="search-empty-state">
                <div className="empty-state-icon-wrapper">
                  <FiAlertCircle className="empty-icon" />
                </div>
                <h3 className="empty-state-title">Không tìm thấy tour phù hợp</h3>
                <p className="empty-state-desc">
                  Không tìm thấy tour phù hợp với tiêu chí lọc của bạn. Vui lòng thử lại với bộ lọc khác hoặc tìm kiếm với từ khóa khác!
                </p>
                <div className="empty-state-actions">
                  <button 
                    type="button" 
                    className="empty-reset-btn"
                    onClick={handleResetFilters}
                  >
                    <FiRefreshCw />
                    <span>Đặt lại toàn bộ lọc</span>
                  </button>
                  <Link to="/" className="empty-home-btn">
                    <span>Về trang chủ</span>
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

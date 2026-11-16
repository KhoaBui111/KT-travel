import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Stepper from '../common/Stepper';
import './PaymentPage.css';

/**
 * PaymentPage - Trang cổng thanh toán (Bước 3→4)
 * Lựa chọn phương thức thanh toán: VNPAY hoặc PayPal
 */
const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingState = location.state || {};
  const [selectedMethod, setSelectedMethod] = useState('vnpay');

  // Xử lý thanh toán
  const handlePayment = () => {
    navigate('/booking/complete', {
      state: {
        ...bookingState,
        paymentMethod: selectedMethod
      }
    });
  };

  // Xử lý hủy
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="payment-page">
      <Header isLoggedIn={true} />
      <Stepper currentStep={3} />

      <div className="payment-container">
        {/* Heading */}
        <div className="payment-heading">
          <h2>Cổng Thanh Toán</h2>
        </div>

        {/* Nội dung thanh toán */}
        <div className="payment-content">
          {/* Option VNPAY */}
          <div
            className={`payment-option ${selectedMethod === 'vnpay' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('vnpay')}
          >
            <div className="payment-option-radio">
              <input
                type="radio"
                name="paymentMethod"
                value="vnpay"
                checked={selectedMethod === 'vnpay'}
                onChange={() => setSelectedMethod('vnpay')}
              />
              <span className="radio-indicator"></span>
            </div>
            <div className="payment-option-icon vnpay-icon">
              {/* VNPAY Icon */}
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="8" fill="#005BAA"/>
                <text x="24" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">VN</text>
                <text x="24" y="32" textAnchor="middle" fill="#EC1C24" fontSize="8" fontWeight="bold">PAY</text>
              </svg>
            </div>
            <div className="payment-option-info">
              <h3>VNPAY</h3>
              <p>Thanh toán nội địa - Thẻ ATM, Visa, MasterCard, QR Code</p>
            </div>
          </div>

          {/* Option PayPal */}
          <div
            className={`payment-option ${selectedMethod === 'paypal' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('paypal')}
          >
            <div className="payment-option-radio">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={selectedMethod === 'paypal'}
                onChange={() => setSelectedMethod('paypal')}
              />
              <span className="radio-indicator"></span>
            </div>
            <div className="payment-option-icon paypal-icon">
              {/* PayPal Icon */}
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="8" fill="#003087"/>
                <text x="24" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">Pay</text>
                <text x="24" y="32" textAnchor="middle" fill="#009CDE" fontSize="8" fontWeight="bold">Pal</text>
              </svg>
            </div>
            <div className="payment-option-info">
              <h3>PayPal</h3>
              <p>Thanh toán ngoại địa - Tài khoản PayPal, thẻ quốc tế</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="payment-buttons">
            <button className="btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
            <button className="btn-pay" onClick={handlePayment}>
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

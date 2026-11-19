import React from 'react';
import Sidebar from '../common/Sidebar';
import { dashboardStats, formatCurrency } from '../../data/mockData';
import { FiDollarSign, FiShoppingCart, FiUsers } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';

/**
 * DashboardPage - Trang dashboard tổng quan admin
 * Hiển thị stat cards, biểu đồ doanh thu tuần
 */
const DashboardPage = () => {
  // Format tooltip doanh thu
  const formatTooltip = (value) => {
    return formatCurrency(value);
  };

  // Format trục Y
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    return value;
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* Stat Cards - Grid 3 cột */}
        <div className="stat-cards-grid">
          {/* Card 1: Doanh thu tuần */}
          <div className="stat-card stat-card--pink">
            <div className="stat-card__content">
              <p className="stat-card__label">Doanh thu tuần</p>
              <h2 className="stat-card__value">{formatCurrency(dashboardStats.weeklyRevenue)}</h2>
            </div>
            <div className="stat-card__icon">
              <FiDollarSign size={32} />
            </div>
          </div>

          {/* Card 2: Đơn hàng hàng tuần */}
          <div className="stat-card stat-card--blue">
            <div className="stat-card__content">
              <p className="stat-card__label">Đơn hàng hàng tuần</p>
              <h2 className="stat-card__value">{dashboardStats.weeklyOrders}</h2>
            </div>
            <div className="stat-card__icon">
              <FiShoppingCart size={32} />
            </div>
          </div>

          {/* Card 3: Người dùng đang online */}
          <div className="stat-card stat-card--teal">
            <div className="stat-card__content">
              <p className="stat-card__label">Người dùng đang online</p>
              <h2 className="stat-card__value">{dashboardStats.onlineUsers}</h2>
            </div>
            <div className="stat-card__icon">
              <FiUsers size={32} />
            </div>
          </div>
        </div>

        {/* Biểu đồ doanh thu tuần */}
        <div className="chart-container">
          <h3 className="chart-title">Thống kê doanh thu tuần</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dashboardStats.chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 14, fill: '#555' }} />
              <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: '#555' }} />
              <Tooltip
                formatter={formatTooltip}
                labelStyle={{ fontWeight: 700 }}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="revenue" fill="#2196F3" radius={[6, 6, 0, 0]} name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

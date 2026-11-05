import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Auth Pages
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';

// Public Pages
import HomePage from './components/public/HomePage';
import SearchPage from './components/public/SearchPage';
import TourDetailPage from './components/public/TourDetailPage';
import TransactionHistoryPage from './components/public/TransactionHistoryPage';
import TransactionDetailPage from './components/public/TransactionDetailPage';

// Booking Pages
import CustomerInfoPage from './components/booking/CustomerInfoPage';
import ConfirmTourPage from './components/booking/ConfirmTourPage';
import PaymentPage from './components/booking/PaymentPage';
import CompletionPage from './components/booking/CompletionPage';

// Admin Pages
import DashboardPage from './components/admin/DashboardPage';
import TourManagementPage from './components/admin/TourManagementPage';
import AddTourPage from './components/admin/AddTourPage';
import CustomerTourPage from './components/admin/CustomerTourPage';
import PermissionPage from './components/admin/PermissionPage';
import CustomerDetailPage from './components/admin/CustomerDetailPage';

// Route Guard & Common
import AdminProtectedRoute from './components/common/AdminProtectedRoute';
import MessengerChat from './components/common/MessengerChat';
import Footer from './components/common/Footer';

function App() {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      <Routes>
        {/* ======= Auth Routes ======= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ======= Public Routes ======= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/tour/:id" element={<TourDetailPage />} />
        <Route path="/history" element={<TransactionHistoryPage />} />
        <Route path="/transaction/:id" element={<TransactionDetailPage />} />

        {/* ======= Booking Routes ======= */}
        <Route path="/booking/customer-info" element={<CustomerInfoPage />} />
        <Route path="/booking/confirm" element={<ConfirmTourPage />} />
        <Route path="/booking/payment" element={<PaymentPage />} />
        <Route path="/booking/complete" element={<CompletionPage />} />

        {/* ======= Admin Routes (Được bảo vệ bởi AdminProtectedRoute) ======= */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <DashboardPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/tours" 
          element={
            <AdminProtectedRoute>
              <TourManagementPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/tours/add" 
          element={
            <AdminProtectedRoute>
              <AddTourPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/tours/edit/:id" 
          element={
            <AdminProtectedRoute>
              <AddTourPage isEdit={true} />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/customer-tours" 
          element={
            <AdminProtectedRoute>
              <CustomerTourPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/permissions" 
          element={
            <AdminProtectedRoute>
              <PermissionPage />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/customer/:id" 
          element={
            <AdminProtectedRoute>
              <CustomerDetailPage />
            </AdminProtectedRoute>
          } 
        />
      </Routes>

      {/* Footer chung cho toàn bộ website (loại trừ Admin và Auth) */}
      {!hideFooter && <Footer />}

      {/* Floating Messenger Chat */}
      <MessengerChat />
    </div>
  );
}

export default App;

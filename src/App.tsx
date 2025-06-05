import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CourseProvider } from './contexts/CourseContext';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Orders from './pages/Orders';

export default function App() {
  return (
    <CourseProvider>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/404" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
              <p className="text-gray-600">The requested golf course could not be found.</p>
            </div>
          </div>
        } />
        <Route path="*" element={<Navigate to="/404\" replace />} />
      </Routes>
    </CourseProvider>
  );
}
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, ClipboardList, FileText, Users, TestTube } from 'lucide-react';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import { useAuth } from './context/AuthContext';

import PatientDashboard from './pages/patient/PatientDashboard';
import BookTest from './pages/patient/BookTest';
import MyOrders from './pages/patient/MyOrders';
import MyReports from './pages/patient/MyReports';

import StaffDashboard from './pages/staff/StaffDashboard';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTests from './pages/admin/ManageTests';
import ManageUsers from './pages/admin/ManageUsers';
import ManageOrders from './pages/admin/ManageOrders';
import AdminReports from './pages/admin/AdminReports';

const patientMenu = [
  { to: '/patient', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/patient/book-test', label: 'Book Test', icon: CalendarPlus },
  { to: '/patient/orders', label: 'My Orders', icon: ClipboardList },
  { to: '/patient/reports', label: 'My Reports', icon: FileText },
];

const staffMenu = [{ to: '/staff', label: 'Assigned Orders', icon: ClipboardList, end: true }];

const adminMenu = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/tests', label: 'Manage Tests', icon: TestTube },
  { to: '/admin/users', label: 'Manage Users', icon: Users },
  { to: '/admin/orders', label: 'Manage Orders', icon: ClipboardList },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
];

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <DashboardLayout menu={patientMenu} title="Patient Dashboard" />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />
        <Route path="book-test" element={<BookTest />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="reports" element={<MyReports />} />
      </Route>

      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <DashboardLayout menu={staffMenu} title="Staff Dashboard" />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout menu={adminMenu} title="Admin Dashboard" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="tests" element={<ManageTests />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

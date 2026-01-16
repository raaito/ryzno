import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Academy from './pages/Academy';
import LecturerDashboard from './pages/LecturerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Academy Routes (Students and Lecturers) */}
          <Route
            path="/academy"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'LECTURER']}>
                <Academy />
              </ProtectedRoute>
            }
          />

          {/* Protected Lecturer Routes (Lecturers Only) */}
          <Route
            path="/academy/lecturer"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LecturerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

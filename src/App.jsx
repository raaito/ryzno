import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Academy from './pages/Academy';
import LecturerDashboard from './pages/LecturerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Soar from './pages/Soar';
import Restore from './pages/Restore';
import Roar from './pages/Roar';
import Contact from './pages/Contact';
import LecturerMessages from './pages/LecturerMessages';
import Welcome from './pages/Welcome';
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
          <Route path="/about" element={<About />} />
          <Route path="/soar" element={<Soar />} />
          <Route path="/restore" element={<Restore />} />
          <Route path="/roar" element={<Roar />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/welcome" element={<Welcome />} />

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
          <Route
            path="/academy/lecturer/messages"
            element={
              <ProtectedRoute allowedRoles={['LECTURER']}>
                <LecturerMessages />
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

// ...existing code...
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import './styles/App.css';

// added imports
import Education from './pages/Education';
import Experience from './pages/Experience';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Certifications from './pages/Certifications';
import SharedProfile from './pages/SharedProfile';
// ...existing code...
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* new profile detail routes */}
              <Route
                path="/profile/education"
                element={
                  <ProtectedRoute>
                    <Education />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/experience"
                element={
                  <ProtectedRoute>
                    <Experience />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/skills"
                element={
                  <ProtectedRoute>
                    <Skills />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/certifications"
                element={
                  <ProtectedRoute>
                    <Certifications />
                  </ProtectedRoute>
                }
              />
              {/* shareable read-only view (suitable for job applications) */}
              <Route path="/shared/:userId" element={<SharedProfile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
// ...existing code...
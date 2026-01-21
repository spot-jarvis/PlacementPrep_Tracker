import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Companies from './pages/Companies';
import Topics from './pages/Topics';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const { user, loading, login, logout } = useAuth();

  if (loading && user) return <div className="min-h-screen flex items-center justify-center italic text-slate-400">Loading...</div>;

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <Login onLogin={login} /> : <Navigate to="/" />} 
      />
      <Route 
        path="/signup" 
        element={!user ? <Signup /> : <Navigate to="/" />} 
      />
      <Route
        path="/*"
        element={
          user ? (
            <Layout user={user} onLogout={logout}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/topics" element={<Topics />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

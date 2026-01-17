import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Companies from './pages/Companies';
import Topics from './pages/Topics';
import Login from './pages/Login';
import api from './api';

function App() {
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session is still valid
    const checkAuth = async () => {
      try {
        const res = await api.get('tasks/'); // Simple unauthorized check
        if (res.status === 200) {
          // Sessions works, we are logged in
        }
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 401) {
          setUser(null);
          localStorage.removeItem('user');
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('user', username);
  };

  const handleLogout = async () => {
    try {
      await api.post('/accounts/logout/');
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading && user) return <div className="min-h-screen flex items-center justify-center italic text-slate-400">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        
        <Route
          path="/*"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/topics" element={<Topics />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

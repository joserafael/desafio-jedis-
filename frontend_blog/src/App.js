import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import ShowPost from './components/ShowPost';
import EditPost from './components/EditPost';
import PublicPostList from './components/PublicPostList';
import PublicShowPost from './components/PublicShowPost';
import Navbar from './components/Navbar';
import PublicNavbar from './components/PublicNavbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Root Route - Public Posts */}
          <Route path="/" element={
            <>
              <PublicNavbar />
              <PublicPostList />
            </>
          } />
          
          {/* Public Routes */}
          <Route path="/public/posts" element={
            <>
              <PublicNavbar />
              <PublicPostList />
            </>
          } />
          
          <Route path="/public/posts/:id" element={
            <>
              <PublicNavbar />
              <PublicShowPost />
            </>
          } />
          
          <Route path="/posts/:id" element={
            <>
              <PublicNavbar />
              <PublicShowPost />
            </>
          } />
          
          {/* Login Route */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          
          {/* Authenticated Routes */}
          <Route path="/*" element={
            <>
              {isAuthenticated && (
                <Navbar user={user} onLogout={handleLogout} />
              )}
              <Routes>
          
                <Route 
                  path="/dashboard" 
                  element={
                    isAuthenticated ? 
                    <Dashboard user={user} /> : 
                    <Navigate to="/login" />
                  } 
                />
                
                <Route 
                  path="/posts" 
                  element={
                    isAuthenticated ? 
                    <PostList /> : 
                    <Navigate to="/login" />
                  } 
                />
                
                <Route 
                  path="/create-post" 
                  element={
                    isAuthenticated ? 
                    <CreatePost /> : 
                    <Navigate to="/login" />
                  } 
                />
                
                <Route 
                  path="/posts/:id" 
                  element={
                    isAuthenticated ? 
                    <ShowPost /> : 
                    <Navigate to="/login" />
                  } 
                />
                
                <Route 
                  path="/posts/:id/edit" 
                  element={
                    isAuthenticated ? 
                    <EditPost /> : 
                    <Navigate to="/login" />
                  } 
                />
                
                <Route 
                  path="/admin" 
                  element={
                    isAuthenticated ? 
                    <Navigate to="/dashboard" /> : 
                    <Navigate to="/login" />
                  } 
                />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

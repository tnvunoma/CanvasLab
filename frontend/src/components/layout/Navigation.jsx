import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const Navigation = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <h1 className="nav-logo">CanvasLab</h1>
        <div className="nav-actions">
          <span className="nav-user">Welcome, {user?.username}</span>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
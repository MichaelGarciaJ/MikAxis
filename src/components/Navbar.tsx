import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <svg className="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4L20 20M4 20L20 4" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="2"/>
          </svg>
          <span className="logo-text">Mik<span className="accent">Axis</span></span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className={`menu-link ${location.pathname === '/' ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/reelmemo" className={`menu-link ${location.pathname.startsWith('/reelmemo') ? 'active' : ''}`}>
            ReelMemo
          </Link>
        </div>

        <div className="navbar-status">
          <div className="status-indicator">
            <span className="pulse-dot"></span>
            <span className="status-text">Online</span>
          </div>
          <div className="vertical-divider"></div>
          <div className="clock-widget">
            <span className="clock-date">{formatDate(time)}</span>
            <span className="clock-time">{formatTime(time)}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

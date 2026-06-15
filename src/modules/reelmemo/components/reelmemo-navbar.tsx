import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlayCircle, User } from 'lucide-react';

export const ReelMemoNavbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="rm-bottom-nav">
       <Link to="/reelmemo" className={`rm-nav-item ${location.pathname.replace(/\/$/, '') === '/reelmemo' ? 'active' : ''}`}>
         <Home size={24} />
         <span>Inicio</span>
       </Link>
       <Link to="/reelmemo/library" className={`rm-nav-item ${location.pathname.includes('/library') ? 'active' : ''}`}>
         <PlayCircle size={24} />
         <span>Vistos</span>
       </Link>
       <Link to="/perfil" className="rm-nav-item">
         <User size={24} />
         <span>Usuario</span>
       </Link>
    </nav>
  );
};

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronDown, UserRound, LogOut } from 'lucide-react';
import './Navbar.css';

/**
 * Barra de navegación principal del sistema.
 * Contiene el logo y el menú de perfil de usuario a la derecha.
 */
export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<{ nombre: string, foto: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              nombre: data.nombreUsuario || user.displayName || 'Usuario',
              foto: data.fotoUsuario || user.photoURL || ''
            });
          } else {
            setUserData({
              nombre: user.displayName || 'Usuario',
              foto: user.photoURL || ''
            });
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Cierra la sesión activa y redirige al usuario al login.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  /**
   * Extrae la inicial del nombre para usar como avatar alternativo.
   * @param name - Nombre del usuario
   * @returns La primera letra en mayúscula
   */
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
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

        {/* Menú central eliminado para dar foco al dashboard */}

        <div className="navbar-status" ref={dropdownRef}>
          {userData ? (
            <div className="profile-menu-container">
              <button 
                className="profile-button" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userData.foto ? (
                  <img src={userData.foto} alt="Perfil" className="profile-pic" />
                ) : (
                  <div className="profile-pic-placeholder">
                    {getInitials(userData.nombre)}
                  </div>
                )}
                <span className="profile-name">{userData.nombre}</span>
                <ChevronDown className={`chevron ${dropdownOpen ? 'open' : ''}`} size={16} />
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown animate-fade-in">
                  <Link to="/perfil" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <UserRound size={18} />
                    Mi Perfil / Configuración
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-button" onClick={handleLogout}>
                    <LogOut size={18} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="status-indicator">
              <span className="pulse-dot"></span>
              <span className="status-text">Cargando</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

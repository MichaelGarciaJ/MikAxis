import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardHome from './modules/dashboard/DashboardHome';
import ReelMemoHome from './modules/reelmemo/ReelMemoHome';
import AuthPage from './modules/auth/auth-page';
import ProfileHome from './modules/profile/ProfileHome';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

/**
 * Componente principal App que envuelve toda la aplicación con el Router.
 * Aquí se definen todas las rutas principales del sistema.
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Ruta pública para el inicio de sesión */}
          <Route path="/login" element={<AuthPage />} />
          
          {/* Rutas protegidas: el Muro de Privacidad envuelve tanto el Navbar como el contenido */}
          <Route path="/*" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/reelmemo" element={<ReelMemoHome />} />
                    <Route path="/perfil" element={<ProfileHome />} />
                    <Route path="/ajustes" element={<ProfileHome />} />
                  </Routes>
                </main>
              </>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

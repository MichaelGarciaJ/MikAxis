import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardHome from './modules/dashboard/DashboardHome';
import ReelMemoHome from './modules/reelmemo/ReelMemoHome';
import AuthPage from './modules/auth/auth-page';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

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

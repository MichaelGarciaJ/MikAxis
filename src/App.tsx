import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import DashboardHome from './modules/dashboard/dashboard-home';
import { ReelMemoPage } from './modules/reelmemo/reelmemo-page';
import AuthPage from './modules/auth/auth-page';
import ProfileHome from './modules/profile/profile-home';
import ProtectedRoute from './components/protected-route';
import './App.css';

/**
 * Layout interno que permite condicionalmente ocultar el Navbar en módulos inmersivos como ReelMemo.
 */
const AppLayout = () => {
  const location = useLocation();
  const isReelMemo = location.pathname.startsWith('/reelmemo');

  return (
    <ProtectedRoute>
      <>
        {!isReelMemo && <Navbar />}
        <main className={isReelMemo ? "reelmemo-main-content" : "main-content"}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/reelmemo/*" element={<ReelMemoPage />} />
            <Route path="/perfil" element={<ProfileHome />} />
            <Route path="/ajustes" element={<ProfileHome />} />
          </Routes>
        </main>
      </>
    </ProtectedRoute>
  );
};

/**
 * Componente principal App que envuelve toda la aplicación con el Router.
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

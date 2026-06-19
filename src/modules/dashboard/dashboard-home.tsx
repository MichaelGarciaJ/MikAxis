
import { Link } from 'react-router-dom';
import './dashboard-home.css';

/**
 * Componente DashboardHome.
 * Muestra el panel principal ("Centro de Mandos") con acceso a los diferentes módulos.
 */
export default function DashboardHome() {
  const modules = [
    {
      id: 'reelmemo',
      title: 'ReelMemo',
      description: 'Gestor de películas y series. Sincronizado con TMDB y registro de visualizaciones.',
      status: 'active', // can click
      icon: (
        <img src="/reelmemo-logo.png" alt="ReelMemo Logo" className="module-icon" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain' }} />
      ),
      path: '/reelmemo',
    },
    {
      id: 'birthday',
      title: 'Cumpleaños',
      description: 'Agenda de cumpleaños y recordatorios automáticos para no olvidar ninguna fecha especial.',
      status: 'pending', // coming soon
      icon: (
        <svg className="module-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 10a2 2 0 100-4 2 2 0 000 4z" fill="#94A3B8"/>
          <path d="M12 5V3M7 14v-2c0-.8.3-1.6.8-2.2L12 5l4.2 4.8c.5.6.8 1.4.8 2.2v2" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
          <rect x="5" y="14" width="14" height="7" rx="2" stroke="#94A3B8" strokeWidth="2"/>
          <line x1="9" y1="18" x2="15" y2="18" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      path: '#',
    },
    {
      id: 'notes',
      title: 'Notas Rápidas & Vídeos',
      description: 'Baúl digital para notas dinámicas, ideas sueltas y organización de enlaces multimedia.',
      status: 'pending', // coming soon
      icon: (
        <svg className="module-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 6h10M8 10h10M8 14h6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
          <rect x="4" y="3" width="16" height="18" rx="2" stroke="#94A3B8" strokeWidth="2"/>
        </svg>
      ),
      path: '#',
    }
  ];

  return (
    <div className="dashboard-home container animate-fade-in">
      <header className="dashboard-header">
        <span className="welcome-tag">CENTRO DE MANDOS</span>
        <h1 className="welcome-title">
          <span className="greeting-text">Bienvenido a </span>
          <span className="brand-text">Mik<span className="title-accent">Axis</span></span>
        </h1>
        <p className="welcome-subtitle">Tu portal privado y personal de herramientas unificadas.</p>
      </header>



      <main className="modules-section">
        <h2 className="section-title">Módulos del Sistema</h2>
        <div className="modules-grid">
          {modules.map((mod) => {
            const isActive = mod.status === 'active';
            
            const cardContent = (
              <>
                <div className="card-glowing-effect"></div>
                <div className="card-header">
                  <div className="icon-wrapper">
                    {mod.icon}
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{mod.title}</h3>
                  <p className="card-description">{mod.description}</p>
                </div>
                <div className="card-footer">
                  {isActive ? (
                    <span className="action-link">
                      Acceder Módulo 
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  ) : (
                    <span className="action-link disabled">
                      Próximamente
                    </span>
                  )}
                </div>
              </>
            );

            return isActive ? (
              <Link key={mod.id} to={mod.path} className={`module-card ${mod.status}`}>
                {cardContent}
              </Link>
            ) : (
              <div key={mod.id} className={`module-card ${mod.status}`}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

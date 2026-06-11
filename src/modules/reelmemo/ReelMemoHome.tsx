
import { Link } from 'react-router-dom';
import './ReelMemoHome.css';

export default function ReelMemoHome() {
  // Mock data for movies to make it look extremely high-fidelity
  const pendingMovies = [
    {
      id: 1,
      title: 'Interstellar',
      year: '2014',
      genre: 'Ciencia Ficción',
      rating: '9.2',
      imageBg: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
    },
    {
      id: 2,
      title: 'Dune: Part Two',
      year: '2024',
      genre: 'Ciencia Ficción / Aventura',
      rating: '8.8',
      imageBg: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
    },
    {
      id: 3,
      title: 'Spider-Man: Across the Spider-Verse',
      year: '2023',
      genre: 'Animación / Acción',
      rating: '9.0',
      imageBg: 'linear-gradient(135deg, #881337 0%, #4c0519 100%)',
    }
  ];

  return (
    <div className="reelmemo-home container animate-fade-in">
      {/* Back to Dashboard */}
      <Link to="/" className="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Volver al Centro de Mandos
      </Link>

      <header className="reelmemo-header">
        <div className="header-info">
          <span className="badge-fase">Fase 2: En Desarrollo</span>
          <h1 className="reelmemo-title">Reel<span className="accent">Memo</span></h1>
          <p className="reelmemo-subtitle">
            Tu baúl cinematográfico personal. Organiza, puntúa y lleva un registro de tus películas y series pendientes.
          </p>
        </div>
        <div className="migration-banner">
          <div className="migration-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5m14 0l-4-4m4 4l-4 4" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="migration-text">
            <h4>Próxima Migración</h4>
            <p>Migraremos el historial de visualizaciones desde Firestore & TMDB.</p>
          </div>
        </div>
      </header>

      {/* Feature Preview Section */}
      <section className="preview-section">
        <div className="section-header">
          <h3 className="section-title-cine">Vista Previa: Mi Lista</h3>
          <span className="section-count">3 items</span>
        </div>
        
        <div className="movie-grid">
          {pendingMovies.map((movie) => (
            <div key={movie.id} className="movie-card-cine">
              <div className="movie-poster" style={{ background: movie.imageBg }}>
                <div className="movie-overlay">
                  <span className="movie-rating">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    {movie.rating}
                  </span>
                  <div className="movie-actions">
                    <button className="icon-btn-cine" title="Marcar como vista">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="poster-content">
                  <span className="movie-genre">{movie.genre}</span>
                  <h4 className="movie-title-card">{movie.title}</h4>
                </div>
              </div>
              <div className="movie-meta">
                <span className="movie-year">{movie.year}</span>
                <span className="status-indicator-dot pending">Pendiente</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature locked message */}
      <section className="lock-overlay-panel">
        <div className="lock-content">
          <div className="lock-icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="#38BDF8" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="#38BDF8" strokeWidth="2"/>
            </svg>
          </div>
          <h3>Módulo en Preparación</h3>
          <p>
            Actualmente estamos adaptando los endpoints de TMDB e integrando las credenciales de Firebase Firestore para cargar tu catálogo completo de forma segura.
          </p>
          <div className="progress-container">
            <div className="progress-bar-label">
              <span>Progreso de desarrollo</span>
              <span>35%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: '35%' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

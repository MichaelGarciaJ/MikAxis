import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ReelMemoNavbar } from './components/reelmemo-navbar';
import { ReelMemoLibraryView } from './views/library-view';
import { ReelMemoSearchView } from './views/search-view';
import { ReelMemoHomeView } from './views/home-view';
import { ReelMemoDetailsView } from './views/details-view';
import { Search, LayoutDashboard } from 'lucide-react';
import './reelmemo.css';

/**
 * Componente contenedor y enrutador del módulo ReelMemo.
 */
export const ReelMemoPage: React.FC = () => {
    return (
        <div className="reelmemo-theme">
            <div className="rm-viewport">
                <div className="rm-top-bar">
                    <Link to="/" className="rm-back-button" title="Volver al Dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <LayoutDashboard size={20} />
                    </Link>
                    <Link to="/reelmemo" className="rm-app-title" style={{ textDecoration: 'none', color: 'inherit' }}>ReelMemo</Link>
                    <Link to="/reelmemo/search" className="rm-search-button">
                        <Search size={24} />
                    </Link>
                </div>
                
                <div className="rm-content-area">
                    <Routes>
                        <Route path="/" element={<ReelMemoHomeView />} />
                        <Route path="/library" element={<ReelMemoLibraryView />} />
                        <Route path="/search" element={<ReelMemoSearchView />} />
                        <Route path="/details/:type/:id" element={<ReelMemoDetailsView />} />
                    </Routes>
                </div>

                <ReelMemoNavbar />
            </div>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { mediaService } from '../../../data/service/media-service';
import { MediaEntity } from '../../../data/entity/media';
import { MediaGrid } from '../components/media-grid';
import { RmChip } from '../components/rm-chip';
import { auth } from '../../../config/firebase'; 
import { RmDialog } from '../components/rm-dialog';

/**
 * Vista de la Biblioteca (Vistos) de ReelMemo.
 * Muestra la lista personal del usuario filtrando por tipo (Película/Serie)
 * y estado (Terminado, Viendo, Pendiente).
 * 
 * @returns {JSX.Element} Vista de la Biblioteca
 */
export const ReelMemoLibraryView: React.FC = () => {
    const [library, setLibrary] = useState<MediaEntity[]>([]);
    const [currentTab, setCurrentTab] = useState('all');
    const [mediaFilter, setMediaFilter] = useState<'all'|'movie'|'tv'>('all');
    const [loading, setLoading] = useState(true);
    const [showStatusDialog, setShowStatusDialog] = useState(false);

    const userId = auth.currentUser?.uid; 

    useEffect(() => {
        if (!userId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false);
            return;
        }
        const unsubscribe = mediaService.getMediaLibrary(userId, (data) => {
            setLibrary(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [userId]);

    // handleStatusChange removido ya que MediaCard ahora navega a details

    const filteredLibrary = library.filter((item) => {
        const matchStatus = currentTab === 'all' || item.status === currentTab;
        const matchType = mediaFilter === 'all' || item.type === mediaFilter;
        return matchStatus && matchType;
    });

    const tabs = [
        { id: 'all', label: 'Todo' },
        { id: 'watched', label: 'Terminados' },
        { id: 'watching', label: 'Viendo' },
        { id: 'pending', label: 'Pendientes' },
    ];

    return (
        <div className="rm-view-container">
            <header className="rm-header">
                <h1>Mi Biblioteca</h1>
            </header>

            {showStatusDialog && (
                <RmDialog 
                    title="Estado de visualización"
                    options={tabs}
                    selectedId={currentTab}
                    onSelect={setCurrentTab}
                    onClose={() => setShowStatusDialog(false)}
                />
            )}

            <div className="rm-filter-section">
                <RmChip 
                    label="Películas" 
                    isActive={mediaFilter === 'movie'} 
                    onClick={() => setMediaFilter(mediaFilter === 'movie' ? 'all' : 'movie')} 
                />
                <RmChip 
                    label="Series" 
                    isActive={mediaFilter === 'tv'} 
                    onClick={() => setMediaFilter(mediaFilter === 'tv' ? 'all' : 'tv')} 
                />
                <RmChip 
                    label={tabs.find(t=>t.id===currentTab)?.label || 'Todo'} 
                    isActive={currentTab !== 'all'} 
                    onClick={() => setShowStatusDialog(true)} 
                    showDropdownIcon={true}
                />
            </div>

            {loading ? (
                <div className="rm-empty-state">Cargando tu biblioteca...</div>
            ) : !userId ? (
                <div className="rm-empty-state">Inicia sesión para ver tu biblioteca.</div>
            ) : filteredLibrary.length === 0 ? (
                <div className="rm-empty-state" style={{marginTop: '2rem'}}>
                    <p style={{color: 'var(--rm-text-muted)'}}>Aún no hay nada por aquí</p>
                </div>
            ) : (
                <MediaGrid items={filteredLibrary} />
            )}
        </div>
    );
};

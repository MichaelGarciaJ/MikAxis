import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mediaService, LibraryStatus } from '../../../data/service/media-service';
import { tmdbService } from '../../../data/service/tmdb-service';
import { MediaEntity } from '../../../data/entity/media';
import { auth } from '../../../config/firebase';
import { RmChip } from '../components/rm-chip';
import { ChevronLeft, Check, Bookmark, PlayCircle, X } from 'lucide-react';
import { useToast } from '../../../components/toast-context';

/**
 * Vista de detalles de una película o serie en ReelMemo.
 * Muestra información como resumen, episodios, reparto y contenido similar.
 * También permite agregar/eliminar de la biblioteca personal.
 */
export const ReelMemoDetailsView: React.FC = () => {
    const { type, id } = useParams<{ type: 'movie' | 'tv', id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const [media, setMedia] = useState<Partial<MediaEntity> | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [libraryStatus, setLibraryStatus] = useState<LibraryStatus>('none');
    const [watchedEpisodes, setWatchedEpisodes] = useState<Set<number>>(new Set());
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [activeTab, setActiveTab] = useState<'info' | 'episodes' | 'cast' | 'similar' | 'providers'>('info');
    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [episodes, setEpisodes] = useState<{id: number, name: string, episodeNumber: number, stillPath: string, runtime?: number, overview?: string}[]>([]);
    
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const loadDetails = async () => {
            if (!id || !type) return;
            setLoading(true);
            try {
                const [mediaData, statusData] = await Promise.all([
                    tmdbService.getDetails(id, type),
                    userId ? mediaService.getMediaStatus(userId, id) : Promise.resolve({ status: 'none' as LibraryStatus, watchedEpisodes: new Set<number>() })
                ]);
                
                setMedia(mediaData);
                if (statusData) {
                    setLibraryStatus(statusData.status);
                    setWatchedEpisodes(statusData.watchedEpisodes);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadDetails();
    }, [id, type, userId]);

    useEffect(() => {
        if (activeTab === 'episodes' && type === 'tv' && id) {
            tmdbService.getSeasonEpisodes(id, selectedSeason).then(data => {
                setEpisodes(data as {id: number, name: string, episodeNumber: number, stillPath: string, runtime?: number, overview?: string}[]);
            });
        }
    }, [activeTab, selectedSeason, id, type]);

    /**
     * Maneja la adición o eliminación de la obra en la biblioteca del usuario.
     * @param newStatus - El estado a aplicar ('watched' | 'pending')
     */
    const handleToggleStatus = async (newStatus: 'watched' | 'pending') => {
        if (!media || !id || !userId || isProcessing) return;
        setIsProcessing(true);
        
        try {
            if (libraryStatus === newStatus) {
                await mediaService.removeFromLibrary(userId, id);
                setLibraryStatus('none');
                setWatchedEpisodes(new Set());
                showToast('Eliminado de tu biblioteca', 'info');
            } else {
                await mediaService.saveToLibrary(userId, media, newStatus);
                setLibraryStatus(newStatus);
                showToast(newStatus === 'watched' ? 'Marcado como visto' : 'Añadido a pendientes', 'success');
            }
        } catch (error) {
            console.error(error);
            showToast('Error al actualizar la biblioteca', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Marca o desmarca un episodio específico como visto.
     * @param episodeId - ID del episodio en TMDB
     */
    const handleToggleEpisode = async (episodeId: number) => {
        if (!userId || !id || !media) return;
        
        const isWatched = watchedEpisodes.has(episodeId);
        const newWatched = new Set(watchedEpisodes);
        if (isWatched) newWatched.delete(episodeId);
        else newWatched.add(episodeId);
        
        setWatchedEpisodes(newWatched);
        
        if (!isWatched && libraryStatus !== 'watched') {
            setLibraryStatus('watching');
        }

        await mediaService.toggleEpisodeWatched(userId, id, episodeId, !isWatched, media);
        showToast(!isWatched ? 'Episodio marcado como visto' : 'Episodio desmarcado', 'success');
    };

    if (loading) return <div className="rm-empty-state">Cargando detalles...</div>;
    if (!media) return <div className="rm-empty-state">No se encontró información.</div>;

    return (
        <div className="rm-details-container">
            <div 
                className="rm-details-backdrop"
                style={{ backgroundImage: `url(${media.backdropUrl || media.imageUrl})` }}
            >
                <div className="rm-details-overlay" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
                    <button onClick={() => navigate(-1)} className="rm-back-icon-btn">
                        <ChevronLeft size={28} />
                    </button>
                    <button onClick={() => navigate('/reelmemo')} className="rm-back-icon-btn">
                        <X size={28} />
                    </button>
                </div>
            </div>

            <div className="rm-details-content">
                <div className="rm-details-header">
                    <img src={media.imageUrl} alt={media.title} className="rm-details-poster" />
                    <div className="rm-details-title-area">
                        <h1 className="rm-details-title">{media.title}</h1>
                        <span className="rm-details-type">
                            {media.type === 'movie' ? 'Película' : 'Serie'}
                        </span>
                        {media.type === 'tv' && (
                            <span className="rm-details-stats">
                                {media.seasons} Temporadas • {media.episodes} Eps.
                            </span>
                        )}
                    </div>
                </div>

                {media.genres && media.genres.length > 0 && (
                    <div className="rm-details-genres">
                        {media.genres.map(genre => (
                            <RmChip key={genre} label={genre} variant="genre" />
                        ))}
                    </div>
                )}

                <div className="rm-details-actions">
                    <button 
                        className={`rm-action-btn ${libraryStatus === 'watched' ? 'active-watched' : ''}`}
                        onClick={() => handleToggleStatus('watched')}
                        disabled={isProcessing}
                    >
                        <Check size={20} />
                        {libraryStatus === 'watched' ? 'Terminada' : 'Ya la vi'}
                    </button>
                    
                    <button 
                        className={`rm-action-btn ${libraryStatus === 'pending' || libraryStatus === 'watching' ? 'active-pending' : ''}`}
                        onClick={() => handleToggleStatus('pending')}
                        disabled={isProcessing || libraryStatus === 'watching'}
                    >
                        <Bookmark size={20} />
                        {libraryStatus === 'watching' ? 'Viendo...' : (libraryStatus === 'pending' ? 'En lista' : 'Pendiente')}
                    </button>
                </div>

                {/* TABS */}
                <div className="rm-details-tabs">
                    <button className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>Info</button>
                    {media.type === 'tv' && (
                        <button className={activeTab === 'episodes' ? 'active' : ''} onClick={() => setActiveTab('episodes')}>Episodios</button>
                    )}
                    <button className={activeTab === 'cast' ? 'active' : ''} onClick={() => setActiveTab('cast')}>Reparto</button>
                    <button className={activeTab === 'similar' ? 'active' : ''} onClick={() => setActiveTab('similar')}>Similares</button>
                    {media.watchProviders && media.watchProviders.length > 0 && (
                        <button className={activeTab === 'providers' ? 'active' : ''} onClick={() => setActiveTab('providers')}>Plataformas</button>
                    )}
                </div>

                {/* TAB CONTENT */}
                {activeTab === 'info' && (
                    <>
                        <div className="rm-details-section">
                            <h3>Sinopsis</h3>
                            <p className="rm-details-overview">{media.overview}</p>
                        </div>
                        {media.alternativeTitles && media.alternativeTitles.length > 0 && (
                            <div className="rm-alt-titles-container">
                                <p><strong>También conocida como:</strong></p>
                                <p className="rm-alt-titles">{media.alternativeTitles.join(' • ')}</p>
                            </div>
                        )}
                        <div className="rm-details-meta">
                            <p><strong>Fecha de estreno:</strong> {media.releaseDate}</p>
                        </div>
                    </>
                )}

                {activeTab === 'episodes' && media.type === 'tv' && (
                    <div className="rm-details-section">
                        <div className="rm-season-selector">
                            <select 
                                value={selectedSeason} 
                                onChange={e => setSelectedSeason(Number(e.target.value))}
                                className="rm-season-select"
                            >
                                {media.seasonsList?.map(season => (
                                    <option key={season.id} value={season.seasonNumber}>
                                        {season.name} ({season.episodeCount} eps)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="rm-episodes-list">
                            {episodes.map(ep => {
                                const isWatched = watchedEpisodes.has(ep.id);
                                return (
                                    <div key={ep.id} className="rm-episode-item" onClick={() => handleToggleEpisode(ep.id)}>
                                        <div className="rm-episode-img">
                                            {ep.stillPath ? (
                                                <img src={ep.stillPath} alt={ep.name} />
                                            ) : (
                                                <div className="rm-episode-placeholder"><PlayCircle size={32} /></div>
                                            )}
                                        </div>
                                        <div className="rm-episode-info">
                                            <h4>{ep.episodeNumber}. {ep.name}</h4>
                                            <p className="rm-episode-runtime">{ep.runtime ? `${ep.runtime} min` : ''}</p>
                                            {ep.overview && <p className="rm-episode-overview">{ep.overview}</p>}
                                        </div>
                                        <button className={`rm-episode-check ${isWatched ? 'watched' : ''}`}>
                                            <Check size={18} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'cast' && (
                    <div className="rm-details-section">
                        <div className="rm-cast-grid">
                            {media.cast?.map(actor => (
                                <div key={actor.id} className="rm-cast-item">
                                    <img src={actor.profilePath || 'https://via.placeholder.com/185x278?text=No+Image'} alt={actor.name} />
                                    <p className="rm-cast-name">{actor.name}</p>
                                    <p className="rm-cast-char">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'similar' && (
                    <div className="rm-details-section">
                        <div className="rm-similar-grid">
                            {media.recommendations?.map(rec => (
                                <Link key={rec.id} to={`/reelmemo/details/${rec.type}/${rec.id}`} className="rm-similar-item">
                                    <img src={rec.imageUrl} alt={rec.title} />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'providers' && media.watchProviders && (
                    <div className="rm-details-section">
                        <h3>Disponible para ver en España:</h3>
                        <div className="rm-providers-grid">
                            {media.watchProviders.map(provider => (
                                <div key={provider.name} className="rm-provider-item">
                                    <img src={provider.logo} alt={provider.name} />
                                    <p>{provider.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

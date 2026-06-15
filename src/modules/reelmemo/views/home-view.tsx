import React, { useState, useEffect } from 'react';
import { tmdbService } from '../../../data/service/tmdb-service';
import { MediaEntity } from '../../../data/entity/media';
import { FeaturedReel } from '../components/featured-reel';
import { RmChip } from '../components/rm-chip';
import { RmDialog } from '../components/rm-dialog';
import { TMDB_GENRES } from '../constants/genres';
import { Link } from 'react-router-dom';

/**
 * Vista Principal del Home de ReelMemo.
 * Se encarga de cargar y mostrar los carruseles dinámicos consumiendo la API de TMDB.
 * Replica el comportamiento del home original con cartelera destacada y scroll horizontal.
 * 
 * @returns {JSX.Element} Vista del Home
 */
export const ReelMemoHomeView: React.FC = () => {
    const [trendingMovies, setTrendingMovies] = useState<Partial<MediaEntity>[]>([]);
    const [trendingTV, setTrendingTV] = useState<Partial<MediaEntity>[]>([]);
    const [nowPlaying, setNowPlaying] = useState<Partial<MediaEntity>[]>([]);
    const [topRatedMovies, setTopRatedMovies] = useState<Partial<MediaEntity>[]>([]);
    const [topRatedTV, setTopRatedTV] = useState<Partial<MediaEntity>[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'movie' | 'tv'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            let moviesData: Partial<MediaEntity>[];
            let tvData: Partial<MediaEntity>[];

            if (selectedCategory !== 'all') {
                [moviesData, tvData] = await Promise.all([
                    tmdbService.discoverByGenre('movie', selectedCategory),
                    tmdbService.discoverByGenre('tv', selectedCategory)
                ]);
            } else {
                [moviesData, tvData] = await Promise.all([
                    tmdbService.getTrending('movie'),
                    tmdbService.getTrending('tv')
                ]);
            }
            
            setTrendingMovies(moviesData);
            setTrendingTV(tvData);

            // Secondary loading (in background)
            const [nowPlayingData, topMoviesData, topTVData] = await Promise.all([
                tmdbService.getNowPlaying(),
                tmdbService.getTopRated('movie'),
                tmdbService.getTopRated('tv')
            ]);
            
            setNowPlaying(nowPlayingData);
            setTopRatedMovies(topMoviesData);
            setTopRatedTV(topTVData);
            setLoading(false);
        };
        fetchHomeData();
    }, [selectedCategory]);

    if (loading) {
        return <div className="rm-empty-state">Cargando cartelera...</div>;
    }

    let featuredMedia = null;
    if (activeFilter === 'movie' && trendingMovies.length > 0) featuredMedia = trendingMovies[0];
    else if (activeFilter === 'tv' && trendingTV.length > 0) featuredMedia = trendingTV[0];
    else if (trendingMovies.length > 0) featuredMedia = trendingMovies[0];

    const currentCategoryName = TMDB_GENRES.find(g => g.id === selectedCategory)?.name || "Categorías";
    const isCustomCategory = selectedCategory !== 'all';

    const movieTitle = isCustomCategory ? `Películas de ${currentCategoryName}` : "Películas en tendencia";
    const tvTitle = isCustomCategory ? `Series de ${currentCategoryName}` : "Series populares";

    const genreTopMovies = isCustomCategory ? [...trendingMovies].sort((a, b) => (b.rating || 0) - (a.rating || 0)) : [];
    const genreTopTV = isCustomCategory ? [...trendingTV].sort((a, b) => (b.rating || 0) - (a.rating || 0)) : [];
    const genreRecentMovies = isCustomCategory ? [...trendingMovies].reverse() : [];
    const genreRecentTV = isCustomCategory ? [...trendingTV].reverse() : [];

    return (
        <div className="rm-view-container">
            {showCategoryDialog && (
                <RmDialog 
                    title="Filtra por Categoría"
                    options={TMDB_GENRES.map(g => ({ id: g.id, label: g.name }))}
                    selectedId={selectedCategory}
                    onSelect={setSelectedCategory}
                    onClose={() => setShowCategoryDialog(false)}
                />
            )}

            <div className="rm-filter-section">
                <RmChip 
                    label="Películas" 
                    isActive={activeFilter === 'movie'} 
                    onClick={() => setActiveFilter(activeFilter === 'movie' ? 'all' : 'movie')} 
                />
                <RmChip 
                    label="Series" 
                    isActive={activeFilter === 'tv'} 
                    onClick={() => setActiveFilter(activeFilter === 'tv' ? 'all' : 'tv')} 
                />
                <RmChip 
                    label={currentCategoryName} 
                    isActive={selectedCategory !== 'all'} 
                    onClick={() => setShowCategoryDialog(true)} 
                    showDropdownIcon={true}
                />
            </div>
            
            {featuredMedia && <FeaturedReel data={featuredMedia} />}

            {/* --- VISTA: TODO --- */}
            {activeFilter === 'all' && (
                <>
                    {trendingMovies.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>{movieTitle}</h3>
                            <div className="rm-carousel">
                                {trendingMovies.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                    {trendingTV.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>{tvTitle}</h3>
                            <div className="rm-carousel">
                                {trendingTV.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {isCustomCategory && genreTopMovies.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>Joyas de {currentCategoryName}</h3>
                            <div className="rm-carousel">
                                {genreTopMovies.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                    {isCustomCategory && genreTopTV.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>Series Top de {currentCategoryName}</h3>
                            <div className="rm-carousel">
                                {genreTopTV.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {!isCustomCategory && nowPlaying.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>En Cines Ahora Mismo</h3>
                            <div className="rm-carousel">
                                {nowPlaying.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                    {!isCustomCategory && topRatedTV.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>Series Aclamadas por la Crítica</h3>
                            <div className="rm-carousel">
                                {topRatedTV.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                    {!isCustomCategory && topRatedMovies.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>Joyas del Cine</h3>
                            <div className="rm-carousel">
                                {topRatedMovies.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* --- VISTA: SOLO PELÍCULAS --- */}
            {activeFilter === 'movie' && (
                <>
                    {trendingMovies.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>{movieTitle}</h3>
                            <div className="rm-carousel">
                                {trendingMovies.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {isCustomCategory && genreTopMovies.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>Las Mejor Valoradas en {currentCategoryName}</h3>
                            <div className="rm-carousel">
                                {genreTopMovies.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                    {isCustomCategory && genreRecentMovies.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>Para maratonear hoy</h3>
                            <div className="rm-carousel">
                                {genreRecentMovies.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {!isCustomCategory && nowPlaying.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>Actualmente en Cines</h3>
                            <div className="rm-carousel">
                                {nowPlaying.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                    {!isCustomCategory && topRatedMovies.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>Las Mejor Valoradas Históricamente</h3>
                            <div className="rm-carousel">
                                {topRatedMovies.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* --- VISTA: SOLO SERIES --- */}
            {activeFilter === 'tv' && (
                <>
                    {trendingTV.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>{tvTitle}</h3>
                            <div className="rm-carousel">
                                {trendingTV.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {isCustomCategory && genreTopTV.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>Aclamadas en {currentCategoryName}</h3>
                            <div className="rm-carousel">
                                {genreTopTV.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                    {isCustomCategory && genreRecentTV.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>Descubre nuevas series</h3>
                            <div className="rm-carousel">
                                {genreRecentTV.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {!isCustomCategory && topRatedTV.length > 0 && (
                        <section className="rm-carousel-section">
                            <h3>Clásicos Inolvidables de TV</h3>
                            <div className="rm-carousel">
                                {topRatedTV.slice(0, 15).map((item) => (
                                    <Link key={item.id} to={`/reelmemo/details/${item.type}/${item.id}`} className="rm-carousel-item">
                                        <img src={item.imageUrl} alt={item.title} className="rm-carousel-poster" loading="lazy" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};

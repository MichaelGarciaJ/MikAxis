import React, { useState, useEffect } from 'react';
import { tmdbService } from '../../../data/service/tmdb-service';
import { MediaEntity } from '../../../data/entity/media';
import { MediaGrid } from '../components/media-grid'; 

export const ReelMemoSearchView: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Partial<MediaEntity>[]>([]);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.trim().length > 2) {
                try {
                    const results = await tmdbService.searchMulti(searchQuery);
                    setSearchResults(results);
                } catch (error) {
                    console.error("Error searching TMDB:", error);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);



    return (
        <div className="rm-view-container">
            <header className="rm-header">
                <h1>Buscar</h1>
                <input 
                    type="text" 
                    placeholder="Película, serie o actor..." 
                    className="rm-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </header>

            {searchQuery.trim().length > 2 ? (
                <div className="rm-search-results-section">
                    <MediaGrid items={searchResults as MediaEntity[]} />
                </div>
            ) : (
                <div className="rm-empty-state">Busca tus películas y series favoritas en la base de datos mundial de TMDB.</div>
            )}
        </div>
    );
};

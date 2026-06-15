import { TMDB_CONFIG } from '../../config/tmdb';
import { MediaEntity } from '../entity/media';

/**
 * Servicio encargado de la comunicación con la API de The Movie Database (TMDB).
 * Incluye mapeo de datos al formato interno `MediaEntity`.
 */
export const tmdbService = {
    /**
     * Mapea un objeto crudo de TMDB a la entidad interna MediaEntity.
     * @param item - Objeto crudo de la API
     * @param type - Tipo forzado si la API no lo provee ('movie' o 'tv')
     * @returns {Partial<MediaEntity>} Entidad formateada
     */
    _mapItem(item: Record<string, unknown>, type?: 'movie' | 'tv'): Partial<MediaEntity> {
        const mediaType = (item.media_type as string) || type || 'movie';
        return {
            id: String(item.id || `error-${Math.random()}`),
            title: (item.title || item.name || "Sin título") as string,
            overview: (item.overview || "") as string,
            imageUrl: item.poster_path ? `${TMDB_CONFIG.IMAGE_BASE_URL}/w500${item.poster_path}` : "",
            backdropUrl: item.backdrop_path ? `${TMDB_CONFIG.IMAGE_BASE_URL}/original${item.backdrop_path}` : "",
            rating: (item.vote_average as number) || 0,
            releaseDate: (item.release_date || item.first_air_date || "") as string,
            type: mediaType as 'movie' | 'tv'
        };
    },

    /**
     * Obtiene las tendencias (Trending) del día.
     * @param type - Tipo de contenido a buscar
     * @returns {Promise<Partial<MediaEntity>[]>} Lista de tendencias
     */
    async getTrending(type: 'movie' | 'tv' | 'all' = 'all'): Promise<Partial<MediaEntity>[]> {
        try {
            const response = await fetch(`${TMDB_CONFIG.BASE_URL}/trending/${type}/day?api_key=${TMDB_CONFIG.API_KEY}&language=${TMDB_CONFIG.LANG}`);
            const data = await response.json();
            return data.results.map((item: Record<string, unknown>) => this._mapItem(item));
        } catch (error) {
            console.error("[ERROR] getTrending:", error);
            return [];
        }
    },

    /**
     * Obtiene películas actualmente en cartelera (Now Playing).
     * @returns {Promise<Partial<MediaEntity>[]>} Lista de películas
     */
    async getNowPlaying(): Promise<Partial<MediaEntity>[]> {
        try {
            const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/now_playing?api_key=${TMDB_CONFIG.API_KEY}&language=${TMDB_CONFIG.LANG}&page=1`);
            const data = await response.json();
            return data.results.map((item: Record<string, unknown>) => this._mapItem(item, 'movie'));
        } catch (error) {
            console.error("[ERROR] getNowPlaying:", error);
            return [];
        }
    },

    /**
     * Obtiene los mejor valorados (Top Rated) de un tipo específico.
     * @param type - Tipo de contenido ('movie' o 'tv')
     * @returns {Promise<Partial<MediaEntity>[]>} Lista de los mejor valorados
     */
    async getTopRated(type: 'movie' | 'tv'): Promise<Partial<MediaEntity>[]> {
        try {
            const response = await fetch(`${TMDB_CONFIG.BASE_URL}/${type}/top_rated?api_key=${TMDB_CONFIG.API_KEY}&language=${TMDB_CONFIG.LANG}&page=1`);
            const data = await response.json();
            return data.results.map((item: Record<string, unknown>) => this._mapItem(item, type));
        } catch (error) {
            console.error(`[ERROR] getTopRated (${type}):`, error);
            return [];
        }
    },

    async discoverByGenre(type: 'movie' | 'tv', genreId: string): Promise<Partial<MediaEntity>[]> {
        try {
            const response = await fetch(`${TMDB_CONFIG.BASE_URL}/discover/${type}?api_key=${TMDB_CONFIG.API_KEY}&language=${TMDB_CONFIG.LANG}&with_genres=${genreId}&sort_by=popularity.desc`);
            const data = await response.json();
            return data.results.map((item: Record<string, unknown>) => this._mapItem(item, type));
        } catch (error) {
            console.error(`[ERROR] discoverByGenre (${type}):`, error);
            return [];
        }
    },

    /**
     * Busca contenido por término o consulta de texto.
     * @param query - Texto a buscar
     * @returns {Promise<Partial<MediaEntity>[]>} Resultados de la búsqueda
     */
    async searchMulti(query: string): Promise<Partial<MediaEntity>[]> {
        if (!query.trim()) return [];
        try {
            const response = await fetch(`${TMDB_CONFIG.BASE_URL}/search/multi?api_key=${TMDB_CONFIG.API_KEY}&query=${encodeURIComponent(query)}&language=${TMDB_CONFIG.LANG}`);
            const data = await response.json();
            return data.results
                .filter((item: Record<string, unknown>) => item.media_type !== "person")
                .map((item: Record<string, unknown>) => this._mapItem(item));
        } catch (error) {
            console.error("[ERROR] searchMulti:", error);
            return [];
        }
    },

    /**
     * Obtiene la lista de episodios de una temporada específica de una serie.
     * @param tvId - ID de la serie
     * @param seasonNumber - Número de la temporada
     * @returns {Promise<Record<string, unknown>[]>} Lista de episodios
     */
    async getSeasonEpisodes(tvId: string, seasonNumber: number): Promise<Record<string, unknown>[]> {
        try {
            const response = await fetch(`${TMDB_CONFIG.BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_CONFIG.API_KEY}&language=${TMDB_CONFIG.LANG}`);
            const data = await response.json();
            return data.episodes?.map((e: Record<string, unknown>) => ({
                id: e.id,
                name: e.name,
                episodeNumber: e.episode_number,
                overview: e.overview,
                runtime: e.runtime,
                stillPath: e.still_path ? `${TMDB_CONFIG.IMAGE_BASE_URL}/w300${e.still_path}` : ""
            })) || [];
        } catch (error) {
            console.error("[ERROR] getSeasonEpisodes:", error);
            return [];
        }
    },

    /**
     * Obtiene todos los detalles de una obra (película o serie), incluyendo reparto y recomendaciones.
     * @param id - ID de la obra en TMDB
     * @param type - Tipo ('movie' o 'tv')
     * @returns {Promise<Partial<MediaEntity> | null>} Entidad enriquecida o null si falla
     */
    async getDetails(id: string, type: 'movie' | 'tv'): Promise<Partial<MediaEntity> | null> {
        try {
            const response = await fetch(`${TMDB_CONFIG.BASE_URL}/${type}/${id}?api_key=${TMDB_CONFIG.API_KEY}&language=${TMDB_CONFIG.LANG}&append_to_response=credits,recommendations,watch/providers,alternative_titles`);
            if (!response.ok) return null;
            const data = await response.json();
            
            const mapped = this._mapItem(data, type);
            
            const esProviders = data["watch/providers"]?.results?.ES;
            if (esProviders) {
                const combined = [
                    ...(esProviders.flatrate || []),
                    ...(esProviders.free || []),
                    ...(esProviders.ads || [])
                ];
                const unique = Array.from(new Map(combined.map(p => [p.provider_id, p])).values());
                mapped.watchProviders = unique.map(p => ({
                    name: p.provider_name as string,
                    logo: `${TMDB_CONFIG.IMAGE_BASE_URL}/w92${p.logo_path}`
                }));
            } else {
                mapped.watchProviders = [];
            }

            const altTitlesData = type === 'movie' ? data.alternative_titles?.titles : data.alternative_titles?.results;
            if (altTitlesData) {
                const relevantCountries = ['ES', 'MX', 'US', 'GB', 'JP'];
                let filteredTitles = altTitlesData.filter((t: Record<string, unknown>) => relevantCountries.includes(t.iso_3166_1 as string));
                if (filteredTitles.length === 0) filteredTitles = altTitlesData;
                mapped.alternativeTitles = Array.from(new Set(filteredTitles.map((t: Record<string, unknown>) => t.title as string)))
                    .filter(t => t !== mapped.title)
                    .slice(0, 5) as string[];
            } else {
                mapped.alternativeTitles = [];
            }

            mapped.recommendations = data.recommendations?.results?.map((r: Record<string, unknown>) => this._mapItem(r, type)) || [];
            
            if (type === 'tv') {
                mapped.seasonsList = data.seasons?.map((s: Record<string, unknown>) => ({
                    id: s.id as number,
                    name: s.name as string,
                    seasonNumber: s.season_number as number,
                    episodeCount: s.episode_count as number
                })) || [];
                mapped.seasons = data.number_of_seasons;
                mapped.episodes = data.number_of_episodes;
            }
            
            mapped.genres = data.genres?.map((g: {name: string}) => g.name) || [];
            mapped.cast = data.credits?.cast?.slice(0, 10).map((c: Record<string, unknown>) => ({
                id: c.id as number,
                name: c.name as string,
                character: c.character as string,
                profilePath: c.profile_path ? `${TMDB_CONFIG.IMAGE_BASE_URL}/w185${c.profile_path}` : ""
            })) || [];

            return mapped;
        } catch (error) {
            console.error(`[ERROR] getDetails:`, error);
            return null;
        }
    }
};

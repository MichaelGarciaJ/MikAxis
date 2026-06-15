import { FieldValue } from 'firebase/firestore';

export interface MediaEntity {
    id?: string;
    title: string;
    imageUrl: string;
    backdropUrl?: string;
    type: 'movie' | 'tv';
    status: 'watched' | 'pending' | 'watching' | 'none';
    updatedAt?: FieldValue; // Representa el Timestamp de Firebase Firestore
    overview?: string;
    genres?: string[];
    seasons?: number;
    episodes?: number;
    releaseDate?: string;
    rating?: number;
    cast?: { id: number, name: string, character: string, profilePath: string }[];
    recommendations?: Partial<MediaEntity>[];
    watchProviders?: { name: string, logo: string }[];
    alternativeTitles?: string[];
    seasonsList?: { id: number, name: string, seasonNumber: number, episodeCount: number }[];
}

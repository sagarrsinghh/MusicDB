import api from './api';

export interface Artist {
    id: number;
    spotify_id: string;
    name: string;
    image_url: string;
    genres: string[];
    popularity: number;
    songs: Song[];
}

export interface Song {
    id: number;
    title: string;
    album_name: string;
    album_image: string;
    duration_ms: number;
    release_date: string;
    average_rating: number;
}

export const artistService = {
    getById: async (id: string): Promise<Artist> => {
        const response = await api.get(`/artists/${id}`);
        return response.data;
    },
    getAll: async (): Promise<Artist[]> => {
        const response = await api.get('/artists');
        return response.data;
    }
};

import api from './api';

export const songService = {
    search: async (query: string) => {
        const response = await api.get(`/songs/search?q=${query}`);
        return response.data;
    },
    getSongById: async (id: string) => {
        const response = await api.get(`/songs/${id}`);
        return response.data;
    },
    getArtistById: async (id: string) => {
        const response = await api.get(`/artists/${id}`);
        return response.data;
    },
    getTopRated: async () => {
        const response = await api.get('/songs/top');
        return response.data;
    },
    getTop50: async () => {
        const response = await api.get('/songs/top50');
        return response.data;
    },

    getTrending: async () => {
        const response = await api.get('/songs/trending');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/songs/${id}`);
        return response.data;
    },
    getByGenre: async (genre: string) => {
        const response = await api.get(`/songs/genre/${genre}`);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/songs');
        return response.data;
    }
};

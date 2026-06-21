import api from './api';

export const favoriteService = {
    toggle: async (songId: number) => {
        const response = await api.post(`/favorites/toggle/${songId}`);
        return response.data;
    },
    getFavorites: async () => {
        const response = await api.get('/favorites');
        return response.data;
    },
    checkIsLiked: async (songId: number) => {
        const response = await api.get(`/favorites/check/${songId}`);
        return response.data;
    },
    updateVisibility: async (isPublic: boolean) => {
        const response = await api.patch('/favorites/visibility', { isPublic });
        return response.data;
    }
};

import api from './api';

export const ratingService = {
    create: async (songId: number, value: number) => {
        const response = await api.post('/ratings', { songId, value });
        return response.data;
    },
    findBySong: async (songId: string) => {
        const response = await api.get(`/ratings/song/${songId}`);
        return response.data;
    },
    getMyRatings: async () => {
        const response = await api.get('/ratings/my');
        return response.data;
    }
};

export const reviewService = {
    create: async (songId: number, comment: string) => {
        const response = await api.post('/reviews', { songId, comment });
        return response.data;
    },
    findBySong: async (songId: string) => {
        const response = await api.get(`/reviews/song/${songId}`);
        return response.data;
    },
    getMyReviews: async () => {
        const response = await api.get('/reviews/my');
        return response.data;
    }
};

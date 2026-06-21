import api from './api';

export const communityService = {
    getFeed: async () => {
        const response = await api.get('/community/feed');
        return response.data;
    },
    toggleLike: async (reviewId: number) => {
        const response = await api.post(`/reviews/${reviewId}/like`);
        return response.data;
    }
};

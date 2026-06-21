import api from './api';

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    profile_image: string | null;
    created_at: string;
    badges?: Array<{
        id: string;
        name: string;
        description: string;
        icon: string;
        color: string;
    }>;
    followed_artists?: any[];
}

export const userService = {
    getProfile: async (): Promise<UserProfile> => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (data: { name?: string; bio?: string; profile_image?: string }) => {
        const response = await api.put('/users/profile', data);
        return response.data;
    },

    followArtist: async (artistId: number) => {
        const response = await api.post(`/users/follow/${artistId}`);
        return response.data;
    },

    unfollowArtist: async (artistId: number) => {
        const response = await api.delete(`/users/unfollow/${artistId}`);
        return response.data;
    },

    getFollowing: async () => {
        const response = await api.get('/users/following');
        return response.data;
    }
};

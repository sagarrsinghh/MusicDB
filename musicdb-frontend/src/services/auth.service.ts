import api from './api';
import Cookies from 'js-cookie';

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.access_token) {
            // Store in Cookie for Middleware access (expires in 7 days)
            // path: '/' ensures it's available on all routes
            Cookies.set('token', response.data.access_token, { expires: 7, path: '/' });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    logout: () => {
        Cookies.remove('token', { path: '/' });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/welcome'; // Force redirect to landing
    },
    getCurrentUser: () => {
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        return userStr ? JSON.parse(userStr) : null;
    },
    isAuthenticated: () => {
        return !!Cookies.get('token');
    }
};

import axios from 'axios';
import Cookies from 'js-cookie';

const inferredBaseURL =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:4000`
        : 'http://localhost:4000');

const api = axios.create({
    baseURL: inferredBaseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    // Check Cookies first, then fallback to LocalStorage
    const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, token ? 'Token found' : 'No token', 'baseURL:', config.baseURL);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 Unauthorized errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error(
                '[API Error] Network or CORS failure:',
                error.message,
                'URL:',
                error.config?.url,
                'baseURL:',
                error.config?.baseURL,
            );
            return Promise.reject(
                new Error(
                    'Unable to reach the backend server. Please make sure the MusicDB backend is running on http://localhost:4000.',
                ),
            );
        }
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
            console.error('[API Error] Unauthorized (401). Clearing session and redirecting.');
            Cookies.remove('token', { path: '/' });
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/welcome';
            }
        }
        return Promise.reject(error);
    },
);




export default api;

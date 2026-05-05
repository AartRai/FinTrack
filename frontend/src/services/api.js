import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => response, (error) => {
    const { response, config } = error;
    
    // If it's a 401 error and not a login/register request
    if (response?.status === 401 && !config.url.includes('/login') && !config.url.includes('/register')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        
        // Only redirect if we're not already on the login page to avoid loops
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export default api;

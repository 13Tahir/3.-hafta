import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    if (userInfo && userInfo.token) {
        config.headers.authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

export default api;

//frontend/api/axiosInstance.js
import axios from 'axios';
import { SERVER_URL } from '../constants';

const api = axios.create({
    baseURL: `${SERVER_URL}/api`, // Uses the correct base API URL
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000 // Timeout set to prevent long waits
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        console.log('📡 Sending request:', config);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ API Error:', error);
        return Promise.reject(error);
    }
);

export default api;

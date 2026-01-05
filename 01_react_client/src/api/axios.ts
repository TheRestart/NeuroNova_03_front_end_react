import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create Axios Instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request Interceptor (Auto-attach JWT)
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken'); // Note: 00_test_client used 'access_token', 01_react_client uses 'accessToken' (based on authStore.ts)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        return config;
    },
    (error: AxiosError) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response Interceptor (Error Handling & Token Refresh)
apiClient.interceptors.response.use(
    (response) => {
        // console.log(`[API Response] ${response.config.url}`, response.data);
        return response;
    },
    async (error: AxiosError | any) => {
        const originalRequest = error.config;

        // Network Error
        if (!error.response) {
            console.error('[Network Error] Server unreachable.');
            return Promise.reject({
                message: 'Server unreachable. Please check backend status.',
                code: 'NETWORK_ERROR'
            });
        }

        // 401 Unauthorized - Token Expired
        if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken'); // Note: 'refreshToken' vs 'refresh_token'

            if (refreshToken) {
                try {
                    // Attempt Refresh
                    const response = await axios.post(
                        `${API_BASE_URL}/acct/token/refresh/`,
                        { refresh: refreshToken }
                    );

                    const { access } = response.data;

                    // Update Local Storage
                    localStorage.setItem('accessToken', access);

                    // Retry Original Request
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${access}`;
                    }
                    return apiClient(originalRequest);

                } catch (refreshError) {
                    console.error('[Token Refresh Failed]', refreshError);
                    // Logout on fail
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token, logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }

        // Standardize Error Message
        const errorMessage = error.response?.data?.error?.message
            || error.response?.data?.message
            || error.response?.data?.detail
            || error.message
            || 'An unknown error occurred.';

        return Promise.reject({
            status: error.response.status,
            message: errorMessage,
            data: error.response.data
        });
    }
);

export default apiClient;

import axios from 'axios';
import Swal from 'sweetalert2';

// 비동기 api 통신 기본 세팅
// Axios 인스턴스 생성
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost/api',
    withCredentials: true, // 쿠키 포함 (refresh token 등)
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        // 반드시 Bearer 뒤에 공백 필요
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 응답 인터셉터
let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        const status = error.response?.status;

        // 401 에러 발생 : token 만료
        if (status === 401 && !original._retry) {
            original._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) {
                        throw new Error('No refresh token');
                    }

                    // refresh 요청 (Target Backend URL: /acct/token/refresh/)
                    // Body requires { refresh: token }
                    const res = await axios.post(`${api.defaults.baseURL}/acct/token/refresh/`, {
                        refresh: refreshToken
                    });

                    const newAccessToken = res.data.access;
                    localStorage.setItem("accessToken", newAccessToken);
                    // refresh token이 새로 오는지 확인 (보통 access만 옴)
                    if (res.data.refresh) {
                        localStorage.setItem("refreshToken", res.data.refresh);
                    }

                    // 대기 중인 요청 재시도
                    refreshQueue.forEach((cb) => cb());
                    refreshQueue = [];
                } catch (refreshError) {
                    localStorage.clear();
                    // window.location.href = "/login"; // Force redirect
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return new Promise((resolve) => {
                refreshQueue.push(() => resolve(api(original)));
            });
        }

        // 403 에러 : 권한 없음
        if (status === 403) {
            Swal.fire({
                icon: 'error',
                title: '접근 권한 없음',
                text: '해당 기능을 수행할 권한이 없습니다.',
            });
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;

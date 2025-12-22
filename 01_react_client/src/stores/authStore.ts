import { create } from 'zustand';
import api from '../api/axios';
import { User, LoginRequest, LoginResponse, Permission } from '../types';

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    checkPermission: (permission: Permission) => boolean;
    checkRole: (role: string) => boolean;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post<LoginResponse>('/acct/login/', data);
            const { token, user } = response.data;

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            localStorage.setItem('token', token);
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || '로그인에 실패했습니다.';
            set({
                error: errorMessage,
                isLoading: false,
                isAuthenticated: false,
            });
            throw error;
        }
    },

    logout: () => {
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
        localStorage.removeItem('token');
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
        }

        try {
            const response = await api.get<User>('/acct/me/');
            set({
                user: response.data,
                isAuthenticated: true,
                token,
            });
        } catch (error) {
            set({
                user: null,
                token: null,
                isAuthenticated: false,
            });
            localStorage.removeItem('token');
        }
    },

    checkPermission: (permission: Permission) => {
        const { user } = get();
        // Admin은 모든 권한 보유
        if (user?.role === 'admin') return true;

        // TODO: Backend에서 user.permissions 배열 제공 시 체크
        // return user?.permissions?.includes(permission) || false;
        return false;
    },

    checkRole: (role: string) => {
        const { user } = get();
        return user?.role === role;
    },

    clearError: () => {
        set({ error: null });
    },
}));

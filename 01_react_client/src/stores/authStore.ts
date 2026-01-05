import { create } from 'zustand';
import api from '../api/axios';
import { User, LoginRequest, LoginResponse } from '../types';
import { MenuNode } from '../types/menu';
import { connectPermissionSocket } from '../services/permissionSocket';
import { getMyPermissions } from '../services/rbacService';

interface AuthStore {
    user: User | null;
    token: string | null;
    role: string | null;
    menus: MenuNode[];
    permissions: string[];
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isAuthReady: boolean;

    // Actions
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    clearError: () => void;
    hasMenuAccess: (menuId: string) => boolean;
    checkPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    token: localStorage.getItem('accessToken'),
    role: null,
    menus: [],
    permissions: [],
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    error: null,
    isAuthReady: false,

    login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
            // Reference API: /auth/login/ -> Target: /acct/login/
            const response = await api.post<LoginResponse>('/acct/login/', data);

            const { access, refresh, user, token } = response.data as any;
            const accessToken = access || token;

            if (!accessToken) throw new Error("No access token received");

            localStorage.setItem('accessToken', accessToken);
            if (refresh) localStorage.setItem('refreshToken', refresh);

            set({
                token: accessToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            // Post-login fetch
            await get().refreshAuth();

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
            role: null,
            isAuthenticated: false,
            menus: [],
            permissions: [],
            error: null,
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    },

    refreshAuth: async () => {
        try {
            // Fetch Me (User Info)
            const meRes = await api.get('/acct/me/');
            const userData = meRes.data;
            const roleCode = userData.role?.code || userData.role;

            // Fetch Menus
            const menuRes = await api.get('/menus/my/');

            // Fetch Permissions
            let permissions: string[] = [];
            try {
                const permRes = await getMyPermissions();
                permissions = permRes.permissions || [];
            } catch (permError) {
                console.warn('Failed to fetch permissions, defaulting to empty', permError);
            }

            set({
                user: userData,
                role: roleCode,
                menus: menuRes.data.menus,
                permissions: permissions,
                isAuthenticated: true,
            });

            // Re-connect socket
            connectPermissionSocket(async () => {
                const menuRes = await api.get('/menus/my/');
                const permRes = await getMyPermissions();
                set({
                    menus: menuRes.data.menus,
                    permissions: permRes.permissions
                });
            });

        } catch (error) {
            console.error("Failed to refresh auth info", error);
            get().logout();
        }
    },

    checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            set({ isAuthenticated: false, isAuthReady: true });
            return;
        }

        try {
            set({ token, isAuthenticated: true });
            await get().refreshAuth();
        } catch (e) {
            // logging out handled in refreshAuth
        } finally {
            set({ isAuthReady: true });
        }
    },

    clearError: () => set({ error: null }),

    hasMenuAccess: (menuId: string) => {
        const { menus } = get();
        const walk = (tree: MenuNode[]): boolean =>
            tree.some(m => m.id === menuId || (m.children && walk(m.children)));
        return walk(menus);
    },

    checkPermission: (permission: string) => {
        const { permissions, role } = get();
        // Admin has all permissions
        if (role === 'admin') return true;
        return permissions.includes(permission);
    }
}));

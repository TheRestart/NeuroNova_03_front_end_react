import { create } from 'zustand';
import api from '../api/axios';
import { User, LoginRequest, LoginResponse, Permission } from '../types';
import { MenuNode } from '../types/menu';
import { getMyMenus } from '../services/menuService';
import { getMyPermissions } from '../services/rbacService';
import { connectPermissionSocket } from '../services/permissionSocket';

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // RBAC Extensions
    menus: MenuNode[];
    permissions: string[];
    wsConnection: WebSocket | null;
    isAuthReady: boolean;

    // Actions
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    refreshMenusAndPermissions: () => Promise<void>;
    checkPermission: (permission: Permission | string) => boolean;
    checkRole: (role: string) => boolean;
    hasMenuAccess: (menuId: string) => boolean;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    // RBAC State
    menus: [],
    permissions: [],
    wsConnection: null,
    isAuthReady: false,

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

            // 로그인 후 메뉴 및 권한 조회
            await get().refreshMenusAndPermissions();

            // WebSocket 연결
            const ws = connectPermissionSocket(async () => {
                console.log('[AuthStore] Permission changed, refreshing...');
                await get().refreshMenusAndPermissions();
            });
            set({ wsConnection: ws });

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
        const { wsConnection } = get();

        // WebSocket 연결 종료
        if (wsConnection) {
            wsConnection.close();
        }

        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
            menus: [],
            permissions: [],
            wsConnection: null,
            isAuthReady: false,
        });
        localStorage.removeItem('token');
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isAuthenticated: false, user: null, isAuthReady: true });
            return;
        }

        try {
            const response = await api.get<User>('/acct/me/');
            set({
                user: response.data,
                isAuthenticated: true,
                token,
            });

            // 인증 확인 후 메뉴 및 권한 조회
            await get().refreshMenusAndPermissions();

            // WebSocket 연결
            const ws = connectPermissionSocket(async () => {
                console.log('[AuthStore] Permission changed, refreshing...');
                await get().refreshMenusAndPermissions();
            });
            set({ wsConnection: ws, isAuthReady: true });

        } catch (error) {
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                menus: [],
                permissions: [],
                isAuthReady: true,
            });
            localStorage.removeItem('token');
        }
    },

    refreshMenusAndPermissions: async () => {
        try {
            const [menuResponse, permissionResponse] = await Promise.all([
                getMyMenus(),
                getMyPermissions()
            ]);

            set({
                menus: menuResponse.menus,
                permissions: permissionResponse.permissions,
            });
        } catch (error) {
            console.error('[AuthStore] Failed to refresh menus/permissions:', error);
        }
    },

    checkPermission: (permission: Permission | string) => {
        const { user, permissions } = get();

        // Admin은 모든 권한 보유
        if (user?.role === 'admin') return true;

        // Permission 객체인 경우 code 추출, 문자열인 경우 그대로 사용
        const permCode = typeof permission === 'string' ? permission : permission;

        return permissions.includes(permCode);
    },

    checkRole: (role: string) => {
        const { user } = get();
        return user?.role === role;
    },

    hasMenuAccess: (menuId: string) => {
        const { menus } = get();

        const walkMenuTree = (nodes: MenuNode[]): boolean => {
            for (const node of nodes) {
                if (node.id === menuId) return true;
                if (node.children && walkMenuTree(node.children)) return true;
            }
            return false;
        };

        return walkMenuTree(menus);
    },

    clearError: () => {
        set({ error: null });
    },
}));

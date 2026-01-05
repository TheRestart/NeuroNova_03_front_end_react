
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { getMyMenus } from '../api/menuService';
import { getMyPermissions } from '../api/rbacService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로딩 시 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
      // 토큰이 있으면 권한/메뉴 새로고침 시도
      refreshAuth().catch(console.error);
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshAuth = async () => {
    try {
      // 1. 사용자 정보 갱신 (선택 사항)
      // const meRes = await apiClient.get('/acct/me/');
      // const userData = meRes.data;
      // setUser(userData);

      // 2. 메뉴 가져오기
      const menuRes = await getMyMenus();
      setMenus(menuRes.menus || []);

      // 3. 권한 가져오기
      const permRes = await getMyPermissions();
      setPermissions(permRes.permissions || []);
      
    } catch (error) {
      console.error('Failed to refresh auth info:', error);
      // 토큰 만료 등의 에러 처리 로직 추가 가능
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/acct/login/', { username, password });
      const { access, refresh, user: userData } = response.data;

      localStorage.setItem('access_token', access);
      if (refresh) localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      
      // 로그인 직후 권한/메뉴 즉시 로딩
      await refreshAuth();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    setUser(null);
    setMenus([]);
    setPermissions([]);
    setIsAuthenticated(false);
  };

  const hasMenuAccess = useCallback((menuId) => {
    const walk = (tree) => {
      return tree.some(m => m.id === menuId || (m.children && walk(m.children)));
    };
    return walk(menus);
  }, [menus]);

  const checkPermission = useCallback((permissionCode) => {
    if (user?.role === 'admin') return true;
    return permissions.includes(permissionCode);
  }, [permissions, user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      menus, 
      permissions, 
      isAuthenticated, 
      isLoading,
      login, 
      logout,
      refreshAuth,
      hasMenuAccess,
      checkPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

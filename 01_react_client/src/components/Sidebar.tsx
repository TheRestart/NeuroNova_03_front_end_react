/**
 * Sidebar Component
 *
 * 권한 기반 동적 메뉴 렌더링
 */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { MenuNode } from '../types/menu';

const Sidebar: React.FC = () => {
  const { menus, user, isAuthReady } = useAuthStore();
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (menuId: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(menuId)) {
        next.delete(menuId);
      } else {
        next.add(menuId);
      }
      return next;
    });
  };

  const getMenuLabel = (menu: MenuNode): string => {
    if (!user) return menu.labels.DEFAULT || menu.id;

    // 사용자 역할에 맞는 라벨 반환
    const roleCode = user.role?.toUpperCase() || 'DEFAULT';
    return menu.labels[roleCode] || menu.labels.DEFAULT || menu.id;
  };

  const renderMenuItem = (menu: MenuNode): React.ReactNode => {
    // breadcrumbOnly는 사이드바에서 숨김
    if (menu.breadcrumbOnly) return null;

    const hasChildren = menu.children && menu.children.length > 0;
    const isOpen = openGroups.has(menu.id);
    const label = getMenuLabel(menu);

    // 그룹 메뉴 (자식 있음, 경로 없음)
    if (hasChildren && !menu.path) {
      return (
        <li key={menu.id} className="menu-group">
          <button
            onClick={() => toggleGroup(menu.id)}
            className="menu-group-header"
          >
            {menu.icon && <span className="menu-icon">{menu.icon}</span>}
            <span className="menu-label">{label}</span>
            <span className={`menu-arrow ${isOpen ? 'open' : ''}`}>▼</span>
          </button>
          {isOpen && menu.children && (
            <ul className="menu-sublist">
              {menu.children.map(child => renderMenuItem(child))}
            </ul>
          )}
        </li>
      );
    }

    // 링크 메뉴 (경로 있음)
    if (menu.path) {
      return (
        <li key={menu.id} className="menu-item">
          <NavLink
            to={menu.path}
            className={({ isActive }) =>
              `menu-link ${isActive ? 'active' : ''}`
            }
          >
            {menu.icon && <span className="menu-icon">{menu.icon}</span>}
            <span className="menu-label">{label}</span>
          </NavLink>
          {hasChildren && menu.children && (
            <ul className="menu-sublist">
              {menu.children.map(child => renderMenuItem(child))}
            </ul>
          )}
        </li>
      );
    }

    return null;
  };

  if (!isAuthReady) return null;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menus.map(menu => renderMenuItem(menu))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

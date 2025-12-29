import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';
import { cn } from '../utils/cn';

// 역할별 색상 맵핑
const roleColors: Record<UserRole, string> = {
    admin: 'bg-red-600 hover:bg-red-700',
    doctor: 'bg-blue-600 hover:bg-blue-700',
    rib: 'bg-purple-600 hover:bg-purple-700',
    lab: 'bg-green-600 hover:bg-green-700',
    nurse: 'bg-pink-600 hover:bg-pink-700',
    patient: 'bg-orange-600 hover:bg-orange-700',
    external: 'bg-gray-600 hover:bg-gray-700',
};

// 역할별 한글 이름
const roleNames: Record<UserRole, string> = {
    admin: '시스템 관리자',
    doctor: '의사',
    rib: '방사선과',
    lab: '검사실',
    nurse: '간호사',
    patient: '환자',
    external: '외부 기관',
};

// 역할별 메뉴 항목
const roleMenus: Record<UserRole, Array<{ name: string; path: string; icon: string }>> = {
    admin: [
        { name: '대시보드', path: '/dashboard', icon: 'chart' },
        { name: '사용자 관리', path: '/users', icon: 'users' },
        { name: '시스템 설정', path: '/settings', icon: 'cog' },
        { name: '감사 로그', path: '/audit', icon: 'document' },
    ],
    doctor: [
        { name: '대시보드', path: '/dashboard', icon: 'chart' },
        { name: '환자 목록', path: '/patients', icon: 'users' },
        { name: '진료 기록', path: '/encounters', icon: 'clipboard' },
        { name: 'AI 분석', path: '/ai', icon: 'brain' },
        { name: '영상 조회', path: '/ris', icon: 'photo' },
    ],
    rib: [
        { name: '대시보드', path: '/dashboard', icon: 'chart' },
        { name: '영상 판독', path: '/ris', icon: 'photo' },
        { name: '판독 대기', path: '/pending', icon: 'clock' },
    ],
    lab: [
        { name: '대시보드', path: '/dashboard', icon: 'chart' },
        { name: '검사 목록', path: '/tests', icon: 'beaker' },
        { name: '검사 결과', path: '/results', icon: 'document' },
    ],
    nurse: [
        { name: '대시보드', path: '/dashboard', icon: 'chart' },
        { name: '환자 목록', path: '/patients', icon: 'users' },
        { name: '바이탈 사인', path: '/vitals', icon: 'heart' },
        { name: '투약 관리', path: '/medication', icon: 'pill' },
    ],
    patient: [
        { name: '내 정보', path: '/dashboard', icon: 'user' },
        { name: '진료 기록', path: '/encounters', icon: 'clipboard' },
        { name: '검사 결과', path: '/results', icon: 'document' },
        { name: '예약', path: '/appointments', icon: 'calendar' },
    ],
    external: [
        { name: '대시보드', path: '/dashboard', icon: 'chart' },
        { name: 'FHIR 연동', path: '/fhir', icon: 'link' },
    ],
};

const Dashboard: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate('/login');
        }
    }, [isAuthenticated, user, navigate]);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menus = roleMenus[user.role] || [];
    const roleColor = roleColors[user.role];
    const roleName = roleNames[user.role];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 상단 네비게이션 바 */}
            <nav className={cn("shadow-md", roleColor)}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* 로고 및 제목 */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="text-white">
                                <div className="text-lg font-bold">CDSS</div>
                                <div className="text-xs opacity-90">{roleName}</div>
                            </div>
                        </div>

                        {/* 사용자 정보 및 로그아웃 */}
                        <div className="flex items-center space-x-4">
                            <div className="text-white text-right hidden sm:block">
                                <div className="text-sm font-semibold">
                                    {user.last_name}{user.first_name || user.username}
                                </div>
                                <div className="text-xs opacity-90">
                                    {user.department || roleName}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>로그아웃</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 메인 컨텐츠 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 환영 메시지 */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        환영합니다, {user.last_name}{user.first_name || user.username}님
                    </h1>
                    <p className="text-gray-600">
                        CDSS 임상 의사결정 지원 시스템에 로그인하셨습니다.
                    </p>
                </div>

                {/* 메뉴 그리드 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menus.map((menu) => (
                        <button
                            key={menu.path}
                            onClick={() => navigate(menu.path)}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-6 text-left group"
                        >
                            <div className="flex items-start space-x-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center",
                                    roleColor,
                                    "group-hover:scale-110 transition-transform duration-200"
                                )}>
                                    {menu.icon === 'chart' && (
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    )}
                                    {menu.icon === 'users' && (
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    )}
                                    {menu.icon === 'clipboard' && (
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    )}
                                    {menu.icon === 'brain' && (
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    )}
                                    {menu.icon === 'photo' && (
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                    {/* 기타 아이콘 생략 - 필요시 추가 */}
                                    {!['chart', 'users', 'clipboard', 'brain', 'photo'].includes(menu.icon) && (
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                        {menu.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {menu.path}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* 임시 공지 */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h4 className="text-blue-900 font-semibold mb-1">개발 진행 중</h4>
                            <p className="text-blue-800 text-sm">
                                현재 Week 2 개발이 진행 중입니다. 일부 메뉴는 준비 중이며, 순차적으로 기능이 추가됩니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

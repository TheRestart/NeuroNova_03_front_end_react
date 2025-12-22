import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../utils/cn';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    // 이미 로그인된 경우 대시보드로 리다이렉트
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // 컴포넌트 언마운트 시 에러 메시지 제거
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            return;
        }

        try {
            await login({ username, password });
            // 로그인 성공 시 대시보드로 이동 (useEffect에서 처리)
        } catch (err) {
            // 에러는 store에서 처리
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8">
                {/* 헤더 */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        CDSS
                    </h2>
                    <p className="text-xl text-gray-600 mb-1">
                        임상 의사결정 지원 시스템
                    </p>
                    <p className="text-sm text-gray-500">
                        Clinical Decision Support System
                    </p>
                </div>

                {/* 로그인 폼 */}
                <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
                    {/* 에러 메시지 */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start space-x-3">
                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* 아이디 입력 */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                아이디
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={cn(
                                    "w-full px-4 py-3 rounded-lg border border-gray-300",
                                    "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                    "transition-all duration-200",
                                    "disabled:bg-gray-100 disabled:cursor-not-allowed"
                                )}
                                placeholder="사용자 아이디를 입력하세요"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={cn(
                                    "w-full px-4 py-3 rounded-lg border border-gray-300",
                                    "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                    "transition-all duration-200",
                                    "disabled:bg-gray-100 disabled:cursor-not-allowed"
                                )}
                                placeholder="비밀번호를 입력하세요"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {/* 로그인 버튼 */}
                        <button
                            type="submit"
                            disabled={isLoading || !username || !password}
                            className={cn(
                                "w-full py-3 px-4 rounded-lg font-semibold text-white",
                                "bg-gradient-to-r from-blue-500 to-purple-600",
                                "hover:from-blue-600 hover:to-purple-700",
                                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                "transition-all duration-200 shadow-lg hover:shadow-xl",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "flex items-center justify-center space-x-2"
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>로그인 중...</span>
                                </>
                            ) : (
                                <span>로그인</span>
                            )}
                        </button>
                    </form>

                    {/* 테스트 사용자 안내 */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center mb-3">
                            테스트 계정
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-gray-50 p-2 rounded">
                                <span className="font-semibold">Doctor:</span> doctor1 / doctor123
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                                <span className="font-semibold">Nurse:</span> nurse1 / nurse123
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                                <span className="font-semibold">Patient:</span> patient1 / patient123
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                                <span className="font-semibold">Admin:</span> admin1 / admin123
                            </div>
                        </div>
                    </div>
                </div>

                {/* 푸터 */}
                <p className="text-center text-sm text-gray-500">
                    © 2025 NeuroNova CDSS. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;

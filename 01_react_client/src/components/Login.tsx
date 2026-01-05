import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import '../styles/login.css';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { login, refreshAuth, isAuthenticated } = useAuthStore();

    // 이미 로그인된 경우 대시보드로 리다이렉트
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async () => {
        if (!username || !password) {
            Swal.fire({
                icon: 'warning',
                title: '입력 확인',
                text: '아이디와 비밀번호를 모두 입력해주세요.',
            });
            return;
        }

        try {
            // Login Action (AuthStore)
            await login({ username, password });

            // Login Successful
            await Swal.fire({
                icon: 'success',
                title: '로그인 성공',
                text: '오늘도 화이팅하세요.',
                timer: 1200,
                width: 424,
                padding: '1.25rem',
                showConfirmButton: false,
            });

            navigate('/dashboard', { replace: true });

        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: '인증 실패',
                text: '아이디 또는 비밀번호를 확인해주세요.',
                width: 424,
                padding: '1.25rem',
                confirmButtonText: '확인',
                confirmButtonColor: '#1d4ed8',
            });
            console.error(error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-page">
            <div className="login-overlay" />

            <header className="login-header">
                <div className="logo">
                    <span className="logo-icon">
                        <i className="fa-solid fa-brain"></i>
                        {/* Fallback image if fontawesome not loaded or just SVG */}
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </span>
                    <div>
                        <strong>CDSS</strong>
                        <span className="sub">(NeuroNova)</span>
                        <div className="desc">CLINICAL DECISION SUPPORT SYSTEM</div>
                    </div>
                </div>
            </header>

            <div className="login-container">
                <div className="login-card">
                    <h2>로그인</h2>

                    <div className="login-field">
                        <input
                            placeholder="아이디"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="login-field">
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <button className="login-button" onClick={handleLogin}>
                        로그인
                    </button>

                    <div className="login-footer">
                        <a href="#">비밀번호를 잊으셨나요?</a>
                    </div>

                    {/* 테스트 사용자 안내 (개발용) */}
                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                        <p>Test: doctor1 / doctor123!</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;

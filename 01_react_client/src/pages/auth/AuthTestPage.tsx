import React from 'react';
import APITester from '../../components/shared/APITester';
import { authAPI } from '../../services/auth.api';

const AuthTestPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-indigo-600 pl-4">
                UC01: 인증/권한 테스트
            </h1>

            <div className="grid grid-cols-1 gap-8">
                <APITester
                    title="1. 사용자 목록 조회 (Admin Only)"
                    apiCall={() => authAPI.getUsers()}
                />

                <APITester
                    title="2. 내 정보 조회 (Access Token Required)"
                    apiCall={() => authAPI.getMe()}
                />

                <APITester
                    title="3. 회원가입 (Patient Role)"
                    apiCall={(params) => authAPI.register(params)}
                    defaultParams={{
                        username: '',
                        email: '',
                        password: '',
                        password_confirm: '',
                        role: 'patient',
                        full_name: '',
                    }}
                    paramFields={[
                        { name: 'username', label: '사용자명', type: 'text', required: true },
                        { name: 'email', label: '이메일', type: 'email', required: true },
                        { name: 'password', label: '비밀번호', type: 'password', required: true },
                        { name: 'password_confirm', label: '비밀번호 확인', type: 'password', required: true },
                        { name: 'full_name', label: '이름', type: 'text', required: true },
                    ]}
                />
            </div>
        </div>
    );
};

export default AuthTestPage;

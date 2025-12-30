import React from 'react';
import APITester from '../components/APITester';
import { authAPI } from '../api/apiClient';

function UC01AuthTest() {
  return (
    <div className="container">
      <h1>UC01: 인증/권한 테스트</h1>

      <APITester
        title="1. 사용자 목록 조회 (Admin만)"
        apiCall={() => authAPI.getUsers()}
        paramFields={[]}
      />

      <APITester
        title="2. 내 정보 조회"
        apiCall={() => authAPI.getMe()}
        paramFields={[]}
      />

      <APITester
        title="3. 회원가입 (Patient 역할)"
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
  );
}

export default UC01AuthTest;

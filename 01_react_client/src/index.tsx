import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { useAuthStore } from './stores/authStore';

// 앱 초기화 시 인증 상태 확인
const initializeAuth = async () => {
  const { checkAuth } = useAuthStore.getState();
  await checkAuth();
};

// 인증 초기화 후 앱 렌더링
initializeAuth().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

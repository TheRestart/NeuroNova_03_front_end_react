/**
 * 403 Forbidden Page
 *
 * 권한 없는 페이지 접근 시 표시
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Forbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Access Forbidden
        </h2>
        <p className="text-gray-600 mb-8">
          이 페이지에 접근할 권한이 없습니다.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            이전 페이지
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            대시보드로
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;

import React, { useState, useEffect } from 'react';
import ResponseTable from './ResponseTable';

export interface ParamField {
    name: string;
    label: string;
    type: 'text' | 'password' | 'email' | 'number' | 'select' | 'textarea';
    required?: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
    description?: string;
}

interface APITesterProps {
    title: string;
    apiCall: (params?: any) => Promise<any>;
    defaultParams?: any;
    paramFields?: ParamField[];
    exampleData?: any;
}

const APITester: React.FC<APITesterProps> = ({
    title,
    apiCall,
    defaultParams = {},
    paramFields = [],
    exampleData = null,
}) => {
    const [params, setParams] = useState<any>(defaultParams);
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

    const handleParamChange = (field: string, value: any) => {
        setParams((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleExampleInput = () => {
        if (exampleData) {
            setParams(exampleData);
        } else {
            setParams(defaultParams);
        }
    };

    const handleTest = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await apiCall(params);
            setResponse(result.data || result); // Handle Axios response or direct data
        } catch (err: any) {
            console.error('API Error:', err);
            setError(err.response?.data || { message: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setParams(defaultParams);
        setResponse(null);
        setError(null);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4 border-b border-indigo-100 pb-3">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                {exampleData && (
                    <button
                        onClick={handleExampleInput}
                        className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    >
                        🚀 예시 입력
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {paramFields.map((field) => (
                    <div key={field.name} className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {field.type === 'textarea' ? (
                            <textarea
                                value={params[field.name] || ''}
                                onChange={(e) => handleParamChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                rows={3}
                            />
                        ) : field.type === 'select' ? (
                            <select
                                value={params[field.name] || ''}
                                onChange={(e) => handleParamChange(field.name, e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                <option value="">선택하세요</option>
                                {field.options?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                value={params[field.name] || ''}
                                onChange={(e) => handleParamChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                        )}
                        {field.description && <p className="text-xs text-gray-500 mt-1">{field.description}</p>}
                    </div>
                ))}
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={handleTest}
                    disabled={loading}
                    className={`flex-1 py-2 px-4 rounded-md text-white font-medium shadow-sm transition-all
            ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'}`}
                >
                    {loading ? '실행 중...' : '테스트 실행'}
                </button>
                <button
                    onClick={handleClear}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                    초기화
                </button>
            </div>

            {/* Response Section */}
            {(response || error) && (
                <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                            {error ? '❌ 에러 발생' : '✅ 응답 결과'}
                        </h4>
                        {response && (
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    테이블
                                </button>
                                <button
                                    onClick={() => setViewMode('json')}
                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'json' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    JSON
                                </button>
                            </div>
                        )}
                    </div>

                    {error ? (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-800 overflow-auto">
                            <pre>{JSON.stringify(error, null, 2)}</pre>
                        </div>
                    ) : (
                        viewMode === 'table' && Array.isArray(response) ? (
                            <ResponseTable data={response} />
                        ) : (
                            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 overflow-auto max-h-96">
                                <pre className="text-xs font-mono text-slate-700">{JSON.stringify(response, null, 2)}</pre>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default APITester;

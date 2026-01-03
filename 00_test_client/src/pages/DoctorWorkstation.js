import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { emrAPI } from '../api/apiClient';

const DoctorWorkstation = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        currentPage: 1,
        pageSize: 20
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async (page = 1) => {
        try {
            setLoading(true);
            // 페이지네이션 파라미터 추가 (DRF LimitOffsetPagination 사용)
            const offset = (page - 1) * pagination.pageSize;
            const response = await emrAPI.getPatients({
                limit: pagination.pageSize,
                offset: offset
            });

            // Django rest framework의 pagination 대응
            const patientList = response.data.results || response.data;
            setPatients(patientList);

            // 페이지네이션 정보 저장
            if (response.data.count !== undefined) {
                setPagination(prev => ({
                    ...prev,
                    count: response.data.count,
                    next: response.data.next,
                    previous: response.data.previous,
                    currentPage: page
                }));
            }

            setError(null);
        } catch (err) {
            console.error('Failed to fetch patients:', err);
            setError('환자 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchPatients(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePatientClick = (patientId) => {
        // [FIX] Navigate to true patient clinical dashboard
        navigate(`/patient/${patientId}`);
    };

    if (loading) return <div className="loading">진료 대기 명단을 불러오는 중...</div>;

    return (
        <div className="container">
            <header className="page-header">
                <h1 className="page-title">Doctor Workstation</h1>
                <div className="badge badge-blue">실시간 대기 중</div>
            </header>

            {error && <div className="error-message">{error}</div>}

            <div className="card-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                {patients.length > 0 ? (
                    patients.map((patient) => (
                        <div
                            key={patient.patient_id}
                            className="premium-card glass-morphism"
                            onClick={() => handlePatientClick(patient.patient_id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span className="badge badge-green" style={{ fontSize: '10px' }}>WAITING</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{patient.patient_id}</span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)' }}>
                                {patient.family_name}{patient.given_name}
                            </h3>
                            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                                <p>생년월일: {patient.birth_date}</p>
                                <p>성별: {patient.gender === 'M' ? '남성' : '여성'}</p>
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                                <button className="btn btn-primary btn-sm" style={{ flex: 1, margin: 0 }}>진료 시작</button>
                                <button className="btn btn-secondary btn-sm" style={{ margin: 0 }}>기록 확인</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="premium-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                        대기 중인 환자가 없습니다. 데이터 시딩을 확인해주세요.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {pagination.count > pagination.pageSize && (
                <div style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.previous || loading}
                    >
                        ← 이전
                    </button>

                    <div style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}>
                        Page {pagination.currentPage} / {Math.ceil(pagination.count / pagination.pageSize)}
                        <span style={{ marginLeft: '10px', color: 'var(--text-muted)' }}>
                            (총 {pagination.count}명)
                        </span>
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.next || loading}
                    >
                        다음 →
                    </button>
                </div>
            )}
        </div>
    );
};

export default DoctorWorkstation;

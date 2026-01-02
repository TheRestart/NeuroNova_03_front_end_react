import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { emrAPI } from '../api/apiClient';

const DoctorWorkstation = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await emrAPI.getPatients();
            // Django rest framework의 pagination 대응 (results 필드 확인)
            const patientList = response.data.results || response.data;
            setPatients(patientList);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch patients:', err);
            setError('환자 목록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handlePatientClick = (patientId) => {
        // 향후 환자 상세 진료 페이지로 이동 (현재는 UC02로 연결하여 상세 확인 유도)
        navigate(`/uc02`);
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
        </div>
    );
};

export default DoctorWorkstation;

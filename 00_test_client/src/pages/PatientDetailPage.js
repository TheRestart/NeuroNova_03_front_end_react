import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { emrAPI, ocsAPI, lisAPI } from '../api/apiClient';

function PatientDetailPage() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch patient details
                const response = await emrAPI.getPatient(patientId);
                setPatient(response.data.data || response.data);
            } catch (error) {
                console.error("Failed to fetch patient", error);
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchData();
        }
    }, [patientId]);

    if (loading) return <div className="loading">환자 정보를 불러오는 중...</div>;
    if (!patient) return <div className="error-box">환자를 찾을 수 없습니다.</div>;

    return (
        <div className="container">
            <header className="page-header">
                <h1 className="page-title">{patient.family_name}{patient.given_name} ({patient.gender})</h1>
                <div className="badge badge-blue">ID: {patient.patient_id}</div>
            </header>

            <div className="card">
                <h3>기본 정보</h3>
                <p>생년월일: {patient.birth_date}</p>
                <p>전화번호: {patient.phone}</p>
                <p>이메일: {patient.email}</p>
            </div>

            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div className="premium-card" onClick={() => navigate(`/uc02?patient_id=${patientId}`)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                    <h3>📋 진료 기록</h3>
                    <p>EMR 조회</p>
                </div>
                <div className="premium-card" onClick={() => navigate(`/uc03?patient_id=${patientId}`)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                    <h3>💊 처방 내역</h3>
                    <p>OCS 조회</p>
                </div>
                <div className="premium-card" onClick={() => navigate(`/uc05?patient_id=${patientId}`)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                    <h3>🖼️ 영상 검사</h3>
                    <p>PACS Viewer</p>
                </div>
                <div className="premium-card" onClick={() => navigate(`/uc04?patient_id=${patientId}`)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                    <h3>🧬 유전체 분석</h3>
                    <p>LIS 결과</p>
                </div>
            </div>
        </div>
    );
}

export default PatientDetailPage;

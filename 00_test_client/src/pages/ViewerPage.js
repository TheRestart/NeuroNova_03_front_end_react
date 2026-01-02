import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { risAPI } from '../api/apiClient';

function ViewerPage() {
  const { studyInstanceUID } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studyData, setStudyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStudy = async () => {
      try {
        setLoading(true);
        // Fetch Study Metadata for the Sidebar
        const response = await risAPI.getStudy(studyInstanceUID);
        setStudyData(response.data);
      } catch (err) {
        console.error("Failed to load study metadata:", err);
        // Continue loading viewer even if metadata fails, but show error in sidebar
        setError("환자 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (studyInstanceUID) {
      loadStudy();
    }
  }, [studyInstanceUID]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000', color: '#ccc', fontFamily: 'Inter, sans-serif' }}>

      {/* 1. Sidebar: Patient & Study Info */}
      <aside style={{ width: '300px', background: '#111', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
          <h2 style={{ fontSize: '18px', color: '#fff', margin: '0 0 5px 0' }}>NeuroNova PACS</h2>
          <div style={{ fontSize: '12px', color: '#666' }}>Radiology Workstation</div>
        </div>

        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Patient Name</label>
            <div style={{ fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>
              {studyData?.patient_name || 'Loading...'}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Patient ID</label>
            <div style={{ fontSize: '14px', color: '#ddd' }}>
              {studyData?.patient_id || '-'}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Study Date</label>
            <div style={{ fontSize: '14px', color: '#ddd' }}>
              {studyData?.study_date || '-'}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Modality</label>
            <div style={{ fontSize: '14px', color: '#4cc9f0', fontWeight: 'bold' }}>
              {studyData?.modality || 'UNKNOWN'}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Study Description</label>
            <div style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.4' }}>
              {studyData?.study_description || 'No description provided.'}
            </div>
          </div>

          {/* Toolbar Mock */}
          <div style={{ borderTop: '1px solid #333', paddingTop: '20px', marginTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <ToolButton icon="🔆" label="W/L" />
              <ToolButton icon="🔍" label="Zoom" />
              <ToolButton icon="🤚" label="Pan" />
              <ToolButton icon="📏" label="Measure" />
              <ToolButton icon="↩️" label="Reset" />
              <ToolButton icon="💾" label="Save" />
            </div>
          </div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #333' }}>
          <button
            onClick={() => navigate('/uc05')}
            style={{
              width: '100%',
              padding: '10px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            &larr; Back to List
          </button>
        </div>
      </aside>

      {/* 2. Main Viewer Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Viewport Header */}
        <div style={{ height: '40px', background: '#222', display: 'flex', alignItems: 'center', padding: '0 15px', borderBottom: '1px solid #444' }}>
          <span style={{ fontSize: '12px', color: '#aaa' }}>Active Viewport: 1x1</span>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#4cc9f0' }}>StudyUID: {studyInstanceUID}</span>
        </div>

        {/* Viewer Canvas (Iframe) */}
        <div style={{ flex: 1, position: 'relative', background: '#000' }}>
          <iframe
            src={`${process.env.REACT_APP_OHIF_VIEWER_ROOT || 'http://localhost/pacs-viewer'}/index.html?url=${process.env.REACT_APP_DICOM_WEB_ROOT}/studies/${studyInstanceUID}`}
            title="Remote Viewer"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />

          {/* Overlay for better "integrated" feel (removes Orthanc header if possible via CSS/JS injection? No, cross-origin) */}
          {/* Instead, we accept the iframe content but fram the experience around it. */}
        </div>
      </main>
    </div>
  );
}

const ToolButton = ({ icon, label }) => (
  <button style={{
    background: '#222',
    border: '1px solid #444',
    color: '#ccc',
    borderRadius: '4px',
    padding: '8px 0',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  }}
    onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
    onMouseLeave={(e) => e.currentTarget.style.background = '#222'}
  >
    <span style={{ fontSize: '16px' }}>{icon}</span>
    <span style={{ fontSize: '10px' }}>{label}</span>
  </button>
);

export default ViewerPage;

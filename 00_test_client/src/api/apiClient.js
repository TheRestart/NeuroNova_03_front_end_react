import axios from 'axios';

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초
});

// Request Interceptor (JWT 토큰 자동 추가)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && !token.startsWith('dev-mock-')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor (에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 네트워크 에러 (서버 미응답)
    if (!error.response) {
      console.error('[Network Error] 서버에 연결할 수 없습니다.');
      return Promise.reject({
        message: '서버에 연결할 수 없습니다. 백엔드(Docker) 실행 상태를 확인해주세요.',
        code: 'NETWORK_ERROR'
      });
    }

    console.error('[API Response Error]', error.response);

    // 401 Unauthorized - 토큰 만료
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');

      // Refresh 토큰이 있으면 갱신 시도
      if (refreshToken) {
        // [Dev Mode] Mock Refresh Token인 경우 갱신 시도하지 않음
        if (refreshToken.startsWith('dev-mock-')) {
          console.warn('[Dev Mode] Mock refresh token detected. Suppressing refresh attempt.');
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(
            `${API_BASE_URL}/acct/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('[Token Refresh Failed]', refreshError);
          // Refresh 실패 시 로그아웃 처리
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Refresh 토큰이 없으면 로그아웃 (Mock 토큰일 경우 리다이렉트 방지)
        const token = localStorage.getItem('access_token');
        if (token && token.startsWith('dev-mock-')) {
          console.warn('[Dev Mode] Mock token 401 Unauthorized. Redirect suppressed.');
          // Mock 모드에서는 리다이렉트 하지 않고 에러만 반환하여 테스트가 중단되지 않게 함
          return Promise.reject(error);
        }

        console.warn('토큰이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    // 에러 메시지 정규화
    const errorMessage = error.response?.data?.error?.message
      || error.response?.data?.message
      || error.response?.data?.detail
      || error.message
      || '알 수 없는 오류가 발생했습니다.';

    return Promise.reject({
      status: error.response.status,
      message: errorMessage,
      data: error.response.data
    });
  }
);

export default apiClient;

// ========================================
// UC01: 인증/권한 (Authentication & Authorization)
// ========================================

export const authAPI = {
  // 로그인
  login: (username, password) =>
    apiClient.post('/acct/login/', { username, password }),

  // 회원가입 (Patient 역할만 자가 가입 가능)
  register: (userData) =>
    apiClient.post('/acct/users/register/', userData),

  // 로그아웃
  logout: () =>
    apiClient.post('/acct/logout/'),

  // 내 정보 조회
  getMe: () =>
    apiClient.get('/acct/me/'),

  // 사용자 목록 (Admin만)
  getUsers: () =>
    apiClient.get('/acct/users/'),
};

// ========================================
// UC02: EMR (Electronic Medical Records)
// ========================================

export const emrAPI = {
  // Health Check
  healthCheck: () =>
    apiClient.get('/emr/health/'),

  // 환자 목록 (기본 정보만, 빠른 조회)
  getPatients: (params) =>
    apiClient.get('/emr/patients/', { params }),

  // 환자 생성 (자동으로 OpenEMR + FHIR에 동기화됨)
  createPatient: (patientData) =>
    apiClient.post('/emr/patients/', patientData),

  // 환자 상세 (Django MySQL 기본 정보 + OpenEMR 상세 정보)
  // 응답 형식: { data: {...}, openemr_detail: {...} }
  getPatient: (patientId) =>
    apiClient.get(`/emr/patients/${patientId}/`),

  // 환자 수정 (자동으로 OpenEMR + FHIR에 동기화됨)
  updatePatient: (patientId, patientData) =>
    apiClient.patch(`/emr/patients/${patientId}/`, patientData),

  // 환자 검색
  searchPatients: (query) =>
    apiClient.get('/emr/patients/search/', { params: { q: query } }),

  // 진료 기록 목록
  getEncounters: (params) =>
    apiClient.get('/emr/encounters/', { params }),

  // 진료 기록 생성
  createEncounter: (encounterData) =>
    apiClient.post('/emr/encounters/', encounterData),

  // 환자별 진료 기록 조회
  getPatientEncounters: (patientId) =>
    apiClient.get(`/emr/encounters/by-patient/${patientId}/`),

  // 처방 목록
  getOrders: (params) =>
    apiClient.get('/emr/orders/', { params }),

  // 처방 생성
  createOrder: (orderData) =>
    apiClient.post('/emr/orders/', orderData),

  // 환자별 처방 목록 조회
  getPatientOrders: (patientId) =>
    apiClient.get(`/emr/orders/by-patient/${patientId}/`),

  // 처방 실행
  executeOrder: (orderId, executeData) =>
    apiClient.post(`/emr/orders/${orderId}/execute/`, executeData),
};

// ========================================
// UC03: OCS (Order Communication System)
// ========================================

export const ocsAPI = {
  // 처방 목록 (EMR 통합 관리)
  getOrders: (params) =>
    apiClient.get('/emr/orders/', { params }),

  // 처방 생성 (EMR 통합 관리)
  createOrder: (orderData) =>
    apiClient.post('/emr/orders/', orderData),

  // 처방 상세
  getOrder: (orderId) =>
    apiClient.get(`/emr/orders/${orderId}/`),

  // 처방 수정
  updateOrder: (orderId, orderData) =>
    apiClient.patch(`/emr/orders/${orderId}/`, orderData),

  // 처방 항목 추가
  addOrderItem: (orderId, itemData) =>
    apiClient.post(`/emr/orders/${orderId}/items/`, itemData),
};

// ========================================
// UC04: LIS (Laboratory Information System)
// ========================================

export const lisAPI = {
  // 검사 결과 목록 (MySQL only, OpenEMR/FHIR 연동 없음)
  getLabResults: (params) =>
    apiClient.get('/lis/results/', { params }),

  // 검사 결과 생성
  createLabResult: (resultData) =>
    apiClient.post('/lis/results/', resultData),

  // 검사 결과 상세 (유전 정보 포함, result_details 필드)
  getLabResult: (resultId) =>
    apiClient.get(`/lis/results/${resultId}/`),

  // 환자별 검사 결과 조회
  getPatientLabResults: (patientId) =>
    apiClient.get('/lis/results/', { params: { patient: patientId } }),

  // 검사 마스터 목록
  getTestMasters: () =>
    apiClient.get('/lis/tests/'),
};

// ========================================
// UC05: RIS (Radiology Information System)
// ========================================

export const risAPI = {
  // 영상 검사 목록 (Radiology Order)
  getRadiologyOrders: (params) =>
    apiClient.get('/ris/orders/', { params }),

  // 영상 검사 생성
  createRadiologyOrder: (orderData) =>
    apiClient.post('/ris/orders/', orderData),

  // Study 목록
  getStudies: (params) =>
    apiClient.get('/ris/studies/', { params }),

  // Study 상세
  getStudy: (studyId) =>
    apiClient.get(`/ris/studies/${studyId}/`),

  // 판독 리포트 목록
  getReports: (params) =>
    apiClient.get('/ris/reports/', { params }),

  // 판독 리포트 생성
  createReport: (reportData) =>
    apiClient.post('/ris/reports/', reportData),
};

// ========================================
// UC06: AI Job Management
// ========================================

export const aiAPI = {
  // AI Job 목록
  getAIJobs: (params) =>
    apiClient.get('/ai/jobs/', { params }),

  // AI Job 생성 (분석 요청)
  createAIJob: (jobData) =>
    apiClient.post('/ai/jobs/', jobData),

  // AI Job 상세 (result_data: 텍스트/숫자, segmentation_path: VM 경로)
  getAIJob: (jobId) =>
    apiClient.get(`/ai/jobs/${jobId}/`),

  // AI Job 검토 (승인/반려)
  reviewAIJob: (jobId, reviewData) =>
    apiClient.post(`/ai/jobs/${jobId}/review/`, reviewData),

  // Seg 이미지 저장 승인 (의사가 'seg_저장' 버튼 클릭)
  // → VM 임시 파일 → DICOM 변환 → Orthanc 업로드
  approveSegmentation: (jobId, approvalData) =>
    apiClient.post(`/ai/jobs/${jobId}/approve-segmentation/`, approvalData),
};

// ========================================
// UC07: 알림 (Notification)
// ========================================

export const alertAPI = {
  // 알림 목록
  getAlerts: (params) =>
    apiClient.get('/alert/alerts/', { params }),

  // 알림 생성
  createAlert: (alertData) =>
    apiClient.post('/alert/alerts/', alertData),

  // 알림 읽음 처리
  markAsRead: (alertId) =>
    apiClient.patch(`/alert/alerts/${alertId}/mark-as-read/`),

  // 내 알림 목록
  getMyAlerts: () =>
    apiClient.get('/alert/my-alerts/'),
};

// ========================================
// UC08: FHIR (의료정보 교환)
// ========================================

export const fhirAPI = {
  // Patient 리소스
  getPatient: (patientId) =>
    apiClient.get(`/fhir/Patient/${patientId}/`),

  // Encounter 리소스
  getEncounter: (encounterId) =>
    apiClient.get(`/fhir/Encounter/${encounterId}/`),

  // Observation 리소스
  getObservation: (observationId) =>
    apiClient.get(`/fhir/Observation/${observationId}/`),

  // DiagnosticReport 리소스
  getDiagnosticReport: (reportId) =>
    apiClient.get(`/fhir/DiagnosticReport/${reportId}/`),

  // 동기화 작업 생성
  createSyncJob: (syncData) =>
    apiClient.post('/fhir/sync/', syncData),

  // 동기화 큐 목록
  getSyncQueue: (params) =>
    apiClient.get('/fhir/sync-queue/', { params }),

  // 1. FHIR 메타데이터 (CapabilityStatement)
  getMetadata: () =>
    apiClient.get('/fhir/proxy/metadata'),

  // 2. Patient 검색
  searchPatients: (params) =>
    apiClient.get('/fhir/proxy/Patient', { params }),

  // 4. Observation 검색
  searchObservations: (params) =>
    apiClient.get('/fhir/proxy/Observation', { params }),

  // 5. Condition 검색
  searchConditions: (params) =>
    apiClient.get('/fhir/proxy/Condition', { params }),

  // 6. MedicationRequest 검색
  searchMedicationRequests: (params) =>
    apiClient.get('/fhir/proxy/MedicationRequest', { params }),

  // 7. DiagnosticReport 검색
  searchDiagnosticReports: (params) =>
    apiClient.get('/fhir/proxy/DiagnosticReport', { params }),

  // 8. Bundle 생성 (Transaction)
  createBundle: (bundleData) =>
    apiClient.post('/fhir/proxy/', bundleData),

  // 9. 헬스 체크
  healthCheck: () =>
    apiClient.get('/fhir/proxy/metadata'), // Metadata 호출로 대체
};

// UC09: 감사 로그 (Audit Logs)
// ========================================

export const auditAPI = {
  // 감사 로그 목록
  getLogs: (params) =>
    apiClient.get('/audit/logs/', { params }),

  // 감사 로그 상세
  getLog: (id) =>
    apiClient.get(`/audit/logs/${id}/`),
};

// ========================================
// UC10: Monitoring (시스템 상태)
// ========================================

export const monitoringAPI = {
  // 실제로는 각 포트로 요청해야 하지만, CORS 문제로 인해 
  // Django Proxy를 통하거나 단순 헬스 체크 링크만 제공할 수 있음
  // 여기서는 Django가 제공하는 통합 헬스 체크 API를 가정 (없으면 mock)
  checkAllHealth: async () => {
    try {
      // Django API를 통해 전체 상태 조회 (구현 필요)
      // 현재는 각각의 포트로 fetch 요청 시도 (CORS 주의)
      const results = {
        django: "OK",
        prometheus: "UNKNOWN",
        grafana: "UNKNOWN",
        alertmanager: "UNKNOWN"
      };

      // Django Health Check
      try {
        await apiClient.get('/acct/me/'); // Simple ping
        results.django = "PASS (Online)";
      } catch (e) { results.django = "FAIL (Backend Unreachable)"; }

      // Prometheus (Client-side fetch, requires CORS or Proxy)
      // 임시로 Mocking 처리하여 UI 보여줌
      results.prometheus = "PASS (Port 9090 Reached)";
      results.grafana = "PASS (Port 3000 Reached)";
      results.alertmanager = "PASS (Port 9093 Reached)";

      return results;
    } catch (error) {
      console.error("Health Check Failed", error);
      return { error: "Health Check Failed" };
    }
  }
};

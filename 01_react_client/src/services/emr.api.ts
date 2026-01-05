
import apiClient from '../api/axios';

export interface Patient {
    patient_id: string;
    family_name: string;
    given_name: string;
    birth_date: string; // YYYY-MM-DD
    gender: 'male' | 'female' | 'other';
    // ... add other fields as necessary
}

export interface PatientDetailResponse {
    data: Patient;
    openemr_detail: any;
}

export const emrAPI = {
    // Health Check
    healthCheck: () =>
        apiClient.get('/emr/health/'),

    // Patient List
    getPatients: (params?: any) =>
        apiClient.get('/emr/patients/', { params }),

    // Create Patient
    createPatient: (patientData: any) =>
        apiClient.post('/emr/patients/', patientData),

    // Get Patient Detail
    getPatient: (patientId: string) =>
        apiClient.get<PatientDetailResponse>(`/emr/patients/${patientId}/`),

    // Update Patient
    updatePatient: (patientId: string, patientData: any) =>
        apiClient.patch(`/emr/patients/${patientId}/`, patientData),

    // Search Patients
    searchPatients: (query: string) =>
        apiClient.get('/emr/patients/search/', { params: { q: query } }),

    // Encounters
    getEncounters: (params?: any) =>
        apiClient.get('/emr/encounters/', { params }),

    createEncounter: (encounterData: any) =>
        apiClient.post('/emr/encounters/', encounterData),

    getPatientEncounters: (patientId: string) =>
        apiClient.get(`/emr/encounters/by-patient/${patientId}/`),

    // Orders
    getOrders: (params?: any) =>
        apiClient.get('/emr/orders/', { params }),

    createOrder: (orderData: any) =>
        apiClient.post('/emr/orders/', orderData),

    getPatientOrders: (patientId: string) =>
        apiClient.get(`/emr/orders/by-patient/${patientId}/`),

    executeOrder: (orderId: string, executeData: any) =>
        apiClient.post(`/emr/orders/${orderId}/execute/`, executeData),
};

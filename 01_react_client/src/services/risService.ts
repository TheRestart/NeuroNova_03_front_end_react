import apiClient from './apiClient';

export interface Study {
    study_id: string;
    study_instance_uid: string;
    patient_name: string;
    patient_id: string;
    study_date: string;
    modality: string;
    study_description: string;
    series_count: number;
}

export interface StudyListResponse {
    success: boolean;
    data: {
        studies: Study[];
        total_studies: number;
        current_page: number;
        total_pages: number;
    };
}

export interface Patient {
    patient_id: string;
    name: string;
    birth_date: string;
    gender: string;
}

export interface PatientListResponse {
    success: boolean;
    patients: Patient[];
    total: number;
}

export interface DicomUploadResponse {
    success: boolean;
    message: string;
    patient_id: string | null;
    orthanc_response: any;
}

export const risService = {
    // Get all studies (paginated)
    getStudies: async (page = 1, pageSize = 10): Promise<StudyListResponse> => {
        const response = await apiClient.get(`/ris/test/studies/?page=${page}&page_size=${pageSize}`);
        return response.data;
    },

    // Search studies
    searchStudies: async (query: string): Promise<Study[]> => {
        const response = await apiClient.get(`/ris/studies/search/?patient_name=${query}`);
        return response.data;
    },

    // Get Viewer URL (Proxy)
    getViewerUrl: (studyInstanceUid: string) => {
        // OHIF Viewer URL via Django Proxy
        // Format: /api/ris/viewer/viewer/{StudyInstanceUID}
        return `/api/ris/viewer/viewer/${studyInstanceUid}`;
    },

    // Get patients for DICOM upload
    getPatients: async (search?: string): Promise<PatientListResponse> => {
        const params = search ? `?search=${encodeURIComponent(search)}` : '';
        const response = await apiClient.get(`/ris/patients/${params}`);
        return response.data;
    },

    // Upload DICOM file with patient selection
    uploadDicom: async (file: File, patientId?: string): Promise<DicomUploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        if (patientId) {
            formData.append('patient_id', patientId);
        }

        const response = await apiClient.post('/ris/upload/dicom/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

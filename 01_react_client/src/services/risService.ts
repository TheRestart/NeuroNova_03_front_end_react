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
    }
};

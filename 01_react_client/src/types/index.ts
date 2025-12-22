// 역할 타입
export type UserRole = 'admin' | 'doctor' | 'rib' | 'lab' | 'nurse' | 'patient' | 'external';

// 사용자 인터페이스
export interface User {
    id: number;
    username: string;
    email?: string;
    role: UserRole;
    employee_id?: string;
    department?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    created_at: string;
}

// API 응답 타입
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

// 로그인 요청/응답
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

// 권한 타입
export type Permission =
    | 'patient.view'
    | 'patient.edit'
    | 'order.create'
    | 'report.sign'
    | 'ai_result.approve';

// Alert 타입
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'CODE_BLUE';

export interface Alert {
    id: number;
    user: number;
    severity: AlertSeverity;
    title: string;
    message: string;
    source: string;
    is_read: boolean;
    created_at: string;
}

// Patient 타입
export interface Patient {
    id: number;
    openemr_patient_id: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    date_of_birth: string;
    gender: string;
    phone_home?: string;
    phone_mobile?: string;
    email?: string;
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    last_synced_at?: string;
}

// Encounter 타입
export interface Encounter {
    id: number;
    patient: number;
    openemr_encounter_id: string;
    encounter_date: string;
    encounter_type?: string;
    provider_name?: string;
    diagnosis?: string;
    prescription?: string;
}

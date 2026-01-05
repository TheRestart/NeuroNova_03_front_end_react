import apiClient from '../api/axios';
import { LoginRequest, LoginResponse, User } from '../types';

export const authAPI = {
    // Login
    login: (data: LoginRequest) =>
        apiClient.post<LoginResponse>('/acct/login/', data),

    // Register
    register: (userData: any) =>
        apiClient.post<User>('/acct/users/register/', userData),

    // Logout
    logout: () =>
        apiClient.post('/acct/logout/'),

    // Get Me
    getMe: () =>
        apiClient.get<User>('/acct/me/'),

    // Get Users (Admin only)
    getUsers: () =>
        apiClient.get<User[]>('/acct/users/'),
};

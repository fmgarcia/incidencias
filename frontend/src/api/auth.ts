/**
 * Funciones de API para autenticación
 */

import apiClient from './apiClient';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  full_name?: string;
  email?: string;
  role?: string;
}

export interface User {
  id: number;
  username: string;
  full_name: string | null;
  email: string | null;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

/**
 * Realizar login
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
}

/**
 * Registrar nuevo usuario
 */
export async function register(data: RegisterData): Promise<{ message: string; user: User }> {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
}

/**
 * Obtener perfil del usuario autenticado
 */
export async function getMe(): Promise<{ user: User }> {
  const response = await apiClient.get('/auth/me');
  return response.data;
}

/**
 * Actualizar perfil
 */
export async function updateMe(data: Partial<User>): Promise<{ user: User }> {
  const response = await apiClient.put('/auth/me', data);
  return response.data;
}

import apiClient from './apiClient';

export interface Client {
  id: string;
  name: string;
  cif: string;
  address?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  contact_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  name: string;
  cif: string;
  address?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  contact_name?: string;
  is_active?: boolean;
}

export interface UpdateClientData extends Partial<CreateClientData> {}

export const clientsApi = {
  getAll: async () => {
    const response = await apiClient.get<Client[]>('/clients');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Client>(`/clients/${id}`);
    return response.data;
  },

  create: async (data: CreateClientData) => {
    const response = await apiClient.post<Client>('/clients', data);
    return response.data;
  },

  update: async (id: string, data: UpdateClientData) => {
    const response = await apiClient.patch<Client>(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/clients/${id}`);
  },
};

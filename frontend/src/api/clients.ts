import apiClient from "./apiClient";

export interface Client {
  id: string;
  name: string;
  legal_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  name: string;
  legal_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  notes?: string;
  is_active?: boolean;
}

export interface UpdateClientData extends Partial<CreateClientData> {}

export interface ClientsResponse {
  clients: Client[];
  total: number;
}

export const clientsApi = {
  getAll: async () => {
    const response = await apiClient.get<ClientsResponse>("/clients");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ client: Client }>(`/clients/${id}`);
    return response.data.client;
  },

  create: async (data: CreateClientData) => {
    const response = await apiClient.post<{ client: Client }>("/clients", data);
    return response.data.client;
  },

  update: async (id: string, data: UpdateClientData) => {
    const response = await apiClient.patch<{ client: Client }>(
      `/clients/${id}`,
      data
    );
    return response.data.client;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/clients/${id}`);
  },
};

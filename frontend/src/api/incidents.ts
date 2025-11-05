import apiClient from './apiClient';

export interface Incident {
  id: string;
  reference: string;
  title: string;
  description: string;
  client_id: string;
  status_id: number;
  priority_id: number;
  severity_id?: number;
  problem_type_id?: number;
  category_id?: number;
  assigned_to?: string;
  reported_by: string;
  reported_date: string;
  due_date?: string;
  closed_at?: string;
  resolution?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
  };
  status?: {
    id: number;
    name: string;
  };
  priority?: {
    id: number;
    name: string;
    color: string;
  };
  severity?: {
    id: number;
    name: string;
  };
  assignedUser?: {
    id: string;
    name: string;
  };
  reportedUser?: {
    id: string;
    name: string;
  };
  _count?: {
    comments: number;
    attachments: number;
    timeEntries: number;
  };
}

export interface CreateIncidentData {
  title: string;
  description: string;
  client_id: string;
  status_id?: number;
  priority_id: number;
  severity_id?: number;
  problem_type_id?: number;
  category_id?: number;
  assigned_to?: string;
  due_date?: string;
}

export interface UpdateIncidentData extends Partial<CreateIncidentData> {
  resolution?: string;
}

export interface IncidentFilters {
  clientId?: string;
  statusId?: number;
  priorityId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IncidentSummary {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  byPriority: Record<string, number>;
  bySeverity: Record<string, number>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const incidentsApi = {
  getAll: async (filters?: IncidentFilters) => {
    const response = await apiClient.get<PaginatedResponse<Incident>>('/incidents', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Incident>(`/incidents/${id}`);
    return response.data;
  },

  getSummary: async () => {
    const response = await apiClient.get<IncidentSummary>('/incidents/summary');
    return response.data;
  },

  create: async (data: CreateIncidentData) => {
    const response = await apiClient.post<Incident>('/incidents', data);
    return response.data;
  },

  update: async (id: string, data: UpdateIncidentData) => {
    const response = await apiClient.patch<Incident>(`/incidents/${id}`, data);
    return response.data;
  },

  changeStatus: async (id: string, status_id: number) => {
    const response = await apiClient.patch<Incident>(`/incidents/${id}/status`, {
      status_id,
    });
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/incidents/${id}`);
  },
};

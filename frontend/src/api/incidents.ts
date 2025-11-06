import apiClient from "./apiClient";

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
    name?: string;
    code?: string;
    label?: string;
    is_closed?: boolean;
  };
  priority?: {
    id: number;
    name?: string;
    code?: string;
    label?: string;
    color?: string;
  };
  severity?: {
    id: number;
    name?: string;
    label?: string;
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
  highPriorityIncidents?: Incident[];
}

export interface PaginatedResponse<T> {
  data?: T[];
  incidents?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const incidentsApi = {
  getAll: async (filters?: IncidentFilters) => {
    const response = await apiClient.get<PaginatedResponse<Incident>>(
      "/incidents",
      {
        params: filters,
      }
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ incident: Incident }>(
      `/incidents/${id}`
    );
    return response.data.incident;
  },

  getSummary: async () => {
    const response = await apiClient.get<{ summary: any }>(
      "/incidents/summary"
    );
    const data = response.data.summary;

    // El backend ya devuelve los contadores directamente
    const summary: IncidentSummary = {
      total: data.total || 0,
      open: data.open || 0,
      in_progress: data.in_progress || 0,
      resolved: data.resolved || 0,
      closed: data.closed || 0,
      byPriority: {},
      bySeverity: {},
    };

    // Procesar por prioridad con literales
    if (data.byPriority && Array.isArray(data.byPriority)) {
      data.byPriority.forEach((item: any) => {
        const priorityName = item.priorityLabel || "Sin prioridad";
        summary.byPriority[priorityName] = item.count || 0;
      });
    }

    // Agregar incidencias de alta prioridad
    summary.highPriorityIncidents = data.highPriorityIncidents || [];

    return summary;
  },

  create: async (data: CreateIncidentData) => {
    // Transformar snake_case a camelCase para el backend
    const payload = {
      clientId: Number(data.client_id),
      title: data.title,
      description: data.description,
      statusId: data.status_id || 1,
      priorityId: data.priority_id,
      severityId: data.severity_id,
      problemTypeId: data.problem_type_id,
      categoryId: data.category_id,
      assignedToId: data.assigned_to ? Number(data.assigned_to) : undefined,
      due_at: data.due_date,
    };
    const response = await apiClient.post<{
      incident: Incident;
      message: string;
    }>("/incidents", payload);
    return response.data.incident;
  },

  update: async (id: string, data: UpdateIncidentData) => {
    const response = await apiClient.put<{
      incident: Incident;
      message: string;
    }>(`/incidents/${id}`, data);
    return response.data.incident;
  },

  changeStatus: async (id: string, statusId: number) => {
    const response = await apiClient.patch<{
      incident: Incident;
      message: string;
    }>(`/incidents/${id}/status`, {
      statusId,
    });
    return response.data.incident;
  },

  close: async (id: string, resolution?: string, root_cause?: string) => {
    const response = await apiClient.patch<{
      incident: Incident;
      message: string;
    }>(`/incidents/${id}/close`, {
      resolution,
      root_cause,
    });
    return response.data.incident;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/incidents/${id}`);
  },
};

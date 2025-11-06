import apiClient from "./apiClient";

export interface TimeEntry {
  id: string;
  incident_id: string;
  user_id?: number;
  start_time: string;
  end_time?: string;
  minutes: number;
  description?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    username: string;
    full_name?: string;
  };
}

export interface CreateTimeEntryData {
  start_time: string;
  end_time?: string;
  minutes: number;
  description?: string;
}

export interface TimeEntriesResponse {
  timeEntries: TimeEntry[];
  total: number;
  totalMinutes: number;
}

export const timeEntriesApi = {
  // Listar time entries de una incidencia
  getByIncident: async (incidentId: string) => {
    const response = await apiClient.get<TimeEntriesResponse>(
      `/incidents/${incidentId}/time-entries`
    );
    return response.data;
  },

  // Crear un time entry
  create: async (incidentId: string, data: CreateTimeEntryData) => {
    const response = await apiClient.post<{
      timeEntry: TimeEntry;
      message: string;
    }>(`/incidents/${incidentId}/time-entries`, data);
    return response.data.timeEntry;
  },

  // Eliminar un time entry
  delete: async (id: string) => {
    await apiClient.delete(`/time-entries/${id}`);
  },
};

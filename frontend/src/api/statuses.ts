import apiClient from "./apiClient";

export interface Status {
  id: number;
  code: string;
  label: string;
  description?: string;
  is_closed: boolean;
  display_order: number;
}

interface StatusesResponse {
  statuses: Status[];
}

export const statusesApi = {
  getAll: async (): Promise<Status[]> => {
    const response = await apiClient.get<StatusesResponse>("/statuses");
    return response.data.statuses || [];
  },
};

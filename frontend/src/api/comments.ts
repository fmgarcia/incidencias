import apiClient from "./apiClient";

export interface Comment {
  id: string;
  incident_id: string;
  user_id?: number;
  content: string;
  visibility: "public" | "internal";
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    username: string;
    full_name?: string;
  };
}

export interface CreateCommentData {
  content: string;
  visibility?: "public" | "internal";
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
}

export const commentsApi = {
  // Listar comentarios de una incidencia
  getByIncident: async (incidentId: string) => {
    const response = await apiClient.get<CommentsResponse>(
      `/incidents/${incidentId}/comments`
    );
    return response.data;
  },

  // Crear un comentario
  create: async (incidentId: string, data: CreateCommentData) => {
    const response = await apiClient.post<{
      comment: Comment;
      message: string;
    }>(`/incidents/${incidentId}/comments`, data);
    return response.data.comment;
  },

  // Actualizar un comentario
  update: async (id: string, data: Partial<CreateCommentData>) => {
    const response = await apiClient.put<{ comment: Comment }>(
      `/comments/${id}`,
      data
    );
    return response.data.comment;
  },

  // Eliminar un comentario
  delete: async (id: string) => {
    await apiClient.delete(`/comments/${id}`);
  },
};

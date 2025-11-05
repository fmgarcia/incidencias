/**
 * Schemas de validación para incidencias
 */

import { z } from 'zod';

// Schema para crear una incidencia
export const createIncidentSchema = z.object({
  clientId: z.number().int().positive('El ID del cliente debe ser un número positivo'),
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(255, 'El título no puede exceder 255 caracteres'),
  description: z.string().optional().nullable(),
  statusId: z.number().int().positive('El ID del estado debe ser un número positivo'),
  priorityId: z.number().int().positive().optional().nullable(),
  problemTypeId: z.number().int().positive().optional().nullable(),
  severityId: z.number().int().positive().optional().nullable(),
  categoryId: z.number().int().positive().optional().nullable(),
  reported_by: z.string().max(200).optional().nullable(),
  reported_contact: z.string().max(200).optional().nullable(),
  assignedToId: z.number().int().positive().optional().nullable(),
  estimated_minutes: z.number().int().min(0).default(0).optional(),
  due_at: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

// Schema para actualizar una incidencia
export const updateIncidentSchema = z.object({
  clientId: z.number().int().positive().optional(),
  title: z.string().min(3).max(255).optional(),
  description: z.string().optional().nullable(),
  statusId: z.number().int().positive().optional(),
  priorityId: z.number().int().positive().optional().nullable(),
  problemTypeId: z.number().int().positive().optional().nullable(),
  severityId: z.number().int().positive().optional().nullable(),
  categoryId: z.number().int().positive().optional().nullable(),
  reported_by: z.string().max(200).optional().nullable(),
  reported_contact: z.string().max(200).optional().nullable(),
  assignedToId: z.number().int().positive().optional().nullable(),
  estimated_minutes: z.number().int().min(0).optional().nullable(),
  time_spent_minutes: z.number().int().min(0).optional().nullable(),
  due_at: z.string().datetime().optional().nullable(),
  closed_at: z.string().datetime().optional().nullable(),
  resolution: z.string().optional().nullable(),
  root_cause: z.string().optional().nullable(),
  sla_breach: z.boolean().optional(),
  archived: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// Schema para cambiar el estado de una incidencia
export const changeStatusSchema = z.object({
  statusId: z.number().int().positive('El ID del estado debe ser un número positivo'),
  resolution: z.string().optional().nullable(),
  root_cause: z.string().optional().nullable(),
});

// Schema para query params de búsqueda/filtrado
export const incidentQuerySchema = z.object({
  clientId: z.coerce.number().int().positive().optional(),
  statusId: z.coerce.number().int().positive().optional(),
  priorityId: z.coerce.number().int().positive().optional(),
  severityId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  problemTypeId: z.coerce.number().int().positive().optional(),
  assignedTo: z.coerce.number().int().positive().optional(),
  createdBy: z.coerce.number().int().positive().optional(),
  q: z.string().optional(), // Búsqueda por referencia o título
  archived: z.coerce.boolean().optional(),
  sla_breach: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  sortBy: z
    .enum(['opened_at', 'updated_at', 'due_at', 'priority_id', 'status_id'])
    .default('opened_at')
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

// Schema para añadir time entry
export const createTimeEntrySchema = z.object({
  incidentId: z.coerce.number().int().positive(),
  userId: z.number().int().positive().optional().nullable(),
  start_time: z.string().datetime('Debe ser una fecha válida'),
  end_time: z.string().datetime('Debe ser una fecha válida').optional().nullable(),
  minutes: z.number().int().min(0, 'Los minutos deben ser un número positivo'),
  description: z.string().max(500).optional().nullable(),
});

// Schema para añadir comentario
export const createCommentSchema = z.object({
  incidentId: z.coerce.number().int().positive(),
  userId: z.number().int().positive().optional().nullable(),
  content: z.string().min(1, 'El contenido del comentario no puede estar vacío'),
  visibility: z.enum(['public', 'internal']).default('public').optional(),
});

// Tipos inferidos
export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
export type UpdateIncidentInput = z.infer<typeof updateIncidentSchema>;
export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;
export type IncidentQueryInput = z.infer<typeof incidentQuerySchema>;
export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

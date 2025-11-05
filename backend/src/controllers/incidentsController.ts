/**
 * Controlador de incidencias
 * Maneja todas las operaciones CRUD y acciones sobre incidencias
 */

import { Request, Response } from 'express';
import prisma from '../db/client';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import {
  CreateIncidentInput,
  UpdateIncidentInput,
  ChangeStatusInput,
  IncidentQueryInput,
} from '../validations/incident.schema';
import { generateReference } from '../utils/generateReference';
import { paginate } from '../utils/pagination';

/**
 * Listar incidencias con filtros y paginación
 * GET /api/incidents
 */
export const listIncidents = asyncHandler(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: IncidentQueryInput = req.query as any;

  const {
    clientId,
    statusId,
    priorityId,
    severityId,
    categoryId,
    problemTypeId,
    assignedTo,
    createdBy,
    q,
    archived,
    sla_breach,
    page = 1,
    limit = 20,
    sortBy = 'opened_at',
    sortOrder = 'desc',
  } = filters;

  // Construir el where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (clientId) where.client_id = clientId;
  if (statusId) where.status_id = statusId;
  if (priorityId) where.priority_id = priorityId;
  if (severityId) where.severity_id = severityId;
  if (categoryId) where.category_id = categoryId;
  if (problemTypeId) where.problem_type_id = problemTypeId;
  if (assignedTo) where.assigned_to = assignedTo;
  if (createdBy) where.created_by = createdBy;
  if (archived !== undefined) where.archived = archived;
  if (sla_breach !== undefined) where.sla_breach = sla_breach;

  // Búsqueda por texto en referencia o título
  if (q) {
    where.OR = [
      { reference: { contains: q } },
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  // Contar total de registros
  const total = await prisma.incident.count({ where });

  // Paginación
  const { skip, take } = paginate(page, limit);

  // Obtener incidencias
  const incidents = await prisma.incident.findMany({
    where,
    include: {
      client: {
        select: {
          id: true,
          name: true,
          contact_email: true,
        },
      },
      status: {
        select: {
          id: true,
          code: true,
          label: true,
          is_closed: true,
        },
      },
      priority: {
        select: {
          id: true,
          code: true,
          label: true,
          sla_hours: true,
        },
      },
      severity: {
        select: {
          id: true,
          label: true,
        },
      },
      category: {
        select: {
          id: true,
          label: true,
        },
      },
      problem_type: {
        select: {
          id: true,
          code: true,
          label: true,
        },
      },
      assigned_user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      creator: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      _count: {
        select: {
          comments: true,
          time_entries: true,
          attachments: true,
        },
      },
    },
    skip,
    take,
    orderBy: { [sortBy]: sortOrder },
  });

  res.json({
    incidents,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * Obtener detalle de una incidencia
 * GET /api/incidents/:id
 */
export const getIncidentById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const incident = await prisma.incident.findUnique({
    where: { id },
    include: {
      client: true,
      status: true,
      priority: true,
      severity: true,
      category: true,
      problem_type: true,
      assigned_user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          email: true,
        },
      },
      creator: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      time_entries: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              full_name: true,
            },
          },
        },
        orderBy: { start_time: 'desc' },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              full_name: true,
            },
          },
          attachments: true,
        },
        orderBy: { created_at: 'asc' },
      },
      attachments: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              full_name: true,
            },
          },
        },
        orderBy: { uploaded_at: 'desc' },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!incident) {
    throw new AppError('Incidencia no encontrada', 404);
  }

  res.json({ incident });
});

/**
 * Crear nueva incidencia
 * POST /api/incidents
 */
export const createIncident = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data: CreateIncidentInput = req.body;

  // Generar referencia única (formato: INC-2025-0001)
  const reference = await generateReference();

  // Extraer tags si existen
  const { tags, ...incidentData } = data;

  // Crear la incidencia
  const incident = await prisma.incident.create({
    data: {
      reference,
      client_id: incidentData.clientId,
      title: incidentData.title,
      description: incidentData.description || null,
      status_id: incidentData.statusId,
      priority_id: incidentData.priorityId || null,
      problem_type_id: incidentData.problemTypeId || null,
      severity_id: incidentData.severityId || null,
      category_id: incidentData.categoryId || null,
      reported_by: incidentData.reported_by || null,
      reported_contact: incidentData.reported_contact || null,
      assigned_to: incidentData.assignedToId || null,
      created_by: req.user?.id || null,
      estimated_minutes: incidentData.estimated_minutes || 0,
      due_at: incidentData.due_at ? new Date(incidentData.due_at) : null,
      opened_at: new Date(),
    },
    include: {
      client: true,
      status: true,
      priority: true,
      severity: true,
      category: true,
      problem_type: true,
      assigned_user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
  });

  // Crear tags si existen
  if (tags && tags.length > 0) {
    for (const tagLabel of tags) {
      // Buscar o crear el tag
      let tag = await prisma.tag.findFirst({
        where: { label: tagLabel },
      });

      if (!tag) {
        tag = await prisma.tag.create({
          data: { label: tagLabel },
        });
      }

      // Asociar tag con la incidencia
      await prisma.incidentTag.create({
        data: {
          incident_id: incident.id,
          tag_id: tag.id,
        },
      });
    }
  }

  res.status(201).json({
    message: 'Incidencia creada exitosamente',
    incident,
  });
});

/**
 * Actualizar incidencia
 * PUT /api/incidents/:id
 */
export const updateIncident = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data: UpdateIncidentInput = req.body;

  // Verificar que existe
  const existing = await prisma.incident.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Incidencia no encontrada', 404);
  }

  // Extraer tags si existen
  const { tags, ...updateData } = data;

  // Actualizar la incidencia
  const incident = await prisma.incident.update({
    where: { id },
    data: {
      ...(updateData.clientId !== undefined && { client_id: updateData.clientId }),
      ...(updateData.title !== undefined && { title: updateData.title }),
      ...(updateData.description !== undefined && { description: updateData.description }),
      ...(updateData.statusId !== undefined && { status_id: updateData.statusId }),
      ...(updateData.priorityId !== undefined && { priority_id: updateData.priorityId }),
      ...(updateData.problemTypeId !== undefined && {
        problem_type_id: updateData.problemTypeId,
      }),
      ...(updateData.severityId !== undefined && { severity_id: updateData.severityId }),
      ...(updateData.categoryId !== undefined && { category_id: updateData.categoryId }),
      ...(updateData.reported_by !== undefined && { reported_by: updateData.reported_by }),
      ...(updateData.reported_contact !== undefined && {
        reported_contact: updateData.reported_contact,
      }),
      ...(updateData.assignedToId !== undefined && { assigned_to: updateData.assignedToId }),
      ...(updateData.estimated_minutes !== undefined && {
        estimated_minutes: updateData.estimated_minutes,
      }),
      ...(updateData.time_spent_minutes !== undefined && {
        time_spent_minutes: updateData.time_spent_minutes,
      }),
      ...(updateData.due_at !== undefined && {
        due_at: updateData.due_at ? new Date(updateData.due_at) : null,
      }),
      ...(updateData.closed_at !== undefined && {
        closed_at: updateData.closed_at ? new Date(updateData.closed_at) : null,
      }),
      ...(updateData.resolution !== undefined && { resolution: updateData.resolution }),
      ...(updateData.root_cause !== undefined && { root_cause: updateData.root_cause }),
      ...(updateData.sla_breach !== undefined && { sla_breach: updateData.sla_breach }),
      ...(updateData.archived !== undefined && { archived: updateData.archived }),
    },
    include: {
      client: true,
      status: true,
      priority: true,
      severity: true,
      category: true,
      problem_type: true,
      assigned_user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
  });

  // Actualizar tags si se proporcionaron
  if (tags) {
    // Eliminar tags existentes
    await prisma.incidentTag.deleteMany({
      where: { incident_id: id },
    });

    // Crear nuevos tags
    for (const tagLabel of tags) {
      let tag = await prisma.tag.findFirst({
        where: { label: tagLabel },
      });

      if (!tag) {
        tag = await prisma.tag.create({
          data: { label: tagLabel },
        });
      }

      await prisma.incidentTag.create({
        data: {
          incident_id: id,
          tag_id: tag.id,
        },
      });
    }
  }

  res.json({
    message: 'Incidencia actualizada exitosamente',
    incident,
  });
});

/**
 * Cambiar estado de incidencia
 * PATCH /api/incidents/:id/status
 */
export const changeIncidentStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { statusId, resolution, root_cause }: ChangeStatusInput = req.body;

  // Verificar que existe
  const existing = await prisma.incident.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Incidencia no encontrada', 404);
  }

  // Verificar que el status existe
  const status = await prisma.status.findUnique({ where: { id: statusId } });
  if (!status) {
    throw new AppError('Estado no encontrado', 404);
  }

  // Si el status está cerrado, marcar closed_at
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    status_id: statusId,
  };

  if (status.is_closed && !existing.closed_at) {
    updateData.closed_at = new Date();
  }

  if (resolution !== undefined) {
    updateData.resolution = resolution;
  }

  if (root_cause !== undefined) {
    updateData.root_cause = root_cause;
  }

  const incident = await prisma.incident.update({
    where: { id },
    data: updateData,
    include: {
      status: true,
    },
  });

  res.json({
    message: 'Estado actualizado exitosamente',
    incident,
  });
});

/**
 * Eliminar incidencia (soft delete - archivar)
 * DELETE /api/incidents/:id
 */
export const deleteIncident = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const incident = await prisma.incident.findUnique({ where: { id } });
  if (!incident) {
    throw new AppError('Incidencia no encontrada', 404);
  }

  // Soft delete - marcar como archivada
  await prisma.incident.update({
    where: { id },
    data: { archived: true },
  });

  res.json({
    message: 'Incidencia archivada exitosamente',
  });
});

/**
 * Obtener resumen de incidencias
 * GET /api/incidents/summary
 */
export const getIncidentsSummary = asyncHandler(async (req: Request, res: Response) => {
  // Total de incidencias
  const total = await prisma.incident.count({
    where: { archived: false },
  });

  // Por estado
  const byStatus = await prisma.incident.groupBy({
    by: ['status_id'],
    _count: true,
    where: { archived: false },
  });

  // Por prioridad
  const byPriority = await prisma.incident.groupBy({
    by: ['priority_id'],
    _count: true,
    where: { archived: false },
  });

  // Por cliente (top 10)
  const byClient = await prisma.incident.groupBy({
    by: ['client_id'],
    _count: true,
    where: { archived: false },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  // Tiempo total invertido
  const timeStats = await prisma.incident.aggregate({
    _sum: {
      time_spent_minutes: true,
      estimated_minutes: true,
    },
    where: { archived: false },
  });

  // Incidencias con SLA breach
  const slaBreaches = await prisma.incident.count({
    where: {
      archived: false,
      sla_breach: true,
    },
  });

  res.json({
    summary: {
      total,
      byStatus,
      byPriority,
      byClient,
      timeStats: {
        totalSpentMinutes: timeStats._sum.time_spent_minutes || 0,
        totalEstimatedMinutes: timeStats._sum.estimated_minutes || 0,
      },
      slaBreaches,
    },
  });
});

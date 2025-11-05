/**
 * Controlador de registros de tiempo (time entries)
 */

import { Request, Response } from 'express';
import prisma from '../db/client';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * Añadir registro de tiempo a una incidencia
 * POST /api/incidents/:incidentId/time-entries
 */
export const addTimeEntry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const incidentId = BigInt(req.params.incidentId);
  const { userId, start_time, end_time, minutes, description } = req.body;

  // Verificar que la incidencia existe
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
  });

  if (!incident) {
    throw new AppError('Incidencia no encontrada', 404);
  }

  // Crear el registro de tiempo
  const timeEntry = await prisma.timeEntry.create({
    data: {
      incident_id: incidentId,
      user_id: userId || req.user?.id || null,
      start_time: new Date(start_time),
      end_time: end_time ? new Date(end_time) : null,
      minutes: minutes,
      description: description || null,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
  });

  // Actualizar el tiempo total de la incidencia
  const totalMinutes = await prisma.timeEntry.aggregate({
    where: { incident_id: incidentId },
    _sum: { minutes: true },
  });

  await prisma.incident.update({
    where: { id: incidentId },
    data: {
      time_spent_minutes: totalMinutes._sum.minutes || 0,
    },
  });

  res.status(201).json({
    message: 'Registro de tiempo añadido exitosamente',
    timeEntry,
  });
});

/**
 * Listar registros de tiempo de una incidencia
 * GET /api/incidents/:incidentId/time-entries
 */
export const listTimeEntries = asyncHandler(async (req: Request, res: Response) => {
  const incidentId = BigInt(req.params.incidentId);

  const timeEntries = await prisma.timeEntry.findMany({
    where: { incident_id: incidentId },
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
  });

  const totalMinutes = await prisma.timeEntry.aggregate({
    where: { incident_id: incidentId },
    _sum: { minutes: true },
  });

  res.json({
    timeEntries,
    total: timeEntries.length,
    totalMinutes: totalMinutes._sum.minutes || 0,
  });
});

/**
 * Eliminar registro de tiempo
 * DELETE /api/time-entries/:id
 */
export const deleteTimeEntry = asyncHandler(async (req: Request, res: Response) => {
  const id = BigInt(req.params.id);

  const timeEntry = await prisma.timeEntry.findUnique({
    where: { id },
  });

  if (!timeEntry) {
    throw new AppError('Registro de tiempo no encontrado', 404);
  }

  const incidentId = timeEntry.incident_id;

  await prisma.timeEntry.delete({
    where: { id },
  });

  // Recalcular tiempo total de la incidencia
  const totalMinutes = await prisma.timeEntry.aggregate({
    where: { incident_id: incidentId },
    _sum: { minutes: true },
  });

  await prisma.incident.update({
    where: { id: incidentId },
    data: {
      time_spent_minutes: totalMinutes._sum.minutes || 0,
    },
  });

  res.json({
    message: 'Registro de tiempo eliminado exitosamente',
  });
});

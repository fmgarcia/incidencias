/**
 * Controlador de comentarios
 */

import { Request, Response } from 'express';
import prisma from '../db/client';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * Añadir comentario a una incidencia
 * POST /api/incidents/:incidentId/comments
 */
export const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const incidentId = BigInt(req.params.incidentId);
  const { content, visibility } = req.body;

  // Verificar que la incidencia existe
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
  });

  if (!incident) {
    throw new AppError('Incidencia no encontrada', 404);
  }

  const comment = await prisma.comment.create({
    data: {
      incident_id: incidentId,
      user_id: req.user?.id || null,
      content,
      visibility: visibility || 'public',
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

  res.status(201).json({
    message: 'Comentario añadido exitosamente',
    comment,
  });
});

/**
 * Listar comentarios de una incidencia
 * GET /api/incidents/:incidentId/comments
 */
export const listComments = asyncHandler(async (req: Request, res: Response) => {
  const incidentId = BigInt(req.params.incidentId);

  const comments = await prisma.comment.findMany({
    where: { incident_id: incidentId },
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
  });

  res.json({
    comments,
    total: comments.length,
  });
});

/**
 * Actualizar comentario
 * PUT /api/comments/:id
 */
export const updateComment = asyncHandler(async (req: Request, res: Response) => {
  const id = BigInt(req.params.id);
  const { content, visibility } = req.body;

  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Comentario no encontrado', 404);
  }

  const comment = await prisma.comment.update({
    where: { id },
    data: {
      ...(content !== undefined && { content }),
      ...(visibility !== undefined && { visibility }),
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

  res.json({
    message: 'Comentario actualizado exitosamente',
    comment,
  });
});

/**
 * Eliminar comentario
 * DELETE /api/comments/:id
 */
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const id = BigInt(req.params.id);

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    throw new AppError('Comentario no encontrado', 404);
  }

  await prisma.comment.delete({ where: { id } });

  res.json({
    message: 'Comentario eliminado exitosamente',
  });
});

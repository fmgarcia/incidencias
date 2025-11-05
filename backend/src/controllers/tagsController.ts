/**
 * Controlador de tags
 */

import { Request, Response } from 'express';
import prisma from '../db/client';
import { AppError, asyncHandler } from '../middleware/errorHandler';

/**
 * Listar todos los tags
 * GET /api/tags
 */
export const listTags = asyncHandler(async (req: Request, res: Response) => {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          incidents: true,
        },
      },
    },
    orderBy: { label: 'asc' },
  });

  res.json({ tags, total: tags.length });
});

/**
 * Crear tag
 * POST /api/tags
 */
export const createTag = asyncHandler(async (req: Request, res: Response) => {
  const { label } = req.body;

  const tag = await prisma.tag.create({
    data: { label },
  });

  res.status(201).json({
    message: 'Tag creado exitosamente',
    tag,
  });
});

/**
 * Eliminar tag
 * DELETE /api/tags/:id
 */
export const deleteTag = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const tag = await prisma.tag.findUnique({
    where: { id },
  });

  if (!tag) {
    throw new AppError('Tag no encontrado', 404);
  }

  await prisma.tag.delete({
    where: { id },
  });

  res.json({
    message: 'Tag eliminado exitosamente',
  });
});

/**
 * Controlador de clientes
 */

import { Request, Response } from 'express';
import prisma from '../db/client';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { CreateClientInput, UpdateClientInput } from '../validations/client.schema';

/**
 * Listar todos los clientes
 * GET /api/clients
 */
export const listClients = asyncHandler(async (req: Request, res: Response) => {
  const clients = await prisma.client.findMany({
    include: {
      _count: {
        select: {
          incidents: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  res.json({ clients, total: clients.length });
});

/**
 * Obtener cliente por ID
 * GET /api/clients/:id
 */
export const getClientById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      incidents: {
        include: {
          status: true,
          priority: true,
        },
        orderBy: { opened_at: 'desc' },
        take: 10,
      },
      _count: {
        select: {
          incidents: true,
        },
      },
    },
  });

  if (!client) {
    throw new AppError('Cliente no encontrado', 404);
  }

  res.json({ client });
});

/**
 * Crear cliente
 * POST /api/clients
 */
export const createClient = asyncHandler(async (req: Request, res: Response) => {
  const data: CreateClientInput = req.body;

  const client = await prisma.client.create({
    data: {
      name: data.name,
      legal_name: data.legal_name || null,
      contact_name: data.contact_name || null,
      contact_email: data.contact_email || null,
      contact_phone: data.contact_phone || null,
      address: data.address || null,
      city: data.city || null,
      province: data.province || null,
      postal_code: data.postal_code || null,
      country: data.country || 'España',
      notes: data.notes || null,
      is_active: data.is_active !== undefined ? data.is_active : true,
    },
  });

  res.status(201).json({
    message: 'Cliente creado exitosamente',
    client,
  });
});

/**
 * Actualizar cliente
 * PUT /api/clients/:id
 */
export const updateClient = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data: UpdateClientInput = req.body;

  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Cliente no encontrado', 404);
  }

  const client = await prisma.client.update({
    where: { id },
    data: {
      name: data.name,
      legal_name: data.legal_name ?? null,
      contact_name: data.contact_name ?? null,
      contact_email: data.contact_email ?? null,
      contact_phone: data.contact_phone ?? null,
      address: data.address ?? null,
      city: data.city ?? null,
      province: data.province ?? null,
      postal_code: data.postal_code ?? null,
      country: data.country ?? 'España',
      notes: data.notes ?? null,
      is_active: data.is_active ?? true,
    },
  });

  res.json({
    message: 'Cliente actualizado exitosamente',
    client,
  });
});

/**
 * Eliminar cliente
 * DELETE /api/clients/:id
 */
export const deleteClient = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const existing = await prisma.client.findUnique({
    where: { id },
    include: {
      _count: {
        select: { incidents: true },
      },
    },
  });

  if (!existing) {
    throw new AppError('Cliente no encontrado', 404);
  }

  if (existing._count.incidents > 0) {
    throw new AppError('No se puede eliminar el cliente porque tiene incidencias asociadas', 400);
  }

  await prisma.client.delete({ where: { id } });

  res.json({
    message: 'Cliente eliminado exitosamente',
  });
});

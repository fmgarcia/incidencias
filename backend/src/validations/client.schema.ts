/**
 * Schemas de validación para clientes
 */

import { z } from 'zod';

// Schema para crear un cliente
export const createClientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200),
  legal_name: z.string().max(300).optional().nullable(),
  contact_name: z.string().max(150).optional().nullable(),
  contact_email: z.string().email('Email inválido').max(200).optional().nullable(),
  contact_phone: z.string().max(50).optional().nullable(),
  address: z.string().max(400).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  province: z.string().max(100).optional().nullable(),
  postal_code: z.string().max(20).optional().nullable(),
  country: z.string().max(100).default('España').optional(),
  notes: z.string().optional().nullable(),
});

// Schema para actualizar un cliente
export const updateClientSchema = createClientSchema.partial();

// Tipos inferidos
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

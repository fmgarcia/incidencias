/**
 * Schemas de validación para clientes
 */

import { z } from 'zod';

// Helper para campos string opcionales que permiten string vacío
const optionalString = (maxLength: number) =>
  z.union([z.string().max(maxLength), z.literal(''), z.null()]).optional();

// Schema para crear un cliente
export const createClientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200),
  legal_name: optionalString(300),
  contact_name: optionalString(150),
  contact_email: z
    .union([z.string().email('Email inválido').max(200), z.literal(''), z.null()])
    .optional(),
  contact_phone: optionalString(50),
  address: optionalString(400),
  city: optionalString(100),
  province: optionalString(100),
  postal_code: optionalString(20),
  country: optionalString(100),
  notes: optionalString(1000),
  is_active: z.boolean().optional(),
});

// Schema para actualizar un cliente
export const updateClientSchema = createClientSchema.partial();

// Tipos inferidos
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

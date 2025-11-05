/**
 * Schemas de validación para autenticación
 */

import { z } from 'zod';

// Schema para registro de usuario
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(100, 'El username no puede exceder 100 caracteres'),
  full_name: z
    .string()
    .min(2, 'El nombre completo debe tener al menos 2 caracteres')
    .max(200, 'El nombre completo no puede exceder 200 caracteres')
    .optional(),
  email: z
    .string()
    .email('Email inválido')
    .max(200, 'El email no puede exceder 200 caracteres')
    .optional()
    .nullable(),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres'),
  phone: z.string().max(50, 'El teléfono no puede exceder 50 caracteres').optional().nullable(),
  role: z.enum(['admin', 'tech', 'user', 'viewer']).default('user'),
});

// Schema para login
export const loginSchema = z.object({
  username: z.string().min(1, 'El username es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Schema para cambiar contraseña
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
    .max(100, 'La nueva contraseña no puede exceder 100 caracteres'),
});

// Tipos inferidos de los schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Middleware de manejo de errores global
 * Captura todos los errores de la aplicación y los formatea consistentemente
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

// Interfaz para errores personalizados
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Manejador de errores principal
export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Error de validación de Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Error de Prisma - Registro duplicado
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Registro duplicado',
        message: 'Ya existe un registro con esos datos',
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Registro no encontrado',
        message: 'El registro solicitado no existe',
      });
    }
  }

  // Error personalizado de la aplicación
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Error genérico
  console.error('❌ Error no controlado:', err);
  return res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Ha ocurrido un error inesperado',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Middleware para capturar errores asíncronos
// eslint-disable-next-line @typescript-eslint/ban-types
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

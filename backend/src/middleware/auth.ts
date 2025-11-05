/**
 * Middleware de autenticación y autorización
 * Verifica tokens JWT y roles de usuario
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AppError } from './errorHandler';
import prisma from '../db/client';

// Extender el tipo Request de Express para incluir el usuario autenticado
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string | null;
    role: string;
  };
}

// Middleware para autenticar con JWT
export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Extraer el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No se proporcionó token de autenticación', 401);
    }

    const token = authHeader.substring(7); // Eliminar 'Bearer '

    // Verificar el token
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: number;
      username: string;
      email: string | null;
      role: string;
    };

    // Verificar que el usuario aún existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        active: true,
      },
    });

    if (!user || !user.active) {
      throw new AppError('Usuario no autorizado o inactivo', 401);
    }

    // Añadir usuario al request
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Token inválido', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token expirado', 401));
    }
    next(error);
  }
};

// Middleware para autorizar roles específicos
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(`Rol '${req.user.role}' no tiene permisos para realizar esta acción`, 403)
      );
    }

    next();
  };
};

// Middleware opcional: permite tanto autenticados como no autenticados
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.jwt.secret) as {
        id: number;
        username: string;
        email: string | null;
        role: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          active: true,
        },
      });

      if (user && user.active) {
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };
      }
    }

    next();
  } catch (error) {
    // Si hay error, simplemente continúa sin usuario autenticado
    next();
  }
};

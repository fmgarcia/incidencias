/**
 * Controlador de autenticación
 * Maneja registro, login y operaciones de usuario
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../db/client';
import config from '../config';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { RegisterInput, LoginInput } from '../validations/auth.schema';

/**
 * Registro de nuevo usuario
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const data: RegisterInput = req.body;

  // Verificar si el username ya existe
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username: data.username }, ...(data.email ? [{ email: data.email }] : [])],
    },
  });

  if (existingUser) {
    throw new AppError('El usuario o email ya existe', 409);
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      username: data.username,
      full_name: data.full_name || null,
      email: data.email || null,
      phone: data.phone || null,
      role: data.role,
      password_hash: hashedPassword,
      active: true,
    },
    select: {
      id: true,
      username: true,
      full_name: true,
      email: true,
      role: true,
      created_at: true,
    },
  });

  res.status(201).json({
    message: 'Usuario registrado exitosamente',
    user,
  });
});

/**
 * Login de usuario
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password }: LoginInput = req.body;

  // Buscar usuario por username
  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user || !user.password_hash) {
    throw new AppError('Credenciales inválidas', 401);
  }

  // Verificar contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Credenciales inválidas', 401);
  }

  // Verificar que el usuario esté activo
  if (!user.active) {
    throw new AppError('Usuario inactivo', 403);
  }

  // Generar JWT
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as SignOptions
  );

  res.json({
    message: 'Login exitoso',
    token,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Usuario no autenticado', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      full_name: true,
      email: true,
      phone: true,
      role: true,
      active: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  res.json({ user });
});

/**
 * Actualizar perfil del usuario autenticado
 * PUT /api/auth/me
 */
export const updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Usuario no autenticado', 401);
  }

  const { full_name, email, phone } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(full_name !== undefined && { full_name }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
    },
    select: {
      id: true,
      username: true,
      full_name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  res.json({
    message: 'Perfil actualizado exitosamente',
    user: updatedUser,
  });
});

/**
 * Cambiar contraseña
 * POST /api/auth/change-password
 */
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Usuario no autenticado', 401);
  }

  const { currentPassword, newPassword } = req.body;

  // Buscar usuario con password
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user || !user.password_hash) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // Verificar contraseña actual
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Contraseña actual incorrecta', 401);
  }

  // Hash de la nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Actualizar contraseña
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password_hash: hashedPassword },
  });

  res.json({
    message: 'Contraseña cambiada exitosamente',
  });
});

/**
 * Listar todos los usuarios (solo admin)
 * GET /api/auth/users
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      full_name: true,
      email: true,
      role: true,
      active: true,
      created_at: true,
    },
    orderBy: { username: 'asc' },
  });

  res.json({ users, total: users.length });
});

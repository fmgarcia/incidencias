/**
 * Controlador de archivos adjuntos (attachments)
 */

import { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import prisma from '../db/client';
import config from '../config';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Asegurar que el directorio existe
    if (!fs.existsSync(config.upload.directory)) {
      fs.mkdirSync(config.upload.directory, { recursive: true });
    }
    cb(null, config.upload.directory);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// Filtro de tipos de archivo permitidos
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Permitir solo ciertos tipos de archivo
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

/**
 * Subir archivo a una incidencia
 * POST /api/incidents/:incidentId/attachments
 */
export const uploadAttachment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const incidentId = BigInt(req.params.incidentId);
  const file = req.file;

  if (!file) {
    throw new AppError('No se proporcionó ningún archivo', 400);
  }

  // Verificar que la incidencia existe
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
  });

  if (!incident) {
    // Eliminar el archivo subido
    fs.unlinkSync(file.path);
    throw new AppError('Incidencia no encontrada', 404);
  }

  const attachment = await prisma.attachment.create({
    data: {
      incident_id: incidentId,
      filename: file.originalname,
      mime_type: file.mimetype,
      file_size: file.size,
      storage_path: file.path,
      uploaded_by: req.user?.id || null,
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
    message: 'Archivo subido exitosamente',
    attachment,
  });
});

/**
 * Listar archivos de una incidencia
 * GET /api/incidents/:incidentId/attachments
 */
export const listAttachments = asyncHandler(async (req: Request, res: Response) => {
  const incidentId = BigInt(req.params.incidentId);

  const attachments = await prisma.attachment.findMany({
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
    orderBy: { uploaded_at: 'desc' },
  });

  res.json({
    attachments,
    total: attachments.length,
  });
});

/**
 * Descargar archivo
 * GET /api/attachments/:id/download
 */
export const downloadAttachment = asyncHandler(async (req: Request, res: Response) => {
  const id = BigInt(req.params.id);

  const attachment = await prisma.attachment.findUnique({
    where: { id },
  });

  if (!attachment || !attachment.storage_path) {
    throw new AppError('Archivo no encontrado', 404);
  }

  // Verificar que el archivo existe en el sistema
  if (!fs.existsSync(attachment.storage_path)) {
    throw new AppError('Archivo no encontrado en el sistema', 404);
  }

  // Enviar el archivo
  res.download(attachment.storage_path, attachment.filename);
});

/**
 * Eliminar archivo
 * DELETE /api/attachments/:id
 */
export const deleteAttachment = asyncHandler(async (req: Request, res: Response) => {
  const id = BigInt(req.params.id);

  const attachment = await prisma.attachment.findUnique({
    where: { id },
  });

  if (!attachment) {
    throw new AppError('Archivo no encontrado', 404);
  }

  // Eliminar archivo del sistema
  if (attachment.storage_path && fs.existsSync(attachment.storage_path)) {
    fs.unlinkSync(attachment.storage_path);
  }

  // Eliminar registro de la base de datos
  await prisma.attachment.delete({
    where: { id },
  });

  res.json({
    message: 'Archivo eliminado exitosamente',
  });
});

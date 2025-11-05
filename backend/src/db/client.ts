/**
 * Cliente de Prisma
 * Instancia única del cliente de Prisma para toda la aplicación
 * Implementa el patrón Singleton para evitar múltiples conexiones
 */

import { PrismaClient } from '@prisma/client';

// Extender el tipo global de Node.js para mantener la instancia en desarrollo
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Crear instancia del cliente de Prisma con opciones de logging
const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// En desarrollo, guardar la instancia globalmente para evitar múltiples conexiones
// debido al hot-reload de ts-node-dev
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;

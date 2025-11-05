/**
 * Generador de referencias únicas para incidencias
 * Formato: INC-YYYY-NNNN (ej: INC-2025-0001)
 */

import prisma from '../db/client';

export async function generateReference(): Promise<string> {
  const currentYear = new Date().getFullYear();

  // Obtener la última incidencia del año actual
  const lastIncident = await prisma.incident.findFirst({
    where: {
      reference: {
        startsWith: `INC-${currentYear}-`,
      },
    },
    orderBy: {
      reference: 'desc',
    },
  });

  let number = 1;

  if (lastIncident) {
    // Extraer el número de la referencia
    const parts = lastIncident.reference.split('-');
    const lastNumber = parseInt(parts[2], 10);
    number = lastNumber + 1;
  }

  // Formatear con ceros a la izquierda (4 dígitos)
  const paddedNumber = number.toString().padStart(4, '0');

  return `INC-${currentYear}-${paddedNumber}`;
}

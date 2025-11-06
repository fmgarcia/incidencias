/**
 * Script para actualizar el estado "Resuelta" como cerrado
 * Ejecuta: npx ts-node update-resolved-status.ts
 */

import prisma from './src/db/client';

async function updateResolvedStatus() {
  try {
    console.log('🔄 Actualizando el estado "Resuelta"...');

    // Actualizar el estado
    const result = await prisma.status.updateMany({
      where: { code: 'resolved' },
      data: { is_closed: true },
    });

    console.log(`✅ ${result.count} estado(s) actualizado(s)`);

    // Verificar el cambio
    const statuses = await prisma.status.findMany({
      orderBy: { display_order: 'asc' },
    });

    console.log('\n📊 Estados actuales:');
    console.table(
      statuses.map((s) => ({
        ID: s.id,
        Código: s.code,
        Etiqueta: s.label,
        Cerrado: s.is_closed ? '✓ SÍ' : '✗ NO',
        Orden: s.display_order,
      }))
    );

    // Verificar cuántas incidencias están en estado "Resuelta"
    const resolvedIncidents = await prisma.incident.count({
      where: { status: { code: 'resolved' } },
    });

    console.log(`\n📈 Incidencias en estado "Resuelta": ${resolvedIncidents}`);

    await prisma.$disconnect();
    console.log('\n✅ Proceso completado exitosamente');
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateResolvedStatus();

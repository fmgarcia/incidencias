/**
 * Script de seed para poblar la base de datos con datos iniciales
 * Ejecutar con: npm run prisma:seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.info('🌱 Iniciando seed de la base de datos...');

  // ========== USERS ==========
  console.info('Creando usuarios...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const techPassword = await bcrypt.hash('tech123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@local' },
    update: {},
    create: {
      username: 'admin',
      full_name: 'Administrador del sistema',
      email: 'admin@local',
      role: 'admin',
      active: true,
      password_hash: adminPassword,
    },
  });

  const tech1 = await prisma.user.upsert({
    where: { email: 'tech1@local' },
    update: {},
    create: {
      username: 'tech1',
      full_name: 'Técnico Uno',
      email: 'tech1@local',
      role: 'tech',
      active: true,
      password_hash: techPassword,
    },
  });

  console.info(`✅ Usuarios creados: ${admin.username}, ${tech1.username}`);

  // ========== STATUSES ==========
  console.info('Creando estados...');

  const statuses = await Promise.all([
    prisma.status.upsert({
      where: { code: 'open' },
      update: {},
      create: {
        code: 'open',
        label: 'Abierta',
        description: 'Incidencia reportada y pendiente de asignación',
        is_closed: false,
        display_order: 10,
      },
    }),
    prisma.status.upsert({
      where: { code: 'in_progress' },
      update: {},
      create: {
        code: 'in_progress',
        label: 'En curso',
        description: 'Incidencia en trabajo',
        is_closed: false,
        display_order: 20,
      },
    }),
    prisma.status.upsert({
      where: { code: 'waiting_customer' },
      update: {},
      create: {
        code: 'waiting_customer',
        label: 'A la espera cliente',
        description: 'Pendiente respuesta del cliente',
        is_closed: false,
        display_order: 25,
      },
    }),
    prisma.status.upsert({
      where: { code: 'resolved' },
      update: {},
      create: {
        code: 'resolved',
        label: 'Resuelta',
        description: 'Solución aplicada, pendiente verificación',
        is_closed: false,
        display_order: 30,
      },
    }),
    prisma.status.upsert({
      where: { code: 'closed' },
      update: {},
      create: {
        code: 'closed',
        label: 'Cerrada',
        description: 'Incidencia cerrada',
        is_closed: true,
        display_order: 100,
      },
    }),
    prisma.status.upsert({
      where: { code: 'cancelled' },
      update: {},
      create: {
        code: 'cancelled',
        label: 'Cancelada',
        description: 'Incidencia anulada',
        is_closed: true,
        display_order: 110,
      },
    }),
  ]);

  console.info(`✅ Estados creados: ${statuses.length}`);

  // ========== PRIORITIES ==========
  console.info('Creando prioridades...');

  const priorities = await Promise.all([
    prisma.priority.upsert({
      where: { code: 'low' },
      update: {},
      create: {
        code: 'low',
        label: 'Baja',
        sla_hours: 72,
        display_order: 30,
      },
    }),
    prisma.priority.upsert({
      where: { code: 'medium' },
      update: {},
      create: {
        code: 'medium',
        label: 'Media',
        sla_hours: 24,
        display_order: 20,
      },
    }),
    prisma.priority.upsert({
      where: { code: 'high' },
      update: {},
      create: {
        code: 'high',
        label: 'Alta',
        sla_hours: 8,
        display_order: 10,
      },
    }),
    prisma.priority.upsert({
      where: { code: 'urgent' },
      update: {},
      create: {
        code: 'urgent',
        label: 'Urgente',
        sla_hours: 2,
        display_order: 5,
      },
    }),
  ]);

  console.info(`✅ Prioridades creadas: ${priorities.length}`);

  // ========== SEVERITIES ==========
  console.info('Creando severidades...');

  const severities = await Promise.all([
    prisma.severity.upsert({
      where: { id: 1 },
      update: {},
      create: {
        label: 'Minor',
        description: 'Impacto reducido',
        display_order: 100,
      },
    }),
    prisma.severity.upsert({
      where: { id: 2 },
      update: {},
      create: {
        label: 'Major',
        description: 'Impacto importante',
        display_order: 50,
      },
    }),
    prisma.severity.upsert({
      where: { id: 3 },
      update: {},
      create: {
        label: 'Critical',
        description: 'Impacto crítico / parada de servicio',
        display_order: 10,
      },
    }),
  ]);

  console.info(`✅ Severidades creadas: ${severities.length}`);

  // ========== PROBLEM TYPES ==========
  console.info('Creando tipos de problema...');

  const problemTypes = await Promise.all([
    prisma.problemType.upsert({
      where: { code: 'network' },
      update: {},
      create: {
        code: 'network',
        label: 'Red',
        description: 'Problemas relacionados con red y conectividad',
      },
    }),
    prisma.problemType.upsert({
      where: { code: 'software' },
      update: {},
      create: {
        code: 'software',
        label: 'Software',
        description: 'Errores o fallos en aplicaciones',
      },
    }),
    prisma.problemType.upsert({
      where: { code: 'hardware' },
      update: {},
      create: {
        code: 'hardware',
        label: 'Hardware',
        description: 'Incidencias de equipo físico',
      },
    }),
    prisma.problemType.upsert({
      where: { code: 'security' },
      update: {},
      create: {
        code: 'security',
        label: 'Seguridad',
        description: 'Incidentes de seguridad',
      },
    }),
  ]);

  console.info(`✅ Tipos de problema creados: ${problemTypes.length}`);

  // ========== CATEGORIES ==========
  console.info('Creando categorías...');

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: {
        label: 'Infraestructura',
        description: 'Problemas de infra',
      },
    }),
    prisma.category.upsert({
      where: { id: 2 },
      update: {},
      create: {
        label: 'Aplicación',
        description: 'Errores de la aplicación',
      },
    }),
    prisma.category.upsert({
      where: { id: 3 },
      update: {},
      create: {
        label: 'Usuario',
        description: 'Incidencias reportadas por usuarios',
      },
    }),
  ]);

  console.info(`✅ Categorías creadas: ${categories.length}`);

  // ========== CLIENTS ==========
  console.info('Creando clientes...');

  const client = await prisma.client.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'ACME S.L.',
      legal_name: 'ACME Soluciones Empresariales S.L.',
      contact_name: 'María López',
      contact_email: 'maria.lopez@acme.local',
      contact_phone: '600111222',
      address: 'C/ Falsa 123',
      city: 'Alicante',
      province: 'Alicante',
      postal_code: '03001',
      country: 'España',
      notes: 'Cliente principal desde 2020',
    },
  });

  console.info(`✅ Cliente creado: ${client.name}`);

  // ========== INCIDENT DE EJEMPLO ==========
  console.info('Creando incidencia de ejemplo...');

  const existingIncident = await prisma.incident.findFirst({
    where: { reference: 'INC-2025-0001' },
  });

  if (!existingIncident) {
    const incident = await prisma.incident.create({
      data: {
        reference: 'INC-2025-0001',
        client_id: client.id,
        title: 'No responde servidor web',
        description: 'El servidor web deja de responder intermitentemente',
        status_id: statuses[0].id,
        priority_id: priorities[2].id,
        problem_type_id: problemTypes[0].id,
        severity_id: severities[2].id,
        assigned_to: tech1.id,
        created_by: admin.id,
        estimated_minutes: 120,
        time_spent_minutes: 0,
        opened_at: new Date(),
      },
    });

    console.info(`✅ Incidencia creada: ${incident.reference}`);
  } else {
    console.info('⏭️  Incidencia de ejemplo ya existe, saltando...');
  }

  console.info('✅ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

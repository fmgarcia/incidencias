/**
 * Punto de entrada del servidor
 * Arranca la aplicación Express y se conecta a la base de datos
 */

import app from './app';
import config from './config';
import prisma from './db/client';

const PORT = config.port;

// Función para iniciar el servidor
async function startServer() {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.info('✅ Conectado a la base de datos MySQL');

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.info(`📊 Entorno: ${config.nodeEnv}`);
      console.info(`🔗 Frontend permitido: ${config.cors.origin}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.info('\n🛑 Señal SIGINT recibida. Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.info('\n🛑 Señal SIGTERM recibida. Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar el servidor
startServer();

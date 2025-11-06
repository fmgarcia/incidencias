/**
 * Configuración de la aplicación Express
 * Define todos los middlewares, rutas y manejadores de errores
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import { errorHandler } from './middleware/errorHandler';

// Importar rutas
import authRoutes from './routes/auth';
import clientsRoutes from './routes/clients';
import incidentsRoutes from './routes/incidents';
import timeEntriesRoutes from './routes/timeEntries';
import commentsRoutes from './routes/comments';
import attachmentsRoutes from './routes/attachments';
import tagsRoutes from './routes/tags';
import catalogsRoutes from './routes/catalogs';

const app: Application = express();

// ============ MIDDLEWARES DE SEGURIDAD ============

// Helmet: Añade headers de seguridad
app.use(helmet());

// CORS: Permitir peticiones desde el frontend
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// ============ MIDDLEWARES DE PARSING ============

// Parser de JSON
app.use(express.json({ limit: '10mb' }));

// Parser de URL encoded (formularios)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============ LOGGING ============

// Morgan: Logger de peticiones HTTP
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============ RUTAS ============

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/time-entries', timeEntriesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/attachments', attachmentsRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/statuses', catalogsRoutes);

// Servir archivos estáticos de uploads (opcional, con protección)
app.use('/uploads', express.static(config.upload.directory));

// Ruta 404 para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
  });
});

// ============ MANEJADOR DE ERRORES GLOBAL ============
app.use(errorHandler);

export default app;

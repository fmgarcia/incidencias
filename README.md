# Sistema de Gestión de Incidencias

Sistema completo de gestión de incidencias (issue tracker) con backend Node.js + Express + Prisma y frontend React + Vite.

## 🚀 Características

- ✅ **Backend REST API** con Node.js, Express y TypeScript
- ✅ **ORM Prisma** conectado a MySQL
- ✅ **Autenticación JWT** con roles (admin, tech, user, viewer)
- ✅ **Validación con Zod** en todos los endpoints
- ✅ **Frontend React 18** con TypeScript y Vite
- ✅ **TailwindCSS** para estilos
- ✅ **React Router v6** para navegación
- ✅ **Sistema de archivos adjuntos** con Multer
- ✅ **Control de tiempos** por incidencia
- ✅ **Comentarios** y etiquetas
- ✅ **Tests** con Jest y Supertest
- ✅ **Linter y Prettier** configurados

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **MySQL** (XAMPP o instalación local)
- **npm** o **yarn**
- **Git** (opcional)

## 📁 Estructura del Proyecto

```
incidencias/
├── backend/           # API REST con Express + Prisma
│   ├── prisma/        # Esquema de base de datos y migraciones
│   ├── src/
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── routes/       # Definición de rutas
│   │   ├── middleware/   # Auth, validación, errores
│   │   ├── validations/  # Esquemas Zod
│   │   ├── utils/        # Utilidades (paginación, referencias)
│   │   └── __tests__/    # Tests
│   └── uploads/       # Archivos adjuntos
├── frontend/          # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── api/       # Cliente Axios y llamadas API
│   │   ├── hooks/     # Custom hooks (useAuth)
│   │   ├── pages/     # Páginas de la aplicación
│   │   └── components/ # Componentes reutilizables
└── incidencias.sql    # Script SQL original
```

## 🔧 Instalación

> **Nota:** Este proceso asume que ya tienes la base de datos `incidencias` creada en MySQL con las tablas del archivo `incidencias.sql`.

### 1️⃣ Configurar Backend

```powershell
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
@"
DATABASE_URL="mysql://root:@localhost:3306/incidencias"
JWT_SECRET="tu-secret-key-muy-segura-cambiame-en-produccion"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
"@ | Out-File -FilePath .env -Encoding UTF8

# Generar cliente Prisma
npx prisma generate

# Sincronizar esquema de Prisma con la base de datos existente
npx prisma db pull

# Regenerar el cliente con el esquema actualizado
npx prisma generate

# Poblar datos iniciales (usuarios, estados, prioridades, etc.)
npm run prisma:seed

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará disponible en: **http://localhost:4000**

### 2️⃣ Configurar Frontend

```powershell
# Abrir nueva terminal y navegar a frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

## 👤 Usuarios de Prueba

Después de ejecutar `npm run prisma:seed`, se crearán estos usuarios:

| Usuario | Contraseña | Rol   | Descripción |
|---------|-----------|-------|-------------|
| admin   | admin123  | admin | Administrador con todos los permisos |
| tech1   | tech123   | tech  | Técnico que puede gestionar incidencias |

## 📖 Uso de la API

### Autenticación

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Respuesta
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "name": "Administrador"
  }
}
```

### Endpoints Principales

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario (solo admin)
- `GET /api/auth/me` - Obtener usuario actual
- `PATCH /api/auth/change-password` - Cambiar contraseña

#### Incidencias
- `GET /api/incidents` - Listar incidencias (con filtros)
- `GET /api/incidents/summary` - Resumen estadístico
- `POST /api/incidents` - Crear incidencia
- `GET /api/incidents/:id` - Obtener incidencia por ID
- `PATCH /api/incidents/:id` - Actualizar incidencia
- `DELETE /api/incidents/:id` - Eliminar incidencia (soft delete)
- `PATCH /api/incidents/:id/status` - Cambiar estado

#### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `GET /api/clients/:id` - Obtener cliente
- `PATCH /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

#### Tiempos
- `GET /api/incidents/:incidentId/time-entries` - Listar tiempos
- `POST /api/incidents/:incidentId/time-entries` - Registrar tiempo
- `PATCH /api/time-entries/:id` - Actualizar tiempo
- `DELETE /api/time-entries/:id` - Eliminar tiempo

#### Comentarios
- `GET /api/incidents/:incidentId/comments` - Listar comentarios
- `POST /api/incidents/:incidentId/comments` - Añadir comentario
- `PATCH /api/comments/:id` - Actualizar comentario
- `DELETE /api/comments/:id` - Eliminar comentario

#### Archivos Adjuntos
- `GET /api/incidents/:incidentId/attachments` - Listar adjuntos
- `POST /api/incidents/:incidentId/attachments` - Subir archivo
- `GET /api/attachments/:id/download` - Descargar archivo
- `DELETE /api/attachments/:id` - Eliminar archivo

#### Etiquetas
- `GET /api/tags` - Listar etiquetas
- `POST /api/tags` - Crear etiqueta

### Ejemplo con Autenticación

```bash
# Obtener token (guárdalo en una variable)
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# Usar el token para listar incidencias
curl -X GET http://localhost:4000/api/incidents \
  -H "Authorization: Bearer $TOKEN"
```

## 🧪 Tests

```powershell
# Ejecutar tests del backend
cd backend
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

## 🔍 Filtros y Búsqueda

La API de incidencias soporta múltiples filtros:

```bash
# Filtrar por cliente
GET /api/incidents?clientId=1

# Filtrar por estado
GET /api/incidents?statusId=2

# Filtrar por prioridad
GET /api/incidents?priorityId=3

# Buscar por texto (título o descripción)
GET /api/incidents?search=red

# Paginación
GET /api/incidents?page=2&limit=10

# Combinar filtros
GET /api/incidents?clientId=1&statusId=2&search=problema&page=1&limit=20
```

## 📊 Resumen Estadístico

```bash
GET /api/incidents/summary

# Respuesta
{
  "total": 45,
  "open": 12,
  "in_progress": 8,
  "resolved": 15,
  "closed": 10,
  "byPriority": {
    "low": 10,
    "medium": 20,
    "high": 12,
    "urgent": 3
  },
  "bySeverity": {
    "Minor": 25,
    "Major": 15,
    "Critical": 5
  }
}
```

## 🎨 Frontend

El frontend incluye las siguientes páginas:

- **Login** (`/login`) - Autenticación de usuarios
- **Dashboard** (`/`) - Resumen de incidencias y estadísticas
- **Clientes** (`/clients`) - Listado de clientes
- **Detalle Cliente** (`/clients/:id`) - Incidencias de un cliente
- **Incidencias** (`/incidents`) - Listado con filtros
- **Nueva Incidencia** (`/incidents/new`) - Formulario de creación
- **Detalle Incidencia** (`/incidents/:id`) - Vista completa con tiempos, comentarios y adjuntos

## 🛠️ Scripts Disponibles

### Backend

```powershell
npm run dev          # Iniciar en modo desarrollo (nodemon)
npm run build        # Compilar TypeScript
npm start            # Iniciar producción
npm test             # Ejecutar tests
npm run lint         # Linter ESLint
npm run format       # Formatear con Prettier
npm run prisma:seed  # Poblar datos iniciales
npm run prisma:studio # Abrir Prisma Studio
```

### Frontend

```powershell
npm run dev          # Iniciar Vite dev server
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter ESLint
```

## 🗂️ Esquema de Base de Datos

El sistema gestiona las siguientes entidades:

- **clients** - Clientes/Empresas
- **users** - Usuarios del sistema
- **statuses** - Estados de incidencias (abierto, en progreso, cerrado, etc.)
- **priorities** - Prioridades (baja, media, alta, urgente) con SLA
- **severities** - Severidades (Minor, Major, Critical)
- **problem_types** - Tipos de problema (red, software, hardware, seguridad)
- **categories** - Categorías de incidencias
- **incidents** - Incidencias principales
- **time_entries** - Registro de tiempos dedicados
- **comments** - Comentarios en incidencias
- **attachments** - Archivos adjuntos
- **tags** - Etiquetas
- **incident_tags** - Relación incidencias-etiquetas

## 🔐 Roles y Permisos

- **admin**: Acceso completo (gestionar usuarios, clientes, configuración)
- **tech**: Gestionar incidencias, tiempos, comentarios
- **user**: Crear incidencias, añadir comentarios en sus propias incidencias
- **viewer**: Solo lectura

## 🚀 Despliegue a Producción

### Backend

1. Configurar variables de entorno en el servidor
2. Compilar TypeScript: `npm run build`
3. Ejecutar con PM2 o similar: `pm2 start dist/server.js`

### Frontend

1. Build para producción: `npm run build`
2. Servir carpeta `dist` con Nginx, Apache o servicio de hosting

## 📝 Variables de Entorno

### Backend (.env)

```env
DATABASE_URL="mysql://usuario:password@host:3306/incidencias"
JWT_SECRET="secret-muy-seguro-cambiar-en-produccion"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
```

## 🐛 Troubleshooting

### Error de conexión a MySQL

- Verificar que MySQL está ejecutándose (XAMPP)
- Comprobar credenciales en `DATABASE_URL`
- Verificar que la base de datos existe

### Error "prisma: command not found"

```powershell
npx prisma generate
```

### Puerto 4000 ya en uso

Cambiar `PORT` en `.env` del backend o matar el proceso:

```powershell
# PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process
```

### Frontend no conecta con Backend

- Verificar que el backend está ejecutándose en puerto 4000
- Revisar configuración del proxy en `vite.config.ts`

## 📚 Tecnologías Utilizadas

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- Zod (validación)
- Multer (archivos)
- Jest + Supertest (tests)
- bcryptjs (hashing)

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router v6
- Axios
- Context API

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

## 👥 Autor

Proyecto Intermodular - IES 2024/2025

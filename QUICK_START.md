# Sistema de Gestión de Incidencias 🎫

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

Sistema completo de gestión de incidencias (issue tracker / ticketing system) desarrollado con tecnologías modernas.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación Rápida](#-instalación-rápida)
- [Instalación Manual](#-instalación-manual)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Scripts Disponibles](#-scripts-disponibles)

## ✨ Características

### Backend
- ✅ **API REST completa** con Express.js y TypeScript
- ✅ **Autenticación JWT** con bcrypt
- ✅ **Sistema de roles** (admin, tech, user, viewer)
- ✅ **ORM Prisma** con MySQL
- ✅ **Validación de datos** con Zod
- ✅ **Manejo de archivos** con Multer
- ✅ **Tests unitarios** con Jest
- ✅ **Documentación automática** de API

### Frontend
- ✅ **React 18** con TypeScript
- ✅ **Vite** para desarrollo rápido
- ✅ **TailwindCSS** para estilos
- ✅ **React Router v6** para navegación
- ✅ **Axios** con interceptores
- ✅ **Context API** para estado global
- ✅ **Diseño responsive** y moderno

### Funcionalidades
- 📝 CRUD completo de incidencias
- 👥 Gestión de clientes
- ⏱️ Registro de tiempos
- 💬 Sistema de comentarios
- 📎 Archivos adjuntos
- 🏷️ Etiquetas personalizables
- 📊 Dashboard con estadísticas
- 🔍 Filtros y búsqueda avanzada
- 📄 Paginación en listados

## 🛠️ Tecnologías

### Backend
- Node.js 18+
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT (jsonwebtoken)
- Zod
- Multer
- Jest + Supertest
- ESLint + Prettier

### Frontend
- React 18
- TypeScript
- Vite 5
- TailwindCSS 3
- React Router v6
- Axios
- Context API

## 📦 Requisitos

- **Node.js** v18 o superior
- **MySQL** 8.0 o superior (XAMPP recomendado)
- **npm** v9 o superior

## 🚀 Instalación Rápida

> **Prerequisito:** Base de datos `incidencias` ya creada desde el archivo `incidencias.sql`

```powershell
# 1. Ir a la carpeta del proyecto
cd "C:\Users\Fran\Documents\IES2526\Proyecto Intermodular\incidencias"

# 2. Instalar todas las dependencias
npm run install:all

# 3. Configurar variables de entorno del backend
cd backend
@"
DATABASE_URL="mysql://root:@localhost:3306/incidencias"
JWT_SECRET="tu-secret-key-muy-segura-cambiame-en-produccion"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
"@ | Out-File -FilePath .env -Encoding UTF8
cd ..

# 4. Sincronizar Prisma con la base de datos existente y poblar datos
cd backend
npx prisma generate
npx prisma db pull
npx prisma generate
npm run prisma:seed
cd ..

# 5. Iniciar ambos servidores
npm run dev
```

Acceder a:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000
- **Credenciales**: admin / admin123

## 📝 Instalación Manual

> **Prerequisito:** Base de datos `incidencias` ya creada e importada desde `incidencias.sql`

### Paso 1: Backend

```powershell
cd backend

# Instalar dependencias
npm install

# Configurar .env
@"
DATABASE_URL="mysql://root:@localhost:3306/incidencias"
JWT_SECRET="tu-secret-key-muy-segura-cambiame-en-produccion"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
"@ | Out-File -FilePath .env -Encoding UTF8

# Generar cliente Prisma y sincronizar con BD existente
npx prisma generate
npx prisma db pull
npx prisma generate

# Poblar datos iniciales
npm run prisma:seed

# Iniciar servidor
npm run dev
```

### Paso 2: Frontend

```powershell
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🎯 Uso

### Usuarios de Prueba

| Usuario | Contraseña | Rol   |
|---------|-----------|-------|
| admin   | admin123  | admin |
| tech1   | tech123   | tech  |

### Flujo de Trabajo

1. **Login** - Iniciar sesión con credenciales
2. **Dashboard** - Ver resumen de incidencias
3. **Clientes** - Gestionar clientes del sistema
4. **Incidencias** - Crear, editar y gestionar incidencias
5. **Detalles** - Ver información completa de cada incidencia

## 📁 Estructura del Proyecto

```
incidencias/
├── backend/                 # API REST
│   ├── prisma/
│   │   ├── schema.prisma   # Esquema de BD
│   │   └── seed.ts         # Datos iniciales
│   ├── src/
│   │   ├── config/         # Configuración
│   │   ├── controllers/    # Controladores
│   │   ├── db/             # Cliente Prisma
│   │   ├── middleware/     # Middleware
│   │   ├── routes/         # Rutas
│   │   ├── validations/    # Schemas Zod
│   │   ├── utils/          # Utilidades
│   │   └── __tests__/      # Tests
│   ├── uploads/            # Archivos adjuntos
│   └── package.json
│
├── frontend/               # React App
│   ├── src/
│   │   ├── api/           # Clientes API
│   │   ├── components/    # Componentes
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Páginas
│   │   └── main.tsx
│   └── package.json
│
├── package.json           # Scripts raíz
└── README.md
```

## 📚 API Documentation

### Autenticación

```bash
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
PATCH /api/auth/change-password
```

### Incidencias

```bash
GET    /api/incidents              # Listar con filtros
GET    /api/incidents/summary      # Estadísticas
GET    /api/incidents/:id          # Por ID
POST   /api/incidents              # Crear
PATCH  /api/incidents/:id          # Actualizar
DELETE /api/incidents/:id          # Eliminar
PATCH  /api/incidents/:id/status   # Cambiar estado
```

### Clientes

```bash
GET    /api/clients     # Listar
GET    /api/clients/:id # Por ID
POST   /api/clients     # Crear
PATCH  /api/clients/:id # Actualizar
DELETE /api/clients/:id # Eliminar
```

### Otras Rutas

- `/api/incidents/:id/time-entries` - Gestión de tiempos
- `/api/incidents/:id/comments` - Comentarios
- `/api/incidents/:id/attachments` - Archivos adjuntos
- `/api/tags` - Etiquetas

Ver [README.md principal](./README.md) para documentación completa de la API.

## 🧪 Testing

```powershell
# Backend tests
cd backend
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📜 Scripts Disponibles

### Raíz del Proyecto

```powershell
npm run install:all    # Instalar todo
npm run dev           # Ejecutar ambos servidores
npm run dev:backend   # Solo backend
npm run dev:frontend  # Solo frontend
npm run build         # Build de producción
npm run setup         # Instalación + setup completo
```

### Backend

```powershell
npm run dev           # Desarrollo
npm run build         # Compilar
npm start            # Producción
npm test             # Tests
npm run lint         # ESLint
npm run format       # Prettier
npm run prisma:seed  # Poblar BD
npm run prisma:studio # Prisma Studio
```

### Frontend

```powershell
npm run dev          # Desarrollo
npm run build        # Build producción
npm run preview      # Preview del build
npm run lint         # ESLint
```

## 🔧 Troubleshooting

### Puerto en uso

```powershell
# Cambiar puerto del backend en .env
PORT=5000

# O matar el proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process
```

### Error de Prisma

```powershell
cd backend
npx prisma generate
npx prisma db push
```

### Frontend no conecta

1. Verificar que el backend esté en puerto 4000
2. Revisar `vite.config.ts` proxy
3. Limpiar cache: `npm run dev -- --force`

## 📄 Licencia

ISC - Proyecto educativo IES 2024/2025

## 👨‍💻 Autor

Proyecto Intermodular - IES 2024/2025

---

⭐ **¡Dale una estrella si te ha sido útil!**

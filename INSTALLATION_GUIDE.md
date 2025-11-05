# 🚀 Guía de Instalación Paso a Paso

## Paso 1: Verificar Requisitos ✔️

Antes de empezar, asegúrate de tener instalado:

```powershell
# Verificar Node.js (debe ser v18 o superior)
node --version
# Resultado esperado: v18.x.x o superior

# Verificar npm
npm --version
# Resultado esperado: 9.x.x o superior

# Verificar MySQL (en XAMPP o instalación independiente)
mysql --version
# Resultado esperado: mysql Ver 8.0.x
```

Si algo falta, instálalo primero:
- Node.js: https://nodejs.org/
- XAMPP (incluye MySQL): https://www.apachefriends.org/

---

## Paso 2: Instalar Dependencias del Proyecto 📦

> **Nota Importante:** Este paso asume que ya tienes la base de datos `incidencias` creada en MySQL con las tablas importadas desde el archivo `incidencias.sql`.

```powershell
# Navega a la carpeta del proyecto
cd "C:\Users\Fran\Documents\IES2526\Proyecto Intermodular\incidencias"

# Instalar dependencias en raíz (concurrently)
npm install

# Instalar dependencias del backend
cd backend
npm install
cd ..

# Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

**Tiempo estimado:** 2-3 minutos dependiendo de tu conexión.

**✅ Verificación:** No deberías ver errores rojos, solo warnings amarillos (normal).

---

## Paso 3: Configurar Variables de Entorno 🔧

```powershell
# Navega al backend
cd backend

# Crear archivo .env (copia y pega todo este bloque)
@"
DATABASE_URL="mysql://root:@localhost:3306/incidencias"
JWT_SECRET="mi-super-secret-key-para-desarrollo-12345"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
"@ | Out-File -FilePath .env -Encoding UTF8

# Verificar que se creó correctamente
Get-Content .env

cd ..
```

**✅ Verificación:** Deberías ver el contenido del archivo .env impreso en consola.

---

## Paso 4: Sincronizar Prisma con la Base de Datos Existente 🎲

```powershell
cd backend

# Generar el cliente Prisma
npx prisma generate

# Sincronizar con la base de datos existente (pull del esquema)
npx prisma db pull

# Regenerar el cliente con el esquema actualizado
npx prisma generate

# Poblar con datos iniciales
npm run prisma:seed

cd ..
```

**✅ Verificación:** Deberías ver mensajes de éxito:
- "✔ Generated Prisma Client"
- "Introspected X models and wrote them into prisma/schema.prisma"
- "🌱 The seed command has been executed"

---

## Paso 5: Iniciar el Proyecto 🎯

### Opción A: Ambos servidores a la vez (Recomendado)

```powershell
# Desde la raíz del proyecto
npm run dev
```

Verás dos servidores iniciándose:
```
[backend] Server running on http://localhost:4000
[frontend] Local: http://localhost:5173
```

### Opción B: En terminales separadas

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

## Paso 6: Acceder a la Aplicación 🌐

1. Abre tu navegador
2. Ve a: http://localhost:5173
3. Usa las credenciales de prueba:
   - **Usuario:** admin
   - **Contraseña:** admin123

**¡Listo! 🎉**

---

## Comandos Útiles 🛠️

### Ver la base de datos visualmente

```powershell
cd backend
npx prisma studio
```

Abre http://localhost:5555 para ver Prisma Studio.

### Reiniciar base de datos

```powershell
cd backend

# Borrar datos y recrear
npx prisma db push --force-reset

# Volver a poblar
npm run prisma:seed
```

### Ver logs detallados del backend

```powershell
cd backend
npm run dev
```

Los logs aparecerán en la consola con cada petición.

### Compilar para producción

```powershell
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

---

## Solución de Problemas 🔍

### Error: "Puerto 4000 ya está en uso"

```powershell
# Matar el proceso que usa el puerto 4000
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process
```

O cambia el puerto en `backend/.env`:
```
PORT=5000
```

### Error: "Cannot connect to database"

1. Verifica que MySQL esté ejecutándose en XAMPP
2. Comprueba que la base de datos "incidencias" existe:
   ```sql
   mysql -u root
   SHOW DATABASES;
   ```
3. Verifica el `DATABASE_URL` en `backend/.env`

### Error: "Prisma Client not found"

```powershell
cd backend
npx prisma generate
```

### Frontend muestra página en blanco

1. Abre la consola del navegador (F12)
2. Verifica que el backend esté corriendo
3. Limpia cache: Ctrl + Shift + R

### Error: "Module not found"

```powershell
# Reinstalar dependencias
cd backend
Remove-Item -Recurse -Force node_modules
npm install

cd ../frontend
Remove-Item -Recurse -Force node_modules
npm install
```

---

## Verificación Final ✅

Marca cada punto cuando esté completo:

- [ ] MySQL corriendo en XAMPP
- [ ] Base de datos "incidencias" creada
- [ ] Dependencias instaladas (sin errores)
- [ ] Archivo `.env` configurado en backend
- [ ] Prisma generado y sincronizado
- [ ] Datos iniciales cargados (seed)
- [ ] Backend corriendo en http://localhost:4000
- [ ] Frontend corriendo en http://localhost:5173
- [ ] Login exitoso con admin/admin123
- [ ] Dashboard muestra datos

---

## Próximos Pasos 🎓

Una vez que todo funcione:

1. Explora el **Dashboard** para ver estadísticas
2. Ve a **Clientes** para ver ACME Corp
3. Abre **Incidencias** para ver INC-2025-0001
4. Crea una **nueva incidencia** desde el botón
5. Revisa la **documentación de la API** en README.md
6. Experimenta con los **filtros y búsqueda**
7. Revisa el código del **backend** en `backend/src/`
8. Revisa el código del **frontend** en `frontend/src/`

---

## Recursos Adicionales 📚

- [README.md](./README.md) - Documentación completa
- [QUICK_START.md](./QUICK_START.md) - Guía rápida
- [PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md) - Resumen del proyecto

---

## Soporte 💬

Si encuentras algún problema:

1. Revisa la sección "Solución de Problemas" arriba
2. Verifica los logs en la consola
3. Asegúrate de seguir todos los pasos en orden
4. Consulta el README.md para más detalles

---

**¡Disfruta desarrollando! 🚀**

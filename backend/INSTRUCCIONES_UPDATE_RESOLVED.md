# Actualización del Estado "Resuelta"

## Problema

Las incidencias con estado "Resuelta" aparecen en el dashboard de urgentes cuando deberían estar finalizadas.

## Solución

Marcar el estado "Resuelta" como cerrado (`is_closed = 1`) en la base de datos.

## Pasos para ejecutar

### Opción 1: phpMyAdmin

1. Abre phpMyAdmin en tu navegador: http://localhost/phpmyadmin
2. Selecciona la base de datos `incidencias`
3. Haz clic en la pestaña "SQL"
4. Copia y pega el contenido del archivo `update_resolved_status.sql`
5. Haz clic en "Continuar" o "Ejecutar"

### Opción 2: MySQL Workbench

1. Abre MySQL Workbench
2. Conecta a tu servidor local
3. Abre una nueva pestaña SQL
4. Copia y pega el contenido del archivo `update_resolved_status.sql`
5. Ejecuta el script (botón del rayo ⚡)

### Opción 3: Línea de comandos (si tienes mysql en PATH)

```bash
mysql -u root -p < backend/update_resolved_status.sql
```

### Opción 4: Ejecutar manualmente

Ejecuta esta única línea SQL:

```sql
UPDATE statuses SET is_closed = 1 WHERE code = 'resolved';
```

## Verificación

Después de ejecutar, verifica que el cambio se aplicó:

```sql
SELECT id, code, label, is_closed FROM statuses WHERE code = 'resolved';
```

Deberías ver:

- `is_closed` = 1 para el estado "resolved"

## Efecto

Después de aplicar este cambio:

- ✅ Las incidencias "Resueltas" NO aparecerán en la lista de urgentes del dashboard
- ✅ Se contarán en el total de "Cerradas"
- ✅ Al cambiar una incidencia a "Resuelta", se marcará automáticamente con `closed_at`
- ✅ El contador de "Resueltas" seguirá funcionando correctamente

## Reiniciar el backend

Después de aplicar el cambio SQL, reinicia el servidor backend para asegurar que los cambios se reflejen.

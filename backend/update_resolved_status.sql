-- ============================================
-- Actualizar el estado "Resuelta" como cerrado
-- ============================================
-- Esto hará que las incidencias resueltas:
-- 1. NO aparezcan en el dashboard de urgentes
-- 2. Se cuenten en el total de "Cerradas"
-- 3. Se marquen automáticamente con closed_at al cambiar a este estado
--
-- INSTRUCCIONES:
-- Ejecuta este SQL en phpMyAdmin, MySQL Workbench o cualquier cliente MySQL
-- ============================================

USE incidencias;

-- Actualizar el estado
UPDATE statuses 
SET is_closed = 1 
WHERE code = 'resolved';

-- Verificar el cambio
SELECT 
    id, 
    code, 
    label, 
    is_closed,
    CASE 
        WHEN is_closed = 1 THEN 'CERRADO ✓'
        ELSE 'ABIERTO'
    END as estado_tipo
FROM statuses 
ORDER BY display_order;

-- Resultado esperado:
-- El estado 'resolved' (Resuelta) debe mostrar is_closed = 1

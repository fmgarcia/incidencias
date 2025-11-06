-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-11-2025 a las 02:11:32
-- Versión del servidor: 10.4.16-MariaDB
-- Versión de PHP: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `incidencias`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `attachments`
--

CREATE TABLE `attachments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `incident_id` bigint(20) UNSIGNED DEFAULT NULL,
  `comment_id` bigint(20) UNSIGNED DEFAULT NULL,
  `filename` varchar(255) NOT NULL,
  `mime_type` varchar(120) DEFAULT NULL,
  `file_size` int(10) UNSIGNED DEFAULT NULL,
  `storage_path` varchar(600) DEFAULT NULL,
  `uploaded_by` int(10) UNSIGNED DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `label` varchar(120) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `label`, `description`) VALUES
(1, 'Infraestructura', 'Problemas de infra'),
(2, 'Aplicación', 'Errores de la aplicación'),
(3, 'Usuario', 'Incidencias reportadas por usuarios');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clients`
--

CREATE TABLE `clients` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `legal_name` varchar(300) DEFAULT NULL,
  `contact_name` varchar(150) DEFAULT NULL,
  `contact_email` varchar(200) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `address` varchar(400) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'España',
  `notes` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `clients`
--

INSERT INTO `clients` (`id`, `name`, `legal_name`, `contact_name`, `contact_email`, `contact_phone`, `address`, `city`, `province`, `postal_code`, `country`, `notes`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'ACME S.L.', NULL, 'María López', 'maria.lopez@acme.local', '600111222', 'C/ Falsa 123', 'Alicante', NULL, NULL, 'España', NULL, 1, '2025-11-04 16:07:01', '2025-11-05 15:19:14'),
(2, 'Fran', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'España', NULL, 1, '2025-11-05 15:13:56', '2025-11-05 16:19:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `incident_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `content` text NOT NULL,
  `visibility` enum('public','internal') DEFAULT 'public',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `comments`
--

INSERT INTO `comments` (`id`, `incident_id`, `user_id`, `content`, `visibility`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'He trabajado duramente', 'public', '2025-11-05 16:18:07', '2025-11-05 16:18:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incidents`
--

CREATE TABLE `incidents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference` varchar(50) NOT NULL,
  `client_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status_id` tinyint(3) UNSIGNED NOT NULL,
  `priority_id` tinyint(3) UNSIGNED DEFAULT NULL,
  `problem_type_id` smallint(5) UNSIGNED DEFAULT NULL,
  `severity_id` tinyint(3) UNSIGNED DEFAULT NULL,
  `category_id` smallint(5) UNSIGNED DEFAULT NULL,
  `reported_by` varchar(200) DEFAULT NULL,
  `reported_contact` varchar(200) DEFAULT NULL,
  `assigned_to` int(10) UNSIGNED DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `opened_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `due_at` timestamp NULL DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `estimated_minutes` int(10) UNSIGNED DEFAULT 0,
  `time_spent_minutes` int(10) UNSIGNED DEFAULT 0,
  `resolution` text DEFAULT NULL,
  `root_cause` text DEFAULT NULL,
  `sla_breach` tinyint(1) NOT NULL DEFAULT 0,
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `incidents`
--

INSERT INTO `incidents` (`id`, `reference`, `client_id`, `title`, `description`, `status_id`, `priority_id`, `problem_type_id`, `severity_id`, `category_id`, `reported_by`, `reported_contact`, `assigned_to`, `created_by`, `opened_at`, `due_at`, `closed_at`, `estimated_minutes`, `time_spent_minutes`, `resolution`, `root_cause`, `sla_breach`, `archived`, `created_at`, `updated_at`) VALUES
(1, 'INC-2025-0001', 1, 'No responde servidor web', 'El servidor web deja de responder intermitentemente. Actualizada', 4, 3, 1, 3, NULL, NULL, NULL, 2, 1, '2025-11-04 16:07:01', NULL, NULL, 120, 120, NULL, NULL, 0, 0, '2025-11-04 16:07:01', '2025-11-05 23:47:04'),
(2, 'INC-2025-0002', 2, 'afdfa', 'adsfads', 1, 2, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-11-05 15:36:32', NULL, NULL, 0, 0, NULL, NULL, 0, 0, '2025-11-05 15:36:32', '2025-11-05 15:36:32'),
(3, 'INC-2025-0003', 2, 'dfadssfda', 'ads', 5, 2, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-11-05 15:42:33', NULL, '2025-11-05 23:37:36', 0, 0, 'Todo correcto', NULL, 0, 0, '2025-11-05 15:42:33', '2025-11-05 23:37:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incident_tags`
--

CREATE TABLE `incident_tags` (
  `incident_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `priorities`
--

CREATE TABLE `priorities` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `label` varchar(50) NOT NULL,
  `sla_hours` int(10) UNSIGNED DEFAULT NULL,
  `display_order` tinyint(3) UNSIGNED DEFAULT 100
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `priorities`
--

INSERT INTO `priorities` (`id`, `code`, `label`, `sla_hours`, `display_order`) VALUES
(1, 'low', 'Baja', 72, 30),
(2, 'medium', 'Media', 24, 20),
(3, 'high', 'Alta', 8, 10),
(4, 'urgent', 'Urgente', 2, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `problem_types`
--

CREATE TABLE `problem_types` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `code` varchar(80) NOT NULL,
  `label` varchar(120) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `problem_types`
--

INSERT INTO `problem_types` (`id`, `code`, `label`, `description`) VALUES
(1, 'network', 'Red', 'Problemas relacionados con red y conectividad'),
(2, 'software', 'Software', 'Errores o fallos en aplicaciones'),
(3, 'hardware', 'Hardware', 'Incidencias de equipo físico'),
(4, 'security', 'Seguridad', 'Incidentes de seguridad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `severities`
--

CREATE TABLE `severities` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `label` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `display_order` tinyint(3) UNSIGNED DEFAULT 100
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `severities`
--

INSERT INTO `severities` (`id`, `label`, `description`, `display_order`) VALUES
(1, 'Minor', 'Impacto reducido', 100),
(2, 'Major', 'Impacto importante', 50),
(3, 'Critical', 'Impacto crítico / parada de servicio', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `statuses`
--

CREATE TABLE `statuses` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `label` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_closed` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` tinyint(3) UNSIGNED DEFAULT 100
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `statuses`
--

INSERT INTO `statuses` (`id`, `code`, `label`, `description`, `is_closed`, `display_order`) VALUES
(1, 'open', 'Abierta', 'Incidencia reportada y pendiente de asignación', 0, 10),
(2, 'in_progress', 'En curso', 'Incidencia en trabajo', 0, 20),
(3, 'waiting_customer', 'A la espera cliente', 'Pendiente respuesta del cliente', 0, 25),
(4, 'resolved', 'Resuelta', 'Solución aplicada, pendiente verificación', 1, 30),
(5, 'closed', 'Cerrada', 'Incidencia cerrada', 1, 100),
(6, 'cancelled', 'Cancelada', 'Incidencia anulada', 1, 110);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `label` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `time_entries`
--

CREATE TABLE `time_entries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `incident_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `minutes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `description` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `time_entries`
--

INSERT INTO `time_entries` (`id`, `incident_id`, `user_id`, `start_time`, `end_time`, `minutes`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-11-05 17:00:00', '2025-11-05 18:00:00', 60, NULL, '2025-11-05 16:01:06', '2025-11-05 16:01:06'),
(2, 1, 1, '2025-11-05 17:08:00', '2025-11-05 18:08:00', 60, 'Otra tarea', '2025-11-05 16:09:09', '2025-11-05 16:09:09');

--
-- Disparadores `time_entries`
--
DELIMITER $$
CREATE TRIGGER `trg_time_entries_after_delete` AFTER DELETE ON `time_entries` FOR EACH ROW BEGIN
  UPDATE incidents
  SET time_spent_minutes = COALESCE(
      (SELECT SUM(minutes) FROM time_entries WHERE incident_id = OLD.incident_id),
      0
    )
  WHERE id = OLD.incident_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_time_entries_after_insert` AFTER INSERT ON `time_entries` FOR EACH ROW BEGIN
  UPDATE incidents
  SET time_spent_minutes = COALESCE(
      (SELECT SUM(minutes) FROM time_entries WHERE incident_id = NEW.incident_id),
      0
    )
  WHERE id = NEW.incident_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_time_entries_after_update` AFTER UPDATE ON `time_entries` FOR EACH ROW BEGIN
  UPDATE incidents
  SET time_spent_minutes = COALESCE(
      (SELECT SUM(minutes) FROM time_entries WHERE incident_id = NEW.incident_id),
      0
    )
  WHERE id = NEW.incident_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(100) NOT NULL,
  `full_name` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `role` enum('admin','tech','user','viewer') NOT NULL DEFAULT 'user',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `password_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `full_name`, `email`, `phone`, `role`, `active`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Administrador del sistema', 'admin@local', NULL, 'admin', 1, '$2a$10$iAR/webNS.LI.PFW7n.4t.3YZU.pMUiASIlpyrwd0ytA9IKmRlUam', '2025-11-04 16:07:01', '2025-11-05 14:45:50'),
(2, 'tech1', 'Técnico Uno', 'tech1@local', NULL, 'tech', 1, '$2a$10$t.i80dhhBxYVUcCtxMRnqO39xXNJDHBMvKUP6JnRJczvuswdJVUDC', '2025-11-04 16:07:01', '2025-11-05 14:45:50');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_incident_summary`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_incident_summary` (
`id` bigint(20) unsigned
,`reference` varchar(50)
,`title` varchar(255)
,`client_id` int(10) unsigned
,`client_name` varchar(200)
,`status_id` tinyint(3) unsigned
,`status_label` varchar(100)
,`priority_id` tinyint(3) unsigned
,`priority_label` varchar(50)
,`assigned_to` int(10) unsigned
,`assigned_to_name` varchar(200)
,`opened_at` timestamp
,`due_at` timestamp
,`closed_at` timestamp
,`estimated_minutes` int(10) unsigned
,`time_spent_minutes` int(10) unsigned
,`sla_breach` tinyint(1)
,`archived` tinyint(1)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_incident_time_totals`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_incident_time_totals` (
`incident_id` bigint(20) unsigned
,`total_minutes` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_incident_summary`
--
DROP TABLE IF EXISTS `vw_incident_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_incident_summary`  AS SELECT `i`.`id` AS `id`, `i`.`reference` AS `reference`, `i`.`title` AS `title`, `i`.`client_id` AS `client_id`, `c`.`name` AS `client_name`, `i`.`status_id` AS `status_id`, `s`.`label` AS `status_label`, `i`.`priority_id` AS `priority_id`, `p`.`label` AS `priority_label`, `i`.`assigned_to` AS `assigned_to`, `u`.`full_name` AS `assigned_to_name`, `i`.`opened_at` AS `opened_at`, `i`.`due_at` AS `due_at`, `i`.`closed_at` AS `closed_at`, `i`.`estimated_minutes` AS `estimated_minutes`, `i`.`time_spent_minutes` AS `time_spent_minutes`, `i`.`sla_breach` AS `sla_breach`, `i`.`archived` AS `archived` FROM ((((`incidents` `i` left join `clients` `c` on(`i`.`client_id` = `c`.`id`)) left join `statuses` `s` on(`i`.`status_id` = `s`.`id`)) left join `priorities` `p` on(`i`.`priority_id` = `p`.`id`)) left join `users` `u` on(`i`.`assigned_to` = `u`.`id`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_incident_time_totals`
--
DROP TABLE IF EXISTS `vw_incident_time_totals`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_incident_time_totals`  AS SELECT `te`.`incident_id` AS `incident_id`, sum(`te`.`minutes`) AS `total_minutes` FROM `time_entries` AS `te` GROUP BY `te`.`incident_id` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `idx_attachments_incident` (`incident_id`),
  ADD KEY `idx_attachments_comment` (`comment_id`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_clients_name_contact` (`name`,`contact_email`);

--
-- Indices de la tabla `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_comments_incident` (`incident_id`);

--
-- Indices de la tabla `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `priority_id` (`priority_id`),
  ADD KEY `problem_type_id` (`problem_type_id`),
  ADD KEY `severity_id` (`severity_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_incidents_client_status` (`client_id`,`status_id`),
  ADD KEY `idx_incidents_assigned_status` (`assigned_to`,`status_id`),
  ADD KEY `idx_incidents_opened_at` (`opened_at`),
  ADD KEY `idx_incidents_closed_at` (`closed_at`);

--
-- Indices de la tabla `incident_tags`
--
ALTER TABLE `incident_tags`
  ADD PRIMARY KEY (`incident_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indices de la tabla `priorities`
--
ALTER TABLE `priorities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_priority_code` (`code`);

--
-- Indices de la tabla `problem_types`
--
ALTER TABLE `problem_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_problem_types_code` (`code`);

--
-- Indices de la tabla `severities`
--
ALTER TABLE `severities`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_status_code` (`code`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `label` (`label`);

--
-- Indices de la tabla `time_entries`
--
ALTER TABLE `time_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_time_entries_incident` (`incident_id`),
  ADD KEY `idx_time_entries_user` (`user_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `attachments`
--
ALTER TABLE `attachments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `priorities`
--
ALTER TABLE `priorities`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `problem_types`
--
ALTER TABLE `problem_types`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `severities`
--
ALTER TABLE `severities`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `statuses`
--
ALTER TABLE `statuses`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `time_entries`
--
ALTER TABLE `time_entries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `attachments`
--
ALTER TABLE `attachments`
  ADD CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attachments_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `attachments_ibfk_3` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `incidents`
--
ALTER TABLE `incidents`
  ADD CONSTRAINT `incidents_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `incidents_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `incidents_ibfk_3` FOREIGN KEY (`priority_id`) REFERENCES `priorities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `incidents_ibfk_4` FOREIGN KEY (`problem_type_id`) REFERENCES `problem_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `incidents_ibfk_5` FOREIGN KEY (`severity_id`) REFERENCES `severities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `incidents_ibfk_6` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `incidents_ibfk_7` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `incidents_ibfk_8` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `incident_tags`
--
ALTER TABLE `incident_tags`
  ADD CONSTRAINT `incident_tags_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `incident_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `time_entries`
--
ALTER TABLE `time_entries`
  ADD CONSTRAINT `time_entries_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `time_entries_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

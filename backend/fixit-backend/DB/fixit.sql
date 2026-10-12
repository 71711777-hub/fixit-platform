-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 11-10-2026 a las 17:10:07
-- Versión del servidor: 5.7.24
-- Versión de PHP: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `fixit`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adjuntos_incidencia`
--

CREATE TABLE `adjuntos_incidencia` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `incidencia_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url_archivo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_mime` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tamano_bytes` int(11) NOT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asientos_contables`
--

CREATE TABLE `asientos_contables` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pago_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuenta` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sentido` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entidad` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `entidad_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `diferencias` json DEFAULT NULL,
  `ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_hora` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_problema`
--

CREATE TABLE `categorias_problema` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria_padre_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias_problema`
--

INSERT INTO `categorias_problema` (`id`, `categoria_padre_id`, `codigo`, `nombre`) VALUES
('0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', NULL, 'HARDWARE', 'Hardware'),
('0bbf3062-c4e8-11f1-83d1-b4a9fc7b2b7d', NULL, 'SOFTWARE', 'Software'),
('0bbf3293-c4e8-11f1-83d1-b4a9fc7b2b7d', NULL, 'REDES', 'Redes'),
('0bbf336c-c4e8-11f1-83d1-b4a9fc7b2b7d', NULL, 'SIN_CLASIFICAR', 'No estoy seguro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `certificaciones_tecnico`
--

CREATE TABLE `certificaciones_tecnico` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `emisor` text COLLATE utf8mb4_unicode_ci,
  `emitido_en` date DEFAULT NULL,
  `vence_en` date DEFAULT NULL,
  `verificada` tinyint(1) NOT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `incidencia_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cliente_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modalidad_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inicia_en` datetime(3) NOT NULL,
  `termina_en` datetime(3) NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio_est_min` decimal(12,2) NOT NULL,
  `precio_est_max` decimal(12,2) NOT NULL,
  `precio_acordado` decimal(12,2) DEFAULT NULL,
  `url_sesion_remota` text COLLATE utf8mb4_unicode_ci,
  `codigo_seguimiento` text COLLATE utf8mb4_unicode_ci,
  `completada_en` datetime(3) DEFAULT NULL,
  `cancelada_por` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motivo_cancelacion` text COLLATE utf8mb4_unicode_ci,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cobertura_tecnico`
--

CREATE TABLE `cobertura_tecnico` (
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distrito_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprobantes`
--

CREATE TABLE `comprobantes` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pago_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emisor_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serie` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero` int(11) NOT NULL,
  `cliente_tipo_doc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cliente_nro_doc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cliente_nombre` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `igv` decimal(12,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ref_proveedor` text COLLATE utf8mb4_unicode_ci,
  `url_pdf` text COLLATE utf8mb4_unicode_ci,
  `url_xml` text COLLATE utf8mb4_unicode_ci,
  `emitido_en` datetime(3) DEFAULT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentas_mp_tecnico`
--

CREATE TABLE `cuentas_mp_tecnico` (
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mp_usuario_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_acceso_cifrado` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_refresco_cifrado` text COLLATE utf8mb4_unicode_ci,
  `token_vence_en` datetime(3) DEFAULT NULL,
  `estado` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direcciones`
--

CREATE TABLE `direcciones` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distrito_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calle` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `referencia` text COLLATE utf8mb4_unicode_ci,
  `latitud` decimal(10,7) DEFAULT NULL,
  `longitud` decimal(10,7) DEFAULT NULL,
  `es_principal` tinyint(1) NOT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disputas`
--

CREATE TABLE `disputas` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cita_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abierta_por` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resolucion` text COLLATE utf8mb4_unicode_ci,
  `resuelto_por` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `resuelto_en` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `distritos`
--

CREATE TABLE `distritos` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ciudad` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ubigeo` char(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos_tecnico`
--

CREATE TABLE `documentos_tecnico` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `url_archivo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id`, `nombre`) VALUES
('517a013d-c581-11f1-a8d3-b4a9fc7b2b7d', 'Hardware y mantenimiento de PC'),
('517bc1d8-c581-11f1-a8d3-b4a9fc7b2b7d', 'Redes y conectividad'),
('517bc2d2-c581-11f1-a8d3-b4a9fc7b2b7d', 'Reparación de laptops'),
('517bbfcf-c581-11f1-a8d3-b4a9fc7b2b7d', 'Software y sistemas operativos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos_pago`
--

CREATE TABLE `eventos_pago` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proveedor` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `evento_id` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `carga` json NOT NULL,
  `procesado_en` datetime(3) DEFAULT NULL,
  `recibido_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `excepciones_disponibilidad`
--

CREATE TABLE `excepciones_disponibilidad` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_estado_cita`
--

CREATE TABLE `historial_estado_cita` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cita_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado_anterior` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_nuevo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cambiado_por` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cambiado_en` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incidencias`
--

CREATE TABLE `incidencias` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cliente_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_equipo_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `incidencias`
--

INSERT INTO `incidencias` (`id`, `cliente_id`, `tipo_equipo_id`, `categoria_id`, `descripcion`, `estado`, `creado_en`, `actualizado_en`) VALUES
('0d67598b-978f-4ecc-be45-4732d4e9330c', '65da9808-e3bb-470c-bcce-3ab430e0b089', '0b1b942c-c4e8-11f1-83d1-b4a9fc7b2b7d', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 'Prueba', 'REPORTADA', '2026-10-10 15:57:57.287', '2026-10-10 15:57:57.287'),
('51162782-6b4b-4671-b0b4-54b0c36b61f0', '65da9808-e3bb-470c-bcce-3ab430e0b089', '0b1b6d81-c4e8-11f1-83d1-b4a9fc7b2b7d', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 'Prueba', 'REPORTADA', '2026-10-10 16:34:23.694', '2026-10-10 16:34:23.694'),
('766b4971-34b4-477a-b6c6-3792a928e462', '65da9808-e3bb-470c-bcce-3ab430e0b089', '0b1b6d81-c4e8-11f1-83d1-b4a9fc7b2b7d', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 'Prueba', 'REPORTADA', '2026-10-10 16:29:29.038', '2026-10-10 16:29:29.038'),
('871e0c42-1337-4abe-bcb0-ba51ac1e2a19', '65da9808-e3bb-470c-bcce-3ab430e0b089', '0b1b942c-c4e8-11f1-83d1-b4a9fc7b2b7d', '0bbf336c-c4e8-11f1-83d1-b4a9fc7b2b7d', 'Hola', 'REPORTADA', '2026-10-10 15:37:03.444', '2026-10-10 15:37:03.444'),
('98bdaff7-a794-4126-b17a-c4a8b767aaf2', '65da9808-e3bb-470c-bcce-3ab430e0b089', '0b1b6d81-c4e8-11f1-83d1-b4a9fc7b2b7d', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 'Prueba', 'REPORTADA', '2026-10-10 16:24:22.111', '2026-10-10 16:24:22.111'),
('d0e481da-b346-446f-a031-902123083051', '65da9808-e3bb-470c-bcce-3ab430e0b089', '0b1b6d81-c4e8-11f1-83d1-b4a9fc7b2b7d', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 'Prueba2', 'REPORTADA', '2026-10-10 16:14:47.872', '2026-10-10 16:14:47.872');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cita_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remitente_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuerpo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modalidades_servicio`
--

CREATE TABLE `modalidades_servicio` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `modalidades_servicio`
--

INSERT INTO `modalidades_servicio` (`id`, `codigo`, `nombre`) VALUES
('5220feb2-c581-11f1-a8d3-b4a9fc7b2b7d', 'DOMICILIO', 'Atención a domicilio'),
('52211937-c581-11f1-a8d3-b4a9fc7b2b7d', 'REMOTO', 'Atención remota');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `titulo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuerpo` text COLLATE utf8mb4_unicode_ci,
  `datos` json DEFAULT NULL,
  `leido_en` datetime(3) DEFAULT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `opciones_triaje`
--

CREATE TABLE `opciones_triaje` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pregunta_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `texto` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `siguiente_pregunta_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `peso` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `opciones_triaje`
--

INSERT INTO `opciones_triaje` (`id`, `pregunta_id`, `texto`, `siguiente_pregunta_id`, `categoria_id`, `peso`) VALUES
('9cf84b82-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000001', 'Problema de encendido o energía', 'a1000000-0000-4000-8000-000000000002', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 1),
('9cf8817e-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000001', 'Lentitud extrema o congelamientos', 'a1000000-0000-4000-8000-000000000002', '0bbf3062-c4e8-11f1-83d1-b4a9fc7b2b7d', 2),
('9cf88529-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000001', 'Problemas de conexión a Internet (Redes)', 'a1000000-0000-4000-8000-000000000002', '0bbf3293-c4e8-11f1-83d1-b4a9fc7b2b7d', 3),
('9cf88752-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000001', 'Ruidos extraños o sobrecalentamiento', 'a1000000-0000-4000-8000-000000000002', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 4),
('9cfceb62-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000002', 'Sí, enciende y muestra pantalla', 'a1000000-0000-4000-8000-000000000003', '0bbf336c-c4e8-11f1-83d1-b4a9fc7b2b7d', 1),
('9d08849c-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000002', 'Enciende pero la pantalla se queda en negro', 'a1000000-0000-4000-8000-000000000003', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 2),
('9d0887f0-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000002', 'No enciende en absoluto', 'a1000000-0000-4000-8000-000000000003', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 3),
('9d0a7a02-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000003', 'Sí, ocurre con un programa o juego específico', 'a1000000-0000-4000-8000-000000000004', '0bbf3062-c4e8-11f1-83d1-b4a9fc7b2b7d', 1),
('9d0a7dc0-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000003', 'No, ocurre en cualquier momento', 'a1000000-0000-4000-8000-000000000004', '0bbf336c-c4e8-11f1-83d1-b4a9fc7b2b7d', 2),
('9d0a7f97-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000003', 'Ocurre apenas enciendo el equipo', 'a1000000-0000-4000-8000-000000000004', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 3),
('9d0e2ceb-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000004', 'Sí, una caída o golpe', NULL, '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 1),
('9d0e2ff9-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000004', 'Sí, derrame de líquidos', NULL, '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 2),
('9d0e314c-c4ec-11f1-83d1-b4a9fc7b2b7d', 'a1000000-0000-4000-8000-000000000004', 'No, ningún daño físico reciente', NULL, '0bbf336c-c4e8-11f1-83d1-b4a9fc7b2b7d', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cita_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pagador_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `comision_plataforma` decimal(12,2) NOT NULL,
  `monto_tecnico` decimal(12,2) NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `retencion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `liberar_en` datetime(3) DEFAULT NULL,
  `liberado_en` datetime(3) DEFAULT NULL,
  `mp_preferencia_id` text COLLATE utf8mb4_unicode_ci,
  `mp_pago_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mp_estado` text COLLATE utf8mb4_unicode_ci,
  `mp_detalle_estado` text COLLATE utf8mb4_unicode_ci,
  `medio_pago` text COLLATE utf8mb4_unicode_ci,
  `clave_idempotencia` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pagado_en` datetime(3) DEFAULT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfiles_tecnico`
--

CREATE TABLE `perfiles_tecnico` (
  `usuario_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `biografia` text COLLATE utf8mb4_unicode_ci,
  `anios_experiencia` smallint(6) DEFAULT NULL,
  `estado_verificacion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `verificado_en` datetime(3) DEFAULT NULL,
  `tarifa_hora_min` decimal(12,2) DEFAULT NULL,
  `tarifa_hora_max` decimal(12,2) DEFAULT NULL,
  `tasa_comision` decimal(12,2) DEFAULT NULL,
  `calificacion_prom` decimal(12,2) NOT NULL,
  `nro_reseñas` int(11) NOT NULL,
  `acepta_reservas` tinyint(1) NOT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `perfiles_tecnico`
--

INSERT INTO `perfiles_tecnico` (`usuario_id`, `biografia`, `anios_experiencia`, `estado_verificacion`, `verificado_en`, `tarifa_hora_min`, `tarifa_hora_max`, `tasa_comision`, `calificacion_prom`, `nro_reseñas`, `acepta_reservas`, `creado_en`, `actualizado_en`) VALUES
('2bf4c8e5-126d-4693-9e07-a490cc02680f', 'Técnico de demostración especializado en software y sistemas operativos.', 4, 'PENDIENTE', NULL, '60.00', '120.00', '10.00', '4.70', 19, 1, '2026-10-11 09:49:22.436', '2026-10-11 09:49:22.436'),
('8cdffaa4-fd30-4300-9db8-4f8d92249e36', 'Especialista de demostración en hardware y mantenimiento de computadoras.', 5, 'PENDIENTE', NULL, '90.00', '150.00', '10.00', '4.80', 24, 1, '2026-10-11 09:49:21.992', '2026-10-11 09:49:21.992'),
('c7921f82-32f2-43b3-b148-33d651b86d89', 'Técnica de demostración especializada en redes y conectividad.', 6, 'PENDIENTE', NULL, '50.00', '100.00', '10.00', '4.90', 42, 1, '2026-10-11 09:49:22.851', '2026-10-11 09:49:22.851');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_triaje`
--

CREATE TABLE `preguntas_triaje` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `texto` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `nro_orden` smallint(6) NOT NULL,
  `activa` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `preguntas_triaje`
--

INSERT INTO `preguntas_triaje` (`id`, `texto`, `nro_orden`, `activa`) VALUES
('a1000000-0000-4000-8000-000000000001', '¿Qué tipo de problema estás experimentando principalmente?', 1, 1),
('a1000000-0000-4000-8000-000000000002', '¿Tu equipo enciende correctamente?', 2, 1),
('a1000000-0000-4000-8000-000000000003', '¿Has notado si el problema ocurre al ejecutar algún programa específico?', 3, 1),
('a1000000-0000-4000-8000-000000000004', '¿El equipo ha sufrido algún daño físico reciente?', 4, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reembolsos`
--

CREATE TABLE `reembolsos` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pago_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mp_reembolso_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `solicitado_por` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reglas_disponibilidad`
--

CREATE TABLE `reglas_disponibilidad` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_semana` smallint(6) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseñas`
--

CREATE TABLE `reseñas` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cita_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cliente_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calificacion` smallint(6) NOT NULL,
  `comentario` text COLLATE utf8mb4_unicode_ci,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas_triaje`
--

CREATE TABLE `respuestas_triaje` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `incidencia_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pregunta_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `opcion_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `respondida_en` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `respuestas_triaje`
--

INSERT INTO `respuestas_triaje` (`id`, `incidencia_id`, `pregunta_id`, `opcion_id`, `respondida_en`) VALUES
('03603180-730b-409a-87c3-6b00f4da7cba', 'd0e481da-b346-446f-a031-902123083051', 'a1000000-0000-4000-8000-000000000003', '9d0a7a02-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:14:55.143'),
('4b7b437a-fb6e-477e-9764-8dcf6cc6dcbf', '766b4971-34b4-477a-b6c6-3792a928e462', 'a1000000-0000-4000-8000-000000000004', '9d0e2ceb-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:29:34.870'),
('4de95d51-9fac-417e-88b8-5bfbc479d480', 'd0e481da-b346-446f-a031-902123083051', 'a1000000-0000-4000-8000-000000000001', '9cf84b82-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:14:55.139'),
('5e8b9655-5529-4b4c-8242-38ebd856c11c', '51162782-6b4b-4671-b0b4-54b0c36b61f0', 'a1000000-0000-4000-8000-000000000001', '9cf8817e-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:34:53.820'),
('67a9ad0c-322b-4e1c-9751-dc91490a1c3d', '98bdaff7-a794-4126-b17a-c4a8b767aaf2', 'a1000000-0000-4000-8000-000000000002', '9cfceb62-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:24:29.275'),
('6c0dc0cf-d7f6-40a7-a95e-99bf11dc91c2', 'd0e481da-b346-446f-a031-902123083051', 'a1000000-0000-4000-8000-000000000002', '9cfceb62-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:14:55.142'),
('8325e85d-f51e-4309-9201-14d6af0cd1fc', '98bdaff7-a794-4126-b17a-c4a8b767aaf2', 'a1000000-0000-4000-8000-000000000004', '9d0e2ceb-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:24:29.276'),
('adcb68c4-322a-4a7d-840b-66cb81b8b2e0', '98bdaff7-a794-4126-b17a-c4a8b767aaf2', 'a1000000-0000-4000-8000-000000000001', '9cf84b82-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:24:29.274'),
('b478a848-0248-4d14-8097-84b8c3dd8124', '51162782-6b4b-4671-b0b4-54b0c36b61f0', 'a1000000-0000-4000-8000-000000000002', '9d08849c-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:34:53.821'),
('cb3381ab-0530-4a55-8db3-33368b4c2b09', '766b4971-34b4-477a-b6c6-3792a928e462', 'a1000000-0000-4000-8000-000000000003', '9d0a7a02-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:29:34.869'),
('daadc1d6-8dbd-414f-9a00-596cdc78ea6a', '51162782-6b4b-4671-b0b4-54b0c36b61f0', 'a1000000-0000-4000-8000-000000000003', '9d0a7a02-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:34:53.822'),
('eb344681-42ab-4249-84f0-feb08fcf9e03', '766b4971-34b4-477a-b6c6-3792a928e462', 'a1000000-0000-4000-8000-000000000002', '9cfceb62-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:29:34.868'),
('f4677730-551e-4ad0-8c6b-6831355293b3', '766b4971-34b4-477a-b6c6-3792a928e462', 'a1000000-0000-4000-8000-000000000001', '9cf84b82-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:29:34.867'),
('f4fedbcc-ca69-4aec-aaf0-daf0bba650b8', '51162782-6b4b-4671-b0b4-54b0c36b61f0', 'a1000000-0000-4000-8000-000000000004', '9d0e314c-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:34:53.823'),
('f752e6bb-1365-43d0-ac83-e02acb30bbb7', 'd0e481da-b346-446f-a031-902123083051', 'a1000000-0000-4000-8000-000000000004', '9d0e2ceb-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:14:55.144'),
('fe63d941-2b3f-4c3b-9387-7eaf63fc7e57', '98bdaff7-a794-4126-b17a-c4a8b767aaf2', 'a1000000-0000-4000-8000-000000000003', '9d0a7a02-c4ec-11f1-83d1-b4a9fc7b2b7d', '2026-10-10 16:24:29.275');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados_triaje`
--

CREATE TABLE `resultados_triaje` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `incidencia_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recomendacion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio_min` decimal(12,2) NOT NULL,
  `precio_max` decimal(12,2) NOT NULL,
  `version_reglas` text COLLATE utf8mb4_unicode_ci,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `resultados_triaje`
--

INSERT INTO `resultados_triaje` (`id`, `incidencia_id`, `categoria_id`, `recomendacion`, `precio_min`, `precio_max`, `version_reglas`, `creado_en`) VALUES
('0b8c32d9-c128-47a5-8252-b601dce978b2', '98bdaff7-a794-4126-b17a-c4a8b767aaf2', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 'El triaje preliminar apunta a la categoría Hardware. Un técnico deberá evaluar el equipo para confirmar la causa y el costo de reparación.', '90.00', '150.00', 'reglas-iniciales-v1', '2026-10-10 16:24:29.277'),
('2d004379-5086-49e8-a75c-0669e8963641', 'd0e481da-b346-446f-a031-902123083051', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 'El triaje preliminar apunta a la categoría Hardware. Un técnico deberá evaluar el equipo para confirmar la causa y el costo de reparación.', '90.00', '150.00', 'reglas-iniciales-v1', '2026-10-10 16:14:55.145'),
('9a52156f-e060-43c1-a955-f42b12a1f18c', '766b4971-34b4-477a-b6c6-3792a928e462', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d', 'El triaje preliminar apunta a la categoría Hardware. Un técnico deberá evaluar el equipo para confirmar la causa y el costo de reparación.', '90.00', '150.00', 'reglas-iniciales-v1', '2026-10-10 16:29:34.871'),
('c8454635-76a2-4045-8893-d4bfdf1d3ebb', '51162782-6b4b-4671-b0b4-54b0c36b61f0', '0bbf3062-c4e8-11f1-83d1-b4a9fc7b2b7d', 'El triaje preliminar apunta a la categoría Software. Un técnico deberá evaluar el equipo para confirmar la causa y el costo de reparación.', '60.00', '120.00', 'reglas-iniciales-v1', '2026-10-10 16:34:53.823');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnico_categorias`
--

CREATE TABLE `tecnico_categorias` (
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tecnico_categorias`
--

INSERT INTO `tecnico_categorias` (`tecnico_id`, `categoria_id`) VALUES
('8cdffaa4-fd30-4300-9db8-4f8d92249e36', '0bbeff90-c4e8-11f1-83d1-b4a9fc7b2b7d'),
('2bf4c8e5-126d-4693-9e07-a490cc02680f', '0bbf3062-c4e8-11f1-83d1-b4a9fc7b2b7d'),
('c7921f82-32f2-43b3-b148-33d651b86d89', '0bbf3293-c4e8-11f1-83d1-b4a9fc7b2b7d');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnico_especialidades`
--

CREATE TABLE `tecnico_especialidades` (
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `especialidad_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tecnico_especialidades`
--

INSERT INTO `tecnico_especialidades` (`tecnico_id`, `especialidad_id`) VALUES
('8cdffaa4-fd30-4300-9db8-4f8d92249e36', '517a013d-c581-11f1-a8d3-b4a9fc7b2b7d'),
('2bf4c8e5-126d-4693-9e07-a490cc02680f', '517bbfcf-c581-11f1-a8d3-b4a9fc7b2b7d'),
('c7921f82-32f2-43b3-b148-33d651b86d89', '517bc1d8-c581-11f1-a8d3-b4a9fc7b2b7d');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnico_modalidades`
--

CREATE TABLE `tecnico_modalidades` (
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modalidad_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tecnico_modalidades`
--

INSERT INTO `tecnico_modalidades` (`tecnico_id`, `modalidad_id`) VALUES
('2bf4c8e5-126d-4693-9e07-a490cc02680f', '5220feb2-c581-11f1-a8d3-b4a9fc7b2b7d'),
('8cdffaa4-fd30-4300-9db8-4f8d92249e36', '5220feb2-c581-11f1-a8d3-b4a9fc7b2b7d'),
('c7921f82-32f2-43b3-b148-33d651b86d89', '5220feb2-c581-11f1-a8d3-b4a9fc7b2b7d'),
('2bf4c8e5-126d-4693-9e07-a490cc02680f', '52211937-c581-11f1-a8d3-b4a9fc7b2b7d'),
('8cdffaa4-fd30-4300-9db8-4f8d92249e36', '52211937-c581-11f1-a8d3-b4a9fc7b2b7d'),
('c7921f82-32f2-43b3-b148-33d651b86d89', '52211937-c581-11f1-a8d3-b4a9fc7b2b7d');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnico_tipos_equipo`
--

CREATE TABLE `tecnico_tipos_equipo` (
  `tecnico_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_equipo_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tecnico_tipos_equipo`
--

INSERT INTO `tecnico_tipos_equipo` (`tecnico_id`, `tipo_equipo_id`) VALUES
('2bf4c8e5-126d-4693-9e07-a490cc02680f', '0b1b6d81-c4e8-11f1-83d1-b4a9fc7b2b7d'),
('8cdffaa4-fd30-4300-9db8-4f8d92249e36', '0b1b6d81-c4e8-11f1-83d1-b4a9fc7b2b7d'),
('c7921f82-32f2-43b3-b148-33d651b86d89', '0b1b6d81-c4e8-11f1-83d1-b4a9fc7b2b7d'),
('2bf4c8e5-126d-4693-9e07-a490cc02680f', '0b1b8fb4-c4e8-11f1-83d1-b4a9fc7b2b7d'),
('8cdffaa4-fd30-4300-9db8-4f8d92249e36', '0b1b8fb4-c4e8-11f1-83d1-b4a9fc7b2b7d'),
('c7921f82-32f2-43b3-b148-33d651b86d89', '0b1b8fb4-c4e8-11f1-83d1-b4a9fc7b2b7d'),
('c7921f82-32f2-43b3-b148-33d651b86d89', '0b1b924f-c4e8-11f1-83d1-b4a9fc7b2b7d'),
('2bf4c8e5-126d-4693-9e07-a490cc02680f', '0b1b9357-c4e8-11f1-83d1-b4a9fc7b2b7d');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_equipo`
--

CREATE TABLE `tipos_equipo` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipos_equipo`
--

INSERT INTO `tipos_equipo` (`id`, `codigo`, `nombre`) VALUES
('0b1b6d81-c4e8-11f1-83d1-b4a9fc7b2b7d', 'LAPTOP', 'Laptop'),
('0b1b8fb4-c4e8-11f1-83d1-b4a9fc7b2b7d', 'PC_ESCRITORIO', 'PC de Escritorio'),
('0b1b924f-c4e8-11f1-83d1-b4a9fc7b2b7d', 'SMARTPHONE', 'Smartphone'),
('0b1b9357-c4e8-11f1-83d1-b4a9fc7b2b7d', 'TABLET', 'Tablet'),
('0b1b942c-c4e8-11f1-83d1-b4a9fc7b2b7d', 'OTRO', 'Otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash_contrasena` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_completo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` text COLLATE utf8mb4_unicode_ci,
  `tipo_documento` text COLLATE utf8mb4_unicode_ci,
  `nro_documento` text COLLATE utf8mb4_unicode_ci,
  `rol` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo_verificado_en` datetime(3) DEFAULT NULL,
  `creado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `actualizado_en` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `correo`, `hash_contrasena`, `nombre_completo`, `telefono`, `tipo_documento`, `nro_documento`, `rol`, `estado`, `correo_verificado_en`, `creado_en`, `actualizado_en`) VALUES
('2bf4c8e5-126d-4693-9e07-a490cc02680f', 'carlos.lopez.demo@fixit.test', '$2b$12$eOtIHDZTdezE6GdxZZx0P.zJmIWXbMKy35mdtm.t8kVhNBu60ZES2', 'Carlos López', '900000002', NULL, NULL, 'TECNICO', 'ACTIVO', NULL, '2026-10-11 09:49:22.436', '2026-10-11 09:49:22.436'),
('3b85321e-aa15-4599-87c4-4be9eb8c7488', 'juan.prueba@fixit.com', '$2b$12$m5cpsE7K143S.XrkxYfsNu1H.j5ktXTdruSt1R6jWqItD.DVvcbRi', 'Nando', '988777666', 'DNI', '71234566', 'CLIENTE', 'ACTIVO', NULL, '2026-10-07 18:26:14.725', '2026-10-08 16:22:41.138'),
('65da9808-e3bb-470c-bcce-3ab430e0b089', '73449405@mail.isil.pe', '$2b$12$DYzeZ/VHzRZNq28m1X531OpE7oz496atIkjVLxPw1kset.NOC4rX2', 'Fernando', '943313474', 'DNI', '73449405', 'CLIENTE', 'ACTIVO', NULL, '2026-10-08 19:22:24.749', '2026-10-11 11:11:39.148'),
('6cc53d38-d191-4cdb-a753-20e062bedd81', 'usuario@fixit.com', '$2b$12$lpxfDtUXtquMpeZJfVK13eAyCJTpztx2T6u8b/FbRque39xKcRYj2', 'Usuario Demo', '999999999', 'DNI', '12345678', 'CLIENTE', 'ACTIVO', NULL, '2026-10-06 23:17:58.748', '2026-10-06 23:17:58.748'),
('70b1e8ba-b2b8-4a3b-a5c1-53fd54574aa8', 'prueba02@fixit.com', '$2b$12$fN1lhWhfPuyDqssNeIqO5ORuQ6MOnG4GboTlQI1b.y0FJCVg1W5oa', 'admin02', '943313474', 'DNI', '71234567', 'CLIENTE', 'ACTIVO', NULL, '2026-10-07 18:21:21.908', '2026-10-07 18:21:21.908'),
('8cdffaa4-fd30-4300-9db8-4f8d92249e36', 'juan.perez.demo@fixit.test', '$2b$12$dWojVERKM6ruNkW5aWoBpOVt9fTJr2TP69XFPz8uyemXpuxhZk9oS', 'Juan Pérez', '900000001', NULL, NULL, 'TECNICO', 'ACTIVO', NULL, '2026-10-11 09:49:21.988', '2026-10-11 09:49:21.988'),
('c7921f82-32f2-43b3-b148-33d651b86d89', 'maria.torres.demo@fixit.test', '$2b$12$4GyJXRHUFmgVxdi9ggm3WO.wbtMROlaBWaCZx5cYCKCUXONjP.I/W', 'María Torres', '900000003', NULL, NULL, 'TECNICO', 'ACTIVO', NULL, '2026-10-11 09:49:22.849', '2026-10-11 09:49:22.849');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adjuntos_incidencia`
--
ALTER TABLE `adjuntos_incidencia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_adjuntos_incidencia_incidencia_id` (`incidencia_id`);

--
-- Indices de la tabla `asientos_contables`
--
ALTER TABLE `asientos_contables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_asientos_contables_pago_id` (`pago_id`);

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_auditoria_actor_id` (`actor_id`);

--
-- Indices de la tabla `categorias_problema`
--
ALTER TABLE `categorias_problema`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_categorias_problema_codigo` (`codigo`),
  ADD KEY `idx_categorias_problema_categoria_padre_id` (`categoria_padre_id`);

--
-- Indices de la tabla `certificaciones_tecnico`
--
ALTER TABLE `certificaciones_tecnico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_certificaciones_tecnico_tecnico_id` (`tecnico_id`);

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_citas_incidencia_id` (`incidencia_id`),
  ADD KEY `idx_citas_cliente_id` (`cliente_id`),
  ADD KEY `idx_citas_tecnico_id` (`tecnico_id`),
  ADD KEY `idx_citas_modalidad_id` (`modalidad_id`),
  ADD KEY `idx_citas_direccion_id` (`direccion_id`),
  ADD KEY `idx_citas_cancelada_por` (`cancelada_por`);

--
-- Indices de la tabla `cobertura_tecnico`
--
ALTER TABLE `cobertura_tecnico`
  ADD PRIMARY KEY (`tecnico_id`,`distrito_id`),
  ADD KEY `fk_cobertura_tecnico_distrito_id_distritos` (`distrito_id`);

--
-- Indices de la tabla `comprobantes`
--
ALTER TABLE `comprobantes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_comprobantes_pago_id` (`pago_id`),
  ADD KEY `idx_comprobantes_emisor_id` (`emisor_id`);

--
-- Indices de la tabla `cuentas_mp_tecnico`
--
ALTER TABLE `cuentas_mp_tecnico`
  ADD PRIMARY KEY (`tecnico_id`),
  ADD UNIQUE KEY `uq_cuentas_mp_tecnico_mp_usuario_id` (`mp_usuario_id`);

--
-- Indices de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_direcciones_usuario_id` (`usuario_id`),
  ADD KEY `idx_direcciones_distrito_id` (`distrito_id`);

--
-- Indices de la tabla `disputas`
--
ALTER TABLE `disputas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_disputas_cita_id` (`cita_id`),
  ADD KEY `idx_disputas_abierta_por` (`abierta_por`),
  ADD KEY `idx_disputas_resuelto_por` (`resuelto_por`);

--
-- Indices de la tabla `distritos`
--
ALTER TABLE `distritos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `documentos_tecnico`
--
ALTER TABLE `documentos_tecnico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_documentos_tecnico_tecnico_id` (`tecnico_id`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_especialidades_nombre` (`nombre`);

--
-- Indices de la tabla `eventos_pago`
--
ALTER TABLE `eventos_pago`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `excepciones_disponibilidad`
--
ALTER TABLE `excepciones_disponibilidad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_excepciones_disponibilidad_tecnico_id` (`tecnico_id`);

--
-- Indices de la tabla `historial_estado_cita`
--
ALTER TABLE `historial_estado_cita`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_historial_estado_cita_cita_id` (`cita_id`),
  ADD KEY `idx_historial_estado_cita_cambiado_por` (`cambiado_por`);

--
-- Indices de la tabla `incidencias`
--
ALTER TABLE `incidencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_incidencias_cliente_id` (`cliente_id`),
  ADD KEY `idx_incidencias_tipo_equipo_id` (`tipo_equipo_id`),
  ADD KEY `idx_incidencias_categoria_id` (`categoria_id`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mensajes_cita_id` (`cita_id`),
  ADD KEY `idx_mensajes_remitente_id` (`remitente_id`);

--
-- Indices de la tabla `modalidades_servicio`
--
ALTER TABLE `modalidades_servicio`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_modalidades_servicio_codigo` (`codigo`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notificaciones_usuario_id` (`usuario_id`);

--
-- Indices de la tabla `opciones_triaje`
--
ALTER TABLE `opciones_triaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_opciones_triaje_pregunta_id` (`pregunta_id`),
  ADD KEY `idx_opciones_triaje_siguiente_pregunta_id` (`siguiente_pregunta_id`),
  ADD KEY `idx_opciones_triaje_categoria_id` (`categoria_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_pagos_clave_idempotencia` (`clave_idempotencia`),
  ADD UNIQUE KEY `uq_pagos_mp_pago_id` (`mp_pago_id`),
  ADD KEY `idx_pagos_cita_id` (`cita_id`),
  ADD KEY `idx_pagos_pagador_id` (`pagador_id`);

--
-- Indices de la tabla `perfiles_tecnico`
--
ALTER TABLE `perfiles_tecnico`
  ADD PRIMARY KEY (`usuario_id`);

--
-- Indices de la tabla `preguntas_triaje`
--
ALTER TABLE `preguntas_triaje`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reembolsos`
--
ALTER TABLE `reembolsos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_reembolsos_mp_reembolso_id` (`mp_reembolso_id`),
  ADD KEY `idx_reembolsos_pago_id` (`pago_id`),
  ADD KEY `idx_reembolsos_solicitado_por` (`solicitado_por`);

--
-- Indices de la tabla `reglas_disponibilidad`
--
ALTER TABLE `reglas_disponibilidad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reglas_disponibilidad_tecnico_id` (`tecnico_id`);

--
-- Indices de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_reseñas_cita_id` (`cita_id`),
  ADD KEY `idx_reseñas_cita_id` (`cita_id`),
  ADD KEY `idx_reseñas_cliente_id` (`cliente_id`),
  ADD KEY `idx_reseñas_tecnico_id` (`tecnico_id`);

--
-- Indices de la tabla `respuestas_triaje`
--
ALTER TABLE `respuestas_triaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_respuestas_triaje_incidencia_id` (`incidencia_id`),
  ADD KEY `idx_respuestas_triaje_pregunta_id` (`pregunta_id`),
  ADD KEY `idx_respuestas_triaje_opcion_id` (`opcion_id`);

--
-- Indices de la tabla `resultados_triaje`
--
ALTER TABLE `resultados_triaje`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_resultados_triaje_incidencia_id` (`incidencia_id`),
  ADD KEY `idx_resultados_triaje_incidencia_id` (`incidencia_id`),
  ADD KEY `idx_resultados_triaje_categoria_id` (`categoria_id`);

--
-- Indices de la tabla `tecnico_categorias`
--
ALTER TABLE `tecnico_categorias`
  ADD PRIMARY KEY (`tecnico_id`,`categoria_id`),
  ADD KEY `fk_tecnico_categorias_categoria_id_categorias_problema` (`categoria_id`);

--
-- Indices de la tabla `tecnico_especialidades`
--
ALTER TABLE `tecnico_especialidades`
  ADD PRIMARY KEY (`tecnico_id`,`especialidad_id`),
  ADD KEY `fk_tecnico_especialidades_especialidad_id_especialidades` (`especialidad_id`);

--
-- Indices de la tabla `tecnico_modalidades`
--
ALTER TABLE `tecnico_modalidades`
  ADD PRIMARY KEY (`tecnico_id`,`modalidad_id`),
  ADD KEY `fk_tecnico_modalidades_modalidad_id_modalidades_servicio` (`modalidad_id`);

--
-- Indices de la tabla `tecnico_tipos_equipo`
--
ALTER TABLE `tecnico_tipos_equipo`
  ADD PRIMARY KEY (`tecnico_id`,`tipo_equipo_id`),
  ADD KEY `fk_tecnico_tipos_equipo_tipo_equipo_id_tipos_equipo` (`tipo_equipo_id`);

--
-- Indices de la tabla `tipos_equipo`
--
ALTER TABLE `tipos_equipo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_tipos_equipo_codigo` (`codigo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_usuarios_correo` (`correo`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adjuntos_incidencia`
--
ALTER TABLE `adjuntos_incidencia`
  ADD CONSTRAINT `fk_adjuntos_incidencia_incidencia_id_incidencias` FOREIGN KEY (`incidencia_id`) REFERENCES `incidencias` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `asientos_contables`
--
ALTER TABLE `asientos_contables`
  ADD CONSTRAINT `fk_asientos_contables_pago_id_pagos` FOREIGN KEY (`pago_id`) REFERENCES `pagos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `fk_auditoria_actor_id_usuarios` FOREIGN KEY (`actor_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `categorias_problema`
--
ALTER TABLE `categorias_problema`
  ADD CONSTRAINT `fk_3_categorias_problema_categoria_padre_categorias_prob` FOREIGN KEY (`categoria_padre_id`) REFERENCES `categorias_problema` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `certificaciones_tecnico`
--
ALTER TABLE `certificaciones_tecnico`
  ADD CONSTRAINT `fk_certificaciones_tecnico_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `fk_citas_cancelada_por_usuarios` FOREIGN KEY (`cancelada_por`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_citas_cliente_id_usuarios` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_citas_direccion_id_direcciones` FOREIGN KEY (`direccion_id`) REFERENCES `direcciones` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_citas_incidencia_id_incidencias` FOREIGN KEY (`incidencia_id`) REFERENCES `incidencias` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_citas_modalidad_id_modalidades_servicio` FOREIGN KEY (`modalidad_id`) REFERENCES `modalidades_servicio` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_citas_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `cobertura_tecnico`
--
ALTER TABLE `cobertura_tecnico`
  ADD CONSTRAINT `fk_cobertura_tecnico_distrito_id_distritos` FOREIGN KEY (`distrito_id`) REFERENCES `distritos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cobertura_tecnico_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `comprobantes`
--
ALTER TABLE `comprobantes`
  ADD CONSTRAINT `fk_comprobantes_emisor_id_usuarios` FOREIGN KEY (`emisor_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comprobantes_pago_id_pagos` FOREIGN KEY (`pago_id`) REFERENCES `pagos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `cuentas_mp_tecnico`
--
ALTER TABLE `cuentas_mp_tecnico`
  ADD CONSTRAINT `fk_cuentas_mp_tecnico_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD CONSTRAINT `fk_direcciones_distrito_id_distritos` FOREIGN KEY (`distrito_id`) REFERENCES `distritos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_direcciones_usuario_id_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `disputas`
--
ALTER TABLE `disputas`
  ADD CONSTRAINT `fk_disputas_abierta_por_usuarios` FOREIGN KEY (`abierta_por`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_disputas_cita_id_citas` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_disputas_resuelto_por_usuarios` FOREIGN KEY (`resuelto_por`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `documentos_tecnico`
--
ALTER TABLE `documentos_tecnico`
  ADD CONSTRAINT `fk_documentos_tecnico_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `excepciones_disponibilidad`
--
ALTER TABLE `excepciones_disponibilidad`
  ADD CONSTRAINT `fk_excepciones_disponibilidad_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `historial_estado_cita`
--
ALTER TABLE `historial_estado_cita`
  ADD CONSTRAINT `fk_historial_estado_cita_cambiado_por_usuarios` FOREIGN KEY (`cambiado_por`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_historial_estado_cita_cita_id_citas` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `incidencias`
--
ALTER TABLE `incidencias`
  ADD CONSTRAINT `fk_incidencias_categoria_id_categorias_problema` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_problema` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_incidencias_cliente_id_usuarios` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_incidencias_tipo_equipo_id_tipos_equipo` FOREIGN KEY (`tipo_equipo_id`) REFERENCES `tipos_equipo` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `fk_mensajes_cita_id_citas` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mensajes_remitente_id_usuarios` FOREIGN KEY (`remitente_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `fk_notificaciones_usuario_id_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `opciones_triaje`
--
ALTER TABLE `opciones_triaje`
  ADD CONSTRAINT `fk_opciones_triaje_categoria_id_categorias_problema` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_problema` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_opciones_triaje_pregunta_id_preguntas_triaje` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas_triaje` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_opciones_triaje_siguiente_pregunta_id_preguntas_triaje` FOREIGN KEY (`siguiente_pregunta_id`) REFERENCES `preguntas_triaje` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pagos_cita_id_citas` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pagos_pagador_id_usuarios` FOREIGN KEY (`pagador_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `perfiles_tecnico`
--
ALTER TABLE `perfiles_tecnico`
  ADD CONSTRAINT `fk_perfiles_tecnico_usuario_id_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `reembolsos`
--
ALTER TABLE `reembolsos`
  ADD CONSTRAINT `fk_reembolsos_pago_id_pagos` FOREIGN KEY (`pago_id`) REFERENCES `pagos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reembolsos_solicitado_por_usuarios` FOREIGN KEY (`solicitado_por`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `reglas_disponibilidad`
--
ALTER TABLE `reglas_disponibilidad`
  ADD CONSTRAINT `fk_reglas_disponibilidad_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD CONSTRAINT `fk_reseñas_cita_id_citas` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reseñas_cliente_id_usuarios` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reseñas_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuestas_triaje`
--
ALTER TABLE `respuestas_triaje`
  ADD CONSTRAINT `fk_respuestas_triaje_incidencia_id_incidencias` FOREIGN KEY (`incidencia_id`) REFERENCES `incidencias` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_respuestas_triaje_opcion_id_opciones_triaje` FOREIGN KEY (`opcion_id`) REFERENCES `opciones_triaje` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_respuestas_triaje_pregunta_id_preguntas_triaje` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas_triaje` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `resultados_triaje`
--
ALTER TABLE `resultados_triaje`
  ADD CONSTRAINT `fk_resultados_triaje_categoria_id_categorias_problema` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_problema` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_resultados_triaje_incidencia_id_incidencias` FOREIGN KEY (`incidencia_id`) REFERENCES `incidencias` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `tecnico_categorias`
--
ALTER TABLE `tecnico_categorias`
  ADD CONSTRAINT `fk_tecnico_categorias_categoria_id_categorias_problema` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_problema` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tecnico_categorias_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `tecnico_especialidades`
--
ALTER TABLE `tecnico_especialidades`
  ADD CONSTRAINT `fk_tecnico_especialidades_especialidad_id_especialidades` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tecnico_especialidades_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `tecnico_modalidades`
--
ALTER TABLE `tecnico_modalidades`
  ADD CONSTRAINT `fk_tecnico_modalidades_modalidad_id_modalidades_servicio` FOREIGN KEY (`modalidad_id`) REFERENCES `modalidades_servicio` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tecnico_modalidades_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `tecnico_tipos_equipo`
--
ALTER TABLE `tecnico_tipos_equipo`
  ADD CONSTRAINT `fk_tecnico_tipos_equipo_tecnico_id_perfiles_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `perfiles_tecnico` (`usuario_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tecnico_tipos_equipo_tipo_equipo_id_tipos_equipo` FOREIGN KEY (`tipo_equipo_id`) REFERENCES `tipos_equipo` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

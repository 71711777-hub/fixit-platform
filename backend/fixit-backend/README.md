# FixIT Backend — Node.js + Express + MySQL

Backend inicial de FixIT enfocado en usuarios y autenticación.

## Requisitos

- Node.js 20+
- MySQL 8+
- Base de datos creada con `FixIT_MySQL.sql`

## 1. Instalar dependencias

```bash
npm install
```

## 2. Configurar variables de entorno

Copia `.env.example` como `.env` y completa:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fixit
DB_USER=root
DB_PASSWORD=TU_PASSWORD_MYSQL
JWT_SECRET=UNA_CLAVE_LARGA_Y_ALEATORIA
JWT_EXPIRES_IN=2h
CORS_ORIGIN=http://localhost:5173
```

## 3. Ejecutar

Desarrollo:

```bash
npm run dev
```

Producción:

```bash
npm start
```

## Endpoints

### Health
`GET /health`

Comprueba que Express y MySQL estén disponibles.

### Registro
`POST /api/auth/register`

Body:

```json
{
  "correo": "usuario@ejemplo.com",
  "contrasena": "12345678",
  "nombre_completo": "Usuario Demo",
  "telefono": "999999999",
  "tipo_documento": "DNI",
  "nro_documento": "12345678"
}
```

### Login
`POST /api/auth/login`

Body:

```json
{
  "correo": "usuario@ejemplo.com",
  "contrasena": "12345678"
}
```

Devuelve un JWT.

### Usuario autenticado
`GET /api/users/me`

Header:

```text
Authorization: Bearer TU_TOKEN
```

## Seguridad inicial

- Contraseñas con `bcryptjs` (nunca se guarda la contraseña original).
- JWT para autenticación.
- Helmet para cabeceras de seguridad.
- CORS configurable.
- No se devuelve `hash_contrasena` en las respuestas.
- La consulta SQL usa parámetros para evitar inyección SQL.

## Próximos módulos

1. Recuperación/verificación de cuenta.
2. Roles y permisos (cliente, técnico, administrador).
3. Perfil del técnico.
4. Direcciones.
5. Incidencias.
6. Triaje.
7. Citas.
8. Pagos.
9. Notificaciones.

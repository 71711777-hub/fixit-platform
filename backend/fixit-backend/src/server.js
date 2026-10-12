import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection } from './db.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import incidenciasRoutes from './routes/incidencias.routes.js';
import tecnicosRoutes from './routes/tecnicos.routes.js';
import triajeRoutes from './routes/triaje.routes.js';



dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.get('/health', async (_req, res) => {
  try {
    await testConnection();
    res.json({ ok: true, service: 'fixit-backend', database: 'connected' });
  } catch {
    res.status(503).json({ ok: false, service: 'fixit-backend', database: 'disconnected' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/triaje', triajeRoutes);
app.use('/api/tecnicos', tecnicosRoutes);



app.use((_req, res) => {
  res.status(404).json({ ok: false, message: 'Ruta no encontrada.' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    ok: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor.'
      : error.message
  });
});

try {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`FixIT API ejecutándose en http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('No se pudo conectar a MySQL:', error.message);
  process.exit(1);
}

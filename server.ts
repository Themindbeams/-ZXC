import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractAuth } from './server/middleware';
import { apiRouter } from './server/routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Core Express middlewares
  app.use(express.json());
  app.use(cookieParser());
  app.use(extractAuth);

  // Mount API router
  app.use('/api', apiRouter);

  // Health endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  if (!isProd) {
    // Mount Vite middlewares in development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log(`[ZEEX Commerce] Vite dev server mounted in middleware mode`);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`[ZEEX Commerce] Serving static build from ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZEEX Commerce] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[ZEEX Commerce] Server startup error:', err);
  process.exit(1);
});

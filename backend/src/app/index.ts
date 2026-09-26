import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from '../config/index.js';
import { errorHandler } from '../middleware/errorHandler.js';

export function createApp(): Express {
  const app = express();

  app.use(cors({
    origin: config.corsOrigins,
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health and Status Endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'nexatalent-backend-api',
      environment: config.env,
    });
  });

  // Base API v1 endpoint info
  app.get('/api/v1', (_req: Request, res: Response) => {
    res.json({
      version: '1.0.0',
      message: 'NexaTalent Modular Recruitment API',
      modules: [
        'auth',
        'users',
        'jobs',
        'candidates',
        'employers',
        'ats',
        'interviews',
        'crm',
        'notifications',
      ],
    });
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
}

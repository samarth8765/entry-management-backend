import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { Database } from './config/db';
import { validateEnv } from './config/environment';
import { AnalyticsRoutes } from './routes/analytics.route';
import { EventRoutes } from './routes/event.route';
import { PersonRoutes } from './routes/person.route';
import { AppError, Errorhandler } from './utils/error';

export const createServer = async () => {
  validateEnv();
  await Database.Loader();
  const app = express();

  app.use((request: Request, _response: Response, next: NextFunction) => {
    // @todo add logger
    console.debug(`${request.method} ${request.url}`);
    return next();
  });

  app.use(
    cors({
      origin: ['https://entry-management-frontend.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    })
  );

  app.options('*', cors());

  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/v1/health', (_request: Request, response: Response) => {
    return response.status(200).json({ status: 'ok' });
  });

  app.use('/api/v1/person', PersonRoutes);
  app.use('/api/v1/event', EventRoutes);
  app.use('/api/v1/analytics', AnalyticsRoutes);

  app.use('*', () => {
    throw new AppError('Not found', 404);
  });

  app.use(Errorhandler);

  return { app };
};

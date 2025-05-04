import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

export const AnalyticsRoutes = Router();

AnalyticsRoutes.get('/', AnalyticsController.GetBuildingAnalytics);

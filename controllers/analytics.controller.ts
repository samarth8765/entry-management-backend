import type { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

const GetBuildingAnalytics = async (_request: Request, response: Response) => {
  const analytics = await AnalyticsService.GetBuildingAnalytics();
  return response.status(200).json({ status: true, data: analytics });
};

export const AnalyticsController = {
  GetBuildingAnalytics
};

import { Router } from 'express';
import { EventController } from '../controllers/event.controller';

export const EventRoutes = Router();

EventRoutes.post('/entry', EventController.RegisterEntry);
EventRoutes.post('/exit', EventController.RegisterExit);

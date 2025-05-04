import type { Request, Response } from 'express';
import { EventService } from '../services/event.service';

const RegisterEntry = async (request: Request, response: Response) => {
  const data = await EventService.RegisterEntry(request.body);
  return response.status(201).json({ status: true, data });
};

const RegisterExit = async (request: Request, response: Response) => {
  const data = await EventService.RegisterExit(request.body);
  return response.status(201).json({ status: true, data });
};

export const EventController = {
  RegisterEntry,
  RegisterExit
};

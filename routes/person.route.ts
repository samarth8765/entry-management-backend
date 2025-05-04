import { Router } from 'express';
import { PersonController } from '../controllers/person.controller';

export const PersonRoutes = Router();

PersonRoutes.post('/', PersonController.CreatePerson);
PersonRoutes.get('/', PersonController.GetPersonsInside);
PersonRoutes.get('/:personId', PersonController.GetPerson);
PersonRoutes.get('/:personId/history', PersonController.GetPersonHistory);

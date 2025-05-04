import type { Request, Response } from 'express';
import { PersonService } from '../services/person.service';
import type { HistoryQueryParams } from '../types/event';
import { AppError } from '../utils/error';

const CreatePerson = async (request: Request, response: Response) => {
  const { personName } = request.body;
  if (!personName) {
    throw new AppError('Person name is required', 400);
  }

  const data = await PersonService.CreatePerson(personName);
  return response.status(201).json({ status: true, data });
};

const GetPerson = async (request: Request, response: Response) => {
  const { personId } = request.params;
  if (!personId) {
    throw new AppError('Person id is required', 400);
  }
  const data = await PersonService.GetPersonById(personId);
  return response.status(200).json({ status: true, data });
};

const GetPersonsInside = async (request: Request, response: Response) => {
  const page = Number.parseInt(request.query.page as string);
  const limit = Number.parseInt(request.query.limit as string) || -1;

  const { data, totalCount, totalPages, currentPage } =
    await PersonService.GetPersonInside(limit, page);

  return response.status(200).json({
    status: true,
    meta: {
      totalCount,
      totalPages,
      currentPage: limit === -1 ? 1 : currentPage,
      limit: limit === -1 ? totalCount : limit
    },
    data
  });
};

const GetPersonHistory = async (request: Request, response: Response) => {
  const { personId } = request.params;
  const { startDate, endDate } = request.query as HistoryQueryParams;

  const page = Number.parseInt(request.query.page as string);
  const limit = Number.parseInt(request.query.limit as string) || -1;

  if (!personId) {
    throw new Error('Person id is required');
  }

  const { data, totalCount, totalPages, currentPage } =
    await PersonService.GetPersonHistory(
      personId,
      startDate,
      endDate,
      limit,
      page
    );

  return response.status(200).json({
    status: true,
    meta: {
      totalCount,
      totalPages,
      currentPage: limit === -1 ? 1 : currentPage,
      limit: limit === -1 ? totalCount : limit
    },
    data
  });
};

export const PersonController = {
  CreatePerson,
  GetPerson,
  GetPersonsInside,
  GetPersonHistory
};

import Event from '../model/event.model';
import Person from '../model/person.model';
import type { EventQueryFilters, IEventDocument } from '../types/event';
import type { IPersonDocument } from '../types/person';
import { AppError } from '../utils/error';
import { GeneratePublicId } from '../utils/id';
import { tryCatch } from '../utils/try-catch';

const GetPersonInside = async (
  limit: number,
  page?: number
): Promise<{
  data: IPersonDocument[];
  totalCount: number;
  totalPages: number;
  currentPage?: number;
}> => {
  const queryLimit = limit === -1 ? Number.MAX_SAFE_INTEGER : limit;
  let skip = 0;
  if (page) {
    skip = (page - 1) * limit;
  }

  const [data, totalCount] = await Promise.all([
    Person.find({ currentlyInside: true })
      .skip(skip)
      .limit(queryLimit)
      .sort({ lastEntry: -1 }),
    Person.countDocuments({ currentlyInside: true })
  ]);

  const totalPages = limit === -1 ? 1 : Math.ceil(totalCount / limit);

  return {
    data,
    totalCount,
    totalPages,
    currentPage: page
  };
};

const GetPersonById = async (personId: string): Promise<IPersonDocument> => {
  const { data, error } = await tryCatch(Person.findOne({ personId }));

  if (error) {
    throw new AppError(error.message, 500);
  }

  if (!data) {
    throw new AppError('Person not found', 404);
  }

  return data;
};

const CreatePerson = async (name: string): Promise<IPersonDocument> => {
  let personId = `PR-${GeneratePublicId(6)}`;
  let isUnique = false;

  // Keep generating new IDs until we find a unique one
  while (!isUnique) {
    const existingPerson = await Person.findOne({ personId });
    if (existingPerson) {
      personId = `PR-${GeneratePublicId(6)}`;
    } else {
      isUnique = true;
    }
  }

  const { data, error } = await tryCatch(
    Person.create({
      name,
      personId
    })
  );

  if (error) {
    throw new AppError('Failed to create person', 400);
  }

  return data;
};

const GetPersonHistory = async (
  personId: string,
  startDate?: string,
  endDate?: string,
  limit = -1,
  page?: number
): Promise<{
  data: IEventDocument[];
  totalCount: number;
  totalPages: number;
  currentPage?: number;
}> => {
  const person = await Person.findOne({ personId });
  if (!person) {
    throw new AppError(`Person with ID ${personId} not found`, 404);
  }

  let parsedStartDate: Date | undefined;
  let parsedEndDate: Date | undefined;

  if (startDate) {
    const timestamp = Date.parse(startDate);
    if (Number.isNaN(timestamp)) {
      throw new AppError(
        'Invalid start date format. Please use ISO format (YYYY-MM-DD)',
        400
      );
    }
    parsedStartDate = new Date(timestamp);
  }

  if (endDate) {
    const timestamp = Date.parse(endDate);
    if (Number.isNaN(timestamp)) {
      throw new AppError(
        'Invalid end date format. Please use ISO format (YYYY-MM-DD)',
        400
      );
    }
    parsedEndDate = new Date(timestamp);
  }

  if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
    throw new AppError('Start date cannot be after end date', 400);
  }

  const filter: EventQueryFilters = { personId };
  if (parsedStartDate || parsedEndDate) {
    filter.timestamp = {};

    if (parsedStartDate) {
      filter.timestamp.$gte = parsedStartDate;
    }

    if (parsedEndDate) {
      filter.timestamp.$lte = parsedEndDate;
    }
  }

  let skip = 0;
  if (page) {
    skip = (page - 1) * limit;
  }
  const queryLimit = limit === -1 ? Number.MAX_SAFE_INTEGER : limit;

  const [data, totalCount] = await Promise.all([
    Event.find(filter).sort({ timestamp: -1 }).skip(skip).limit(queryLimit),
    Event.countDocuments(filter)
  ]);

  const totalPages = limit === -1 ? 1 : Math.ceil(totalCount / limit);

  return {
    data,
    totalCount,
    totalPages,
    currentPage: page
  };
};

export const PersonService = {
  GetPersonInside,
  GetPersonById,
  CreatePerson,
  GetPersonHistory
};

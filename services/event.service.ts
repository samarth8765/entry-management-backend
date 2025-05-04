import Event from '../model/event.model';
import Person from '../model/person.model';
import { CreateExitEntrySchema } from '../schemas/event';
import { EventType, type IEntryExitPayload } from '../types/event';
import { AppError } from '../utils/error';
import { tryCatch } from '../utils/try-catch';
import { SchemaValidation } from '../utils/validation';

const RegisterEntry = async (payload: IEntryExitPayload) => {
  const schema = SchemaValidation(payload, CreateExitEntrySchema);
  if (!schema) {
    throw new AppError('Invalid request body', 400);
  }
  const { personId, gate } = payload;
  const person = await Person.findOne({ personId });
  if (!person) {
    throw new AppError(`Person with ID ${personId} not found`, 404);
  }

  if (person.currentlyInside) {
    throw new AppError('Person is already inside', 400);
  }

  const { data, error: createError } = await tryCatch(
    Event.create({
      personId,
      eventType: EventType.ENTRY,
      gate
    })
  );

  if (createError) {
    throw new AppError('Failed to register entry', 400);
  }

  // Update person's entry status
  const { error: updateError } = await tryCatch(
    Person.updateOne(
      { personId },
      { currentlyInside: true, lastEntry: new Date() }
    )
  );

  if (updateError) {
    throw new AppError("Failed to update person's entry status", 400);
  }

  return data;
};

const RegisterExit = async (payload: IEntryExitPayload) => {
  const schema = SchemaValidation(payload, CreateExitEntrySchema);
  if (!schema) {
    throw new AppError('Invalid request body', 400);
  }
  const { personId, gate } = payload;
  const person = await Person.findOne({ personId });
  if (!person) {
    throw new AppError(`Person with ID ${personId} not found`, 404);
  }

  if (!person.currentlyInside) {
    throw new AppError('Person is already outside', 400);
  }

  const { data, error: createError } = await tryCatch(
    Event.create({
      personId,
      eventType: EventType.EXIT,
      gate
    })
  );

  if (createError) {
    throw new AppError('Failed to register exit', 400);
  }

  // Update person's exit status
  const { error: updateError } = await tryCatch(
    Person.updateOne(
      { personId },
      { currentlyInside: false, lastExit: new Date() }
    )
  );

  if (updateError) {
    throw new AppError("Failed to update person's exit status", 400);
  }

  return data;
};

export const EventService = {
  RegisterEntry,
  RegisterExit
};

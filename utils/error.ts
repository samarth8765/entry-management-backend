import type { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  public statusCode: number;

  constructor(message = 'Something went wrong', statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export const Errorhandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return response
      .status(error.statusCode)
      .json({ status: error.statusCode, error: error.message });
  }
  console.error(error);
  return response.status(500).json({ error: 'Internal Server Error' });
};

import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  errors?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error: CustomError = { ...err };
  error.message = err.message;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = {
      name: 'ValidationError',
      message: message.join(', '),
      statusCode: 400
    };
  }

  // Mongoose duplicate key error
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    const message = 'Korisnik sa ovim emailom već postoji';
    error = {
      name: 'DuplicateError',
      message,
      statusCode: 400
    };
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    const message = 'Neispravni ID format';
    error = {
      name: 'CastError',
      message,
      statusCode: 400
    };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Neispravni token';
    error = {
      name: 'JsonWebTokenError',
      message,
      statusCode: 401
    };
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token je istekao';
    error = {
      name: 'TokenExpiredError',
      message,
      statusCode: 401
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server greška',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}; 
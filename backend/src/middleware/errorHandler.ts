import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  // P2-9: prod never echoes validation internals/PII — generic message only.
  const isProd = (process.env.NODE_ENV || '') === 'production';
  const message = statusCode === 500 || isProd
    ? (statusCode === 500 ? 'Internal Server Error' : 'Request failed.')
    : (err.message || 'Internal Server Error');

  // Server log keeps the stack; client responses never include it outside dev.
  // P2-9: scrub tokens/secrets from logs.
  const safeMsg = String(err.message || '').replace(/(Bearer\s+)[A-Za-z0-9\-._~+/=]+/g, '$1[redacted]').slice(0, 500);
  console.error(`[Error] ${statusCode}: ${safeMsg}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(!isProd && err.errors ? { errors: err.errors } : {}),
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { resetPrismaConnection } from './prisma';

export const isPreparedStatementError = (error: unknown): boolean => {
  if (error instanceof PrismaClientKnownRequestError) {
    const errorCode = error.code;
    return errorCode === '26000' || errorCode === '42P05';
  }

  if (error instanceof Error) {
    const message = error.message;
    return (
      message.includes('prepared statement') ||
      message.includes('does not exist') ||
      message.includes('already exists')
    );
  }

  return false;
};

export const withPrismaErrorHandling = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (isPreparedStatementError(error) && attempt < maxRetries) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn(
            `⚠️  Prepared statement error detected, resetting connection... (attempt ${attempt + 1}/${maxRetries})`
          );
        }

        try {
          await resetPrismaConnection();
        } catch (resetError) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('Failed to reset connection:', resetError);
          }
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 200 * (attempt + 1))
        );
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

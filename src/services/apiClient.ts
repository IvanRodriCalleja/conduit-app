import { logger } from '../utils/logger';

interface ApiClientInit extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000;

const apiClient = async <T = any>(
  input: RequestInfo | URL,
  init?: ApiClientInit
): Promise<T> => {
  const { retries = DEFAULT_RETRY_COUNT, retryDelay = DEFAULT_RETRY_DELAY, ...fetchInit } = init || {};

  const url = typeof input === 'string' ? input : input.toString();
  const method = fetchInit.method || 'GET';

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(input, fetchInit);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);

        logger.error('API request failed', {
          url,
          method,
          status: response.status,
          statusText: response.statusText,
          attempt: attempt + 1,
          maxRetries: retries + 1,
        });

        throw error;
      }

      return await response.json();
    } catch (error) {
      lastError = error as Error;

      // Log the error in the last attempt
      if (attempt === retries) {
        logger.error('API request failed after all retries', {
          url,
          method,
          error: lastError.message,
          attempts: attempt + 1,
          maxRetries: retries + 1,
        });
      }

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  throw lastError!;
};

export default apiClient;

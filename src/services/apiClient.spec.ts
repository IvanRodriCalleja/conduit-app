import apiClient from './apiClient';
import { logger } from '../utils/logger';

jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('apiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('successful requests', () => {
    it('should fetch and parse JSON successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      } as any);

      const result = await apiClient('/api/test');

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/test', {});
      expect(result).toEqual(mockData);
    });

    it('should pass through fetch options', async () => {
      const mockData = { success: true };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      } as any);

      await apiClient('/api/test', {
        method: 'POST',
        headers: { 'X-Custom': 'header' },
        body: JSON.stringify({ data: 'test' }),
      });

      expect(fetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        headers: { 'X-Custom': 'header' },
        body: JSON.stringify({ data: 'test' }),
      });
    });
  });

  describe('error handling', () => {
    it('should throw error on non-OK response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as any);

      await expect(apiClient('/api/test', { retries: 0 })).rejects.toThrow(
        'HTTP 404: Not Found'
      );
    });

    it('should throw error on network failure', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(apiClient('/api/test', { retries: 0 })).rejects.toThrow(
        'Network error'
      );
    });

    it('should log errors with debugging context', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as any);

      await expect(apiClient('/api/test', { retries: 0 })).rejects.toThrow();

      expect(logger.error).toHaveBeenCalledWith('API request failed', {
        url: '/api/test',
        method: 'GET',
        status: 500,
        statusText: 'Internal Server Error',
        attempt: 1,
        maxRetries: 1,
      });
    });

    it('should log final error after all retries', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(apiClient('/api/test', { retries: 2, retryDelay: 1 })).rejects.toThrow(
        'Network error'
      );

      expect(logger.error).toHaveBeenCalledWith('API request failed after all retries', {
        url: '/api/test',
        method: 'GET',
        error: 'Network error',
        attempts: 3,
        maxRetries: 3,
      });
    });
  });

  describe('retry logic', () => {
    it('should retry on failure and eventually succeed', async () => {
      const mockData = { success: true };
      global.fetch = jest
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(mockData),
        } as any);

      const result = await apiClient('/api/test', { retries: 3, retryDelay: 10 });

      expect(fetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockData);
    });

    it('should respect custom retry count', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(
        apiClient('/api/test', { retries: 2, retryDelay: 10 })
      ).rejects.toThrow('Network error');

      expect(fetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should wait between retries', async () => {
      const delays: number[] = [];
      const startTime = Date.now();

      global.fetch = jest.fn().mockImplementation(() => {
        delays.push(Date.now() - startTime);
        return Promise.reject(new Error('Network error'));
      });

      await expect(
        apiClient('/api/test', { retries: 2, retryDelay: 50 })
      ).rejects.toThrow('Network error');

      expect(fetch).toHaveBeenCalledTimes(3);
      // Verify there was a delay between attempts (not all at once)
      expect(delays[1]).toBeGreaterThanOrEqual(40);
      expect(delays[2]).toBeGreaterThanOrEqual(90);
    });

    it('should use default retry count of 3', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(
        apiClient('/api/test', { retryDelay: 1 })
      ).rejects.toThrow('Network error');

      expect(fetch).toHaveBeenCalledTimes(4); // Initial + 3 retries (default)
    });

    it('should throw last error after all retries exhausted', async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValueOnce(new Error('First error'))
        .mockRejectedValueOnce(new Error('Second error'))
        .mockRejectedValueOnce(new Error('Final error'));

      await expect(
        apiClient('/api/test', { retries: 2, retryDelay: 1 })
      ).rejects.toThrow('Final error');
    });
  });

  describe('JSON parsing', () => {
    it('should automatically parse JSON response', async () => {
      const mockData = { items: [1, 2, 3], total: 3 };
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      } as any);

      const result = await apiClient<typeof mockData>('/api/test');

      expect(result).toEqual(mockData);
      expect(result.items).toHaveLength(3);
    });
  });
});

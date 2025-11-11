import { logger } from './logger';

describe('logger', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  const mockUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Test Browser';

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();

    // Mock navigator for Node environment
    Object.defineProperty(global, 'navigator', {
      value: {
        userAgent: mockUserAgent,
      },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  describe('error', () => {
    it('should log error message without context', () => {
      logger.error('Something went wrong');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const call = consoleErrorSpy.mock.calls[0];
      expect(call[0]).toContain('[ERROR]');
      expect(call[0]).toContain('Something went wrong');
    });

    it('should log error message with context', () => {
      const context = {
        url: '/api/test',
        method: 'GET',
        status: 500,
      };

      logger.error('API request failed', context);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const call = consoleErrorSpy.mock.calls[0];
      expect(call[0]).toContain('[ERROR]');
      expect(call[0]).toContain('API request failed');

      const loggedContext = call[1];
      expect(loggedContext.url).toBe('/api/test');
      expect(loggedContext.method).toBe('GET');
      expect(loggedContext.status).toBe(500);
      expect(loggedContext.userAgent).toBe(mockUserAgent);
    });

    it('should include timestamp in log', () => {
      const beforeTime = new Date().toISOString().slice(0, 16);

      logger.error('Test message');

      const call = consoleErrorSpy.mock.calls[0];
      const logMessage = call[0];

      expect(logMessage).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
      expect(logMessage.slice(0, 50)).toContain(beforeTime.slice(0, 16));
    });

    it('should handle complex context objects', () => {
      const context = {
        user: { id: 123, name: 'Test User' },
        metadata: { tags: ['error', 'api'], count: 5 },
        nested: { deeply: { value: true } },
      };

      logger.error('Complex error', context);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const loggedContext = consoleErrorSpy.mock.calls[0][1];
      expect(loggedContext.user).toEqual(context.user);
      expect(loggedContext.metadata).toEqual(context.metadata);
      expect(loggedContext.nested).toEqual(context.nested);
      expect(loggedContext.userAgent).toBe(mockUserAgent);
    });

    it('should automatically enrich error logs with userAgent', () => {
      const context = { url: '/api/test', status: 500 };

      logger.error('API error', context);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const loggedContext = consoleErrorSpy.mock.calls[0][1];

      expect(loggedContext.url).toBe('/api/test');
      expect(loggedContext.status).toBe(500);
      expect(loggedContext.userAgent).toBe(mockUserAgent);
    });

    it('should include userAgent even without context', () => {
      logger.error('Simple error');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const loggedContext = consoleErrorSpy.mock.calls[0][1];

      expect(loggedContext.userAgent).toBe(mockUserAgent);
    });
  });

  describe('warn', () => {
    it('should log warning message without context', () => {
      logger.warn('Warning message');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const call = consoleWarnSpy.mock.calls[0];
      expect(call[0]).toContain('[WARN]');
      expect(call[0]).toContain('Warning message');
    });

    it('should log warning message with context', () => {
      const context = { retries: 2, delay: 1000 };

      logger.warn('Retrying request', context);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const call = consoleWarnSpy.mock.calls[0];
      expect(call[0]).toContain('[WARN]');
      expect(call[0]).toContain('Retrying request');
      expect(call[1]).toEqual(context);
    });
  });

  describe('info', () => {
    it('should log info message without context', () => {
      logger.info('Info message');

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      const call = consoleInfoSpy.mock.calls[0];
      expect(call[0]).toContain('[INFO]');
      expect(call[0]).toContain('Info message');
    });

    it('should log info message with context', () => {
      const context = { userId: 123, action: 'login' };

      logger.info('User action', context);

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      const call = consoleInfoSpy.mock.calls[0];
      expect(call[0]).toContain('[INFO]');
      expect(call[0]).toContain('User action');
      expect(call[1]).toEqual(context);
    });
  });

  describe('debug', () => {
    it('should log debug message without context', () => {
      logger.debug('Debug message');

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const call = consoleDebugSpy.mock.calls[0];
      expect(call[0]).toContain('[DEBUG]');
      expect(call[0]).toContain('Debug message');
    });

    it('should log debug message with context', () => {
      const context = { variable: 'value', count: 5 };

      logger.debug('Debug data', context);

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const call = consoleDebugSpy.mock.calls[0];
      expect(call[0]).toContain('[DEBUG]');
      expect(call[0]).toContain('Debug data');
      expect(call[1]).toEqual(context);
    });
  });
});

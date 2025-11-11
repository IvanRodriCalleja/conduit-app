interface LogContext {
  [key: string]: any;
}

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level,
      timestamp,
      message,
      ...context,
    };

    const logMessage = `[${logEntry.level}] ${timestamp} - ${message}`;
    const logContext = context || '';

    switch (level) {
      case 'ERROR':
        console.error(logMessage, logContext);
        break;
      case 'WARN':
        console.warn(logMessage, logContext);
        break;
      case 'INFO':
        console.info(logMessage, logContext);
        break;
      case 'DEBUG':
        console.debug(logMessage, logContext);
        break;
    }
  }

  info(message: string, context?: LogContext): void {
    this.log('INFO', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('WARN', message, context);
  }

  error(message: string, context?: LogContext): void {
    const enrichedContext = {
      ...context,
      userAgent: navigator.userAgent,
    };
    this.log('ERROR', message, enrichedContext);
  }

  debug(message: string, context?: LogContext): void {
    this.log('DEBUG', message, context);
  }
}

export const logger = new Logger();

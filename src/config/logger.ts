import { logger } from '@bogeychan/elysia-logger';
import type { LoggerOptions } from 'pino';
import { env } from './env';

export const loggerConfig: LoggerOptions = {
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
};

export const loggerPlugin = logger(loggerConfig);









import { logger } from '@bogeychan/elysia-logger';
import type { LoggerOptions } from 'pino';
import { env } from './env';

const isDev = env.NODE_ENV === 'development';

export const loggerConfig: LoggerOptions = {
  level: isDev ? 'debug' : 'info',
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
};

export const loggerPlugin = logger(loggerConfig);









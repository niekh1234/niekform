import winston, { createLogger } from 'winston';

export const logger = process.env?.LOGGING_ENABLED
  ? createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      defaultMeta: { service: 'user-service' },
      transports: [new winston.transports.File({ filename: 'debug.log', dirname: 'logs' })],
    })
  : console;

if (
  process.env.NODE_ENV !== 'production' &&
  process.env?.LOGGING_ENABLED &&
  logger instanceof winston.Logger
) {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

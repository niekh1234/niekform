import winston, { createLogger } from 'winston';

export const logger = createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: 'user-service' },
  transports: [new winston.transports.File({ filename: 'debug.log', dirname: 'logs' })],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk';
import winston, { format } from 'winston';

interface TransformableInfo {
  level: string;
  message: string;
}

// Function to remove the colors for the message
const removeColors = format(
  (info: TransformableInfo): TransformableInfo => {
    const newInfo = { message: info.message, level: info.level };
    newInfo.message = newInfo.message
      .replace(
        // eslint-disable-next-line no-control-regex
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        '',
      )
      // eslint-disable-next-line no-control-regex
      .replace(new RegExp('\b', 'g'), '');
    return newInfo;
  },
);

// File transport for both error and combined logs
const transports = [
  new winston.transports.File({
    filename: 'log/error.log',
    level: 'error',
    format: removeColors(),
  }),
  new winston.transports.File({
    filename: 'log/combined.log',
    format: format.combine(removeColors(), format.json()),
  }),
];

const defaultLevel = process.env.NODE_ENV === 'development' ? 'verbose' : 'info';

// Winston logger
const logger = winston.createLogger({
  level: defaultLevel,
  format: format.json(),
  transports,
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

const prefix = ''.padStart(10, '\b');

export default {
  info: (message: string, meta?: any): void => {
    logger.info(`${prefix}${message}`, meta);
  },
  error: (message: string, meta?: any): void => {
    logger.error(`${prefix}${chalk.red.bold('[ERROR]')} ${message}`, meta);
  },
  warn: (message: string, meta?: any): void => {
    logger.warn(`${prefix}${chalk.yellow.bold('[WARN]')} ${message}`, meta);
  },
  alert: (message: string, meta?: any): void => {
    logger.error(`${prefix}${chalk.red.bold('[ALERT]')} ${message}`, meta);
  },
  verbose: (message: string, meta?: any): void => {
    logger.verbose(`${prefix}${message}`, meta);
  },
  setLevel: (level: string): void => {
    logger.level = level;
  },
};

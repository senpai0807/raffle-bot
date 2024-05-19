import { createLogger, format, transports } from 'winston';
import ansiColors from 'ansi-colors';

function createColorizedLogger() {
  const consoleFormat = format.combine(
    format.timestamp(),
    format.printf(info => {
      const { timestamp, level, message } = info;
      let colorizedLevel = ansiColors.green(level);
      let colorizedMessage = message;

      switch (level) {
        case 'warn':
          colorizedLevel = ansiColors.bold.yellow(level);
          colorizedMessage = ansiColors.bold.yellow(message);
          break;
        case 'info':
          colorizedMessage = ansiColors.blue(message);
          break;
        case 'error':
          colorizedLevel = ansiColors.bold.red(level);
          colorizedMessage = ansiColors.bold.red(message);
          break;
        case 'verbose':
          colorizedLevel = ansiColors.bold.green(level);
          colorizedMessage = ansiColors.bold.green(message);
          break;
        case 'http':
          colorizedLevel = ansiColors.bold.magenta(level);
          colorizedMessage = ansiColors.bold.magenta(message);
          break;
        default:
          break;
      }
      return `${timestamp} [${colorizedLevel}]: ${colorizedMessage}`;
    })
  );

  const logger = createLogger({
    level: 'silly',
    transports: [
      new transports.Console({
        format: consoleFormat
      })
    ]
  });

  return logger;
}

export default createColorizedLogger;
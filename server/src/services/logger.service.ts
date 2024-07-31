import * as fs from "fs";
import { LogLevel } from "../common/enums/enums";

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: Date;
}

interface LoggerSubscriber {
  update(logMessage: LogMessage): void;
}

// PATTERN: OBSERVER
class LoggerService {
  private subscribers: LoggerSubscriber[] = [];

  subscribe(subscriber: LoggerSubscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: LoggerSubscriber): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  log(level: LogLevel, message: string): void {
    const logMessage: LogMessage = {
      level,
      message,
      timestamp: new Date(),
    };
    this.notify(logMessage);
  }

  private notify(logMessage: LogMessage): void {
    for (const subscriber of this.subscribers) {
      subscriber.update(logMessage);
    }
  }
}

class FileLoggerService implements LoggerSubscriber {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  update(logMessage: LogMessage): void {
    const logEntry = `${logMessage.timestamp.toISOString()} [${logMessage.level.toUpperCase()}]: ${
      logMessage.message
    }\n`;
    fs.appendFileSync(this.filePath, logEntry);
  }
}

class ConsoleLoggerService implements LoggerSubscriber {
  update(logMessage: LogMessage): void {
    if (logMessage.level === LogLevel.ERROR) {
      console.error(
        `${logMessage.timestamp.toISOString()} [${logMessage.level.toUpperCase()}]: ${
          logMessage.message
        }`
      );
    }
  }
}

export { LoggerService, FileLoggerService, ConsoleLoggerService };

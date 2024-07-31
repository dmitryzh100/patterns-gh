import { LogLevel } from "../common/enums/enums";
import { LoggerService } from "./logger.service";

// PATTERN: PROXY
class LoggingProxyHandler<T extends object> {
  constructor(private target: T, private logger: LoggerService) {}

  get(target: T, prop: keyof T) {
    const originalMethod = target[prop];

    if (typeof originalMethod === "function") {
      return (...args: any[]) => {
        this.logger.log(
          LogLevel.INFO,
          `Called method ${String(prop)} with parameters: ${JSON.stringify(
            args
          )}`
        );
        return originalMethod.apply(target, args);
      };
    }

    return originalMethod;
  }
}

export { LoggingProxyHandler };

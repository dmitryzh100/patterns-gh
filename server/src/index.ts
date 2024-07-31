import { createServer } from "http";
import { Server, Socket } from "socket.io";

import { lists } from "./assets/mock-data";
import { Database } from "./data/database";
import { CardHandler, ListHandler } from "./handlers/handlers";
import { ReorderService } from "./services/reorder.service";
import {
  LoggerService,
  ConsoleLoggerService,
  FileLoggerService,
} from "./services/logger.service";
import { LoggingProxyHandler } from "./services/proxy.service";

const PORT = process.env.PORT || 3005;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const loggerService = new LoggerService();
const fileLoggerService = new FileLoggerService("logs.txt");
const consoleLoggerService = new ConsoleLoggerService();

loggerService.subscribe(fileLoggerService);
loggerService.subscribe(consoleLoggerService);

const db = Database.Instance;
const reorderService = new ReorderService();
const reorderServiceProxy = new Proxy(
  reorderService,
  new LoggingProxyHandler(reorderService, loggerService)
);

if (process.env.NODE_ENV !== "production") {
  db.setData(lists);
}

const onConnection = (socket: Socket): void => {
  new ListHandler(io, db, reorderServiceProxy, loggerService).handleConnection(
    socket
  );
  new CardHandler(io, db, reorderServiceProxy, loggerService).handleConnection(
    socket
  );
};

io.on("connection", onConnection);

httpServer.listen({ port: PORT, host: "0.0.0.0" }, () =>
  console.log(`Listening on port: ${PORT}`)
);

export { httpServer };

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config/config"));
const database_1 = require("./database");
const middleware_1 = require("./middleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const RabbitMQService_1 = require("./services/RabbitMQService");
const app = (0, express_1.default)();
let server;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(authRoutes_1.default);
app.use(middleware_1.errorConverter);
app.use(middleware_1.errorHandler);
(0, database_1.connectDB)();
server = app.listen(config_1.default.PORT, () => {
    console.log(`Server is running on PORT ${config_1.default.PORT}`);
});
const initializeRabbitMQClient = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield RabbitMQService_1.rabbitMQService.init();
        console.log("RabbitMQ client initialized and listening for messages.");
    }
    catch (err) {
        console.log("Failed to initialize RabbitMQ client: ", err);
    }
});
initializeRabbitMQClient();
const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("Server closed");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    console.error(error);
    exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

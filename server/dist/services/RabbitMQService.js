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
exports.rabbitMQService = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const config_1 = __importDefault(require("../config/config"));
const database_1 = require("../database");
const utils_1 = require("../utils");
class RabbitMQService {
    constructor() {
        this.requestQueue = "USER_DETAILS_REQUEST";
        this.responseQueue = "USER_DETAILS_RESPONSE";
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Connect to RabbitMQ
            this.connection = yield amqplib_1.default.connect(config_1.default.msgBrokerURL);
            this.channel = yield this.connection.createChannel();
            // Ensure queues exist
            yield this.channel.assertQueue(this.requestQueue);
            yield this.channel.assertQueue(this.responseQueue);
            this.listenForRequests();
        });
    }
    listenForRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            this.channel.consume(this.requestQueue, (msg) => __awaiter(this, void 0, void 0, function* () {
                if (!msg)
                    return;
                try {
                    const { userId } = JSON.parse(msg.content.toString());
                    const userDetails = yield getUserDetails(userId);
                    this.channel.sendToQueue(this.responseQueue, Buffer.from(JSON.stringify(userDetails)), { correlationId: msg.properties.correlationId });
                    this.channel.ack(msg);
                }
                catch (err) {
                    console.error("Error processing request:", err);
                    this.channel.nack(msg);
                }
            }));
        });
    }
}
const getUserDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = yield database_1.User.findById(userId).select("-password");
    if (!userDetails) {
        throw new utils_1.ApiError(404, "User not found");
    }
    return userDetails;
});
exports.rabbitMQService = new RabbitMQService();

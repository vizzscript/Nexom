"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.User = void 0;
const UserModel_1 = __importDefault(require("./models/UserModel"));
exports.User = UserModel_1.default;
const connection_1 = require("./connection");
Object.defineProperty(exports, "connectDB", { enumerable: true, get: function () { return connection_1.connectDB; } });

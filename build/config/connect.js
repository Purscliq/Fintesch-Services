"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromDatabase = exports.connectToDatabase = void 0;
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
if (process.env.NODE_ENV !== 'production')
    (0, dotenv_1.config)();
const { MongoURI } = process.env;
if (!MongoURI) {
    throw new Error('MongoDB URI not found in environment variable!');
}
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// CONNECT TO DATABASE
const connectToDatabase = async () => {
    try {
        await mongoose_1.default.connect(MongoURI, options);
        console.log('Connected to MongoDB!');
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
};
exports.connectToDatabase = connectToDatabase;
// DISCONNECT FROM DATABASE
const disconnectFromDatabase = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB!');
    }
    catch (error) {
        console.error('Failed to disconnect from MongoDB:', error);
    }
};
exports.disconnectFromDatabase = disconnectFromDatabase;

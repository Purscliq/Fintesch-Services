"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const dotenv_1 = require("dotenv");
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const connect_1 = require("./config/connect");
const appRoutes_1 = require("./src/routes/appRoutes");
(0, dotenv_1.config)();
class App {
    constructor() {
        this.start = async () => {
            try {
                await (0, connect_1.connectToDatabase)();
                this.app.listen(this.port, () => console.log(`Server is running on port ${this.port}`));
            }
            catch (error) {
                console.error(error.message);
            }
        };
        this.port = process.env.port || 8000;
        this.app = (0, express_1.default)();
        this.app.use((0, express_1.json)());
        this.app.use((0, express_1.urlencoded)({ extended: true }));
        this.app.use((0, cors_1.default)());
        this.app.use(new appRoutes_1.AppRoutes().mount());
    }
}
exports.App = App;
;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, String(process.env.ACCESS_TOKEN_SECRET), {
        expiresIn: process.env.TOKEN_EXPIRATION,
    });
};
exports.default = { generateAccessToken };
//# sourceMappingURL=token.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
//import xss from 'xss-clean';
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
exports.default = [
    express_1.default.json({ limit: '2mb' }),
    express_1.default.urlencoded({ extended: true, limit: '2mb' }),
    (0, compression_1.default)(),
    (0, cookie_parser_1.default)(),
    (0, cors_1.default)({
        origin: true,
        methods: ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: [
            'x-now-id',
            'x-now-trace',
            'x-powered-by',
            'Origin',
            'Accept',
            'Content-Type',
            'Set-Cookie',
            'Authorization',
        ],
        credentials: true,
    }),
    (0, helmet_1.default)(),
    (0, morgan_1.default)('tiny'),
    //xss(),
];
//# sourceMappingURL=index.js.map
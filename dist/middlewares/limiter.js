"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: 'Too many login request in 1 minute!',
});
exports.default = { loginLimiter };
//# sourceMappingURL=limiter.js.map
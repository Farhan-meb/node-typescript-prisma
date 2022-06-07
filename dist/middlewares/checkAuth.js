"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { promisify } = require('util');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.default = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        return res.status(403).json({
            message: 'You are not logged in!',
        });
    }
    const decoded = await promisify(jsonwebtoken_1.default.verify)(token, String(process.env.ACCESS_TOKEN_SECRET));
    const freshUser = await prisma.user.findFirst({
        where: {
            id: decoded.id,
        },
    });
    if (!freshUser) {
        return res.status(403).json({
            message: 'The user belonging to this token does no longer exist.',
        });
    }
    // if (freshUser.passwordChangedAt) {
    //     const changedTimestamp = parseInt(
    //         this.passwordChangedAt.getTime() / 1000,
    //         10
    //     );
    //     if (decoded.iat < changedTimestamp) {
    //         return next(
    //             new AppError(
    //                 'User recently changed password! Please log in again.',
    //                 401
    //             )
    //         );
    //     }
    // }
    req.user = freshUser;
    res.locals.user = freshUser;
    next();
};
//# sourceMappingURL=checkAuth.js.map
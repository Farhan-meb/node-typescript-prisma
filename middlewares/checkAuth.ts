import { Request, Response, NextFunction } from 'express';
const { promisify } = require('util');
import jwt from 'jsonwebtoken';
import { userType } from '../../types';

import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

export default async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }


    if (!token) {
        return res.status(403).json({
            message: 'You are not logged in!',
        });
    }

    const decoded = await promisify(jwt.verify)(
        token,
        String(process.env.ACCESS_TOKEN_SECRET)
    );

    const freshUser: any = await prisma.user.findFirst({
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

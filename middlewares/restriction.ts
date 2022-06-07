import { Request, Response, NextFunction } from 'express';

const roleRestriction = (...roles: any[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action',
            });
        }

        next();
    };
};

export default { roleRestriction };

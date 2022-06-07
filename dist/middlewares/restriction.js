"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleRestriction = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action',
            });
        }
        next();
    };
};
exports.default = { roleRestriction };
//# sourceMappingURL=restriction.js.map
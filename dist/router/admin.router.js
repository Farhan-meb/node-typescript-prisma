"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin_router = void 0;
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const restriction_1 = __importDefault(require("../middlewares/restriction"));
const limiter_1 = __importDefault(require("../middlewares/limiter"));
const checkAuth_1 = __importDefault(require("../middlewares/checkAuth"));
const admin_router = (0, express_1.Router)();
exports.admin_router = admin_router;
restriction_1.default.roleRestriction('admin');
admin_router.route('/admin').post(checkAuth_1.default, admin_controller_1.default.createAdmin);
admin_router.route('/admins').get(checkAuth_1.default, admin_controller_1.default.getAdmins);
admin_router
    .route('/admin/login')
    .post(limiter_1.default.loginLimiter, admin_controller_1.default.login);
admin_router.route('/admin/logout').post(checkAuth_1.default, admin_controller_1.default.logout);
admin_router.route('/admin/:admin_id').get(admin_controller_1.default.getAdmin);
//# sourceMappingURL=admin.router.js.map
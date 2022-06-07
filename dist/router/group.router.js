"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.group_router = void 0;
const express_1 = require("express");
const group_controller_1 = __importDefault(require("../controllers/group.controller"));
const checkAuth_1 = __importDefault(require("../middlewares/checkAuth"));
const restriction_1 = __importDefault(require("../middlewares/restriction"));
const group_router = (0, express_1.Router)();
exports.group_router = group_router;
restriction_1.default.roleRestriction('admin');
group_router.route('/group').post(checkAuth_1.default, group_controller_1.default.createGroup);
group_router
    .route('/group/:group_id/assign-students')
    .patch(checkAuth_1.default, group_controller_1.default.assignStudents);
group_router
    .route('/group/:group_id/remove-student')
    .patch(checkAuth_1.default, group_controller_1.default.removeStudent);
group_router
    .route('/group/:group_id')
    .get(checkAuth_1.default, group_controller_1.default.getGroup)
    .patch(checkAuth_1.default, group_controller_1.default.updateGroup)
    .delete(checkAuth_1.default, group_controller_1.default.deleteGroup);
group_router.route('/groups').get(checkAuth_1.default, group_controller_1.default.getGroups);
//# sourceMappingURL=group.router.js.map
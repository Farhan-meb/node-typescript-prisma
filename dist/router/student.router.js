"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.student_router = void 0;
const express_1 = require("express");
const student_controller_1 = __importDefault(require("../controllers/student.controller"));
const checkAuth_1 = __importDefault(require("../middlewares/checkAuth"));
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'dist/uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '.jpg'); //Appending .jpg
//     },
// });
// const upload = multer({
//     dest: 'dist/uploads',
//     storage: storage,
//     limits: { fieldSize: 25 * 1024 * 1024 },
// });
const restriction_1 = __importDefault(require("../middlewares/restriction"));
const student_router = (0, express_1.Router)();
exports.student_router = student_router;
restriction_1.default.roleRestriction('admin');
student_router
    .route('/student')
    .post(checkAuth_1.default, student_controller_1.default.createStudent);
student_router
    .route('/student/:student_id')
    .get(checkAuth_1.default, student_controller_1.default.getStudent)
    .patch(checkAuth_1.default, student_controller_1.default.updateStudent)
    .delete(checkAuth_1.default, student_controller_1.default.deleteStudent);
student_router
    .route('/student/:student_id/update-status')
    .patch(checkAuth_1.default, student_controller_1.default.updateStudent);
student_router
    .route('/student/:student_id/assign-groups')
    .patch(checkAuth_1.default, student_controller_1.default.addtoGroup);
student_router
    .route('/student/:student_id/remove-group')
    .patch(checkAuth_1.default, student_controller_1.default.removeFromGroup);
student_router.route('/students').get(checkAuth_1.default, student_controller_1.default.getStudents);
//# sourceMappingURL=student.router.js.map
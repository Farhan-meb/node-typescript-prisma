"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_controller_1 = __importDefault(require("./admin.controller"));
const createSeedDatabase = async () => {
    await admin_controller_1.default.createSeedAdmin();
};
exports.default = { createSeedDatabase };
//# sourceMappingURL=seed.controller.js.map
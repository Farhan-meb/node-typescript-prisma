"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = __importDefault(require("./middlewares"));
const seed_controller_1 = __importDefault(require("./controllers/seed.controller"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = require("./router");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8080;
app.use(...middlewares_1.default);
seed_controller_1.default.createSeedDatabase();
app.use('/api/', [router_1.student_router, router_1.admin_router, router_1.group_router]);
app.listen(port, () => {
    console.log(`[ʂҽɾѵҽɾ 👹]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map
import { Router } from "express";
import adminController from "../controllers/admin.controller";
import restrictionTo from "../middlewares/restriction";

const admin_router = Router();

restrictionTo.roleRestriction("admin");

admin_router.route("/admin/:admin_id").get(adminController.getAdmin);

export { admin_router };

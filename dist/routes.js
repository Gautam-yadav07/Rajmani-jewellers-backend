"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_config_1 = __importDefault(require("./config/server-config"));
const user_routes_1 = __importDefault(require("./users/routes/user-routes"));
const admin_routes_1 = __importDefault(require("./admin/routes/admin-routes"));
const auth_1 = require("./middlewares/auth");
const saving_plan_routes_1 = __importDefault(require("./users/routes/saving-plan-routes"));
server_config_1.default.use("/api/users", user_routes_1.default);
server_config_1.default.use("/api/admin", admin_routes_1.default);
server_config_1.default.use("/api/plan", auth_1.auth, saving_plan_routes_1.default);
exports.default = server_config_1.default;

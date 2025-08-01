"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const PORT = Number(process.env.PORT) || 5000;
routes_1.default.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on  : http://localhost:${PORT}`);
});

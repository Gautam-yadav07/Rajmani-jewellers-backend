"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res) => {
    var _a, _b;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
        return res.status(403).json({ message: "Forbidden, Only Admin is allowed" });
    }
    res.json({ message: `welcome admin ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.id}` });
};
exports.isAdmin = isAdmin;

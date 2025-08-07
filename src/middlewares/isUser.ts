import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../all-types/all-interface";
export const isUser = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role !== "user") {
        return res.status(403).json({ message: "Forbidden, Only User is allowed" });
    }
    next();
};
 









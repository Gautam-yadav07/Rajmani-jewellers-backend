import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../all-types/all-interface";

export const isAdmin = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	if (req.user?.role !== "admin") {
		return res
			.status(403)
			.json({ message: "Forbidden, Only Admin is allowed" });
	}

	next();
};

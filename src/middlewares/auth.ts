import jwt from "jsonwebtoken";
import { JwtPayload, AuthenticatedRequest } from "../all-types/all-interface";
import { Response, NextFunction } from "express";

export const auth = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies?.token;
	if (!token) return res.status(401).json({ message: "unauthorized" });

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload;
		req.user = decoded;
		next();
	} catch {
		res.status(401).json({ message: "Invalid token" });
	}
};

// interface TokenUser {
//   _id: string;
//   userName: string;
//   phoneNumber: number;
// }

import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (
  res: Response,
  userId:string,
  message: string
) => {
  const token = jwt.sign({ userId}, process.env.JWT_SECRET as string, {
    expiresIn: "1d"
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    .json({
        token,
        
        success: true,
        message,
        userId
    });
};

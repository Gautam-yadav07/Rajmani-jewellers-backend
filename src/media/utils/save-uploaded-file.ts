import { IMediaFile } from "../../all-types/all-interface";
import { Media } from "../models/media-model";
import { config } from "dotenv";
config();

export const saveUploadedFile = async (file: Express.Multer.File): Promise<IMediaFile> => {
  if (!file) {
    throw new Error("No file provided");
  }

  const newFile = new Media({
    fieldname: file.fieldname,
    originalname: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype,
    size: file.size,
    destination: file.destination,
    filename: file.filename,
    path: file.path,
    buffer: file.buffer, 
    fileLocation: `${process.env.BACKEND_URL}/uploads/${file.filename}` 
  });

  return await newFile.save();
};
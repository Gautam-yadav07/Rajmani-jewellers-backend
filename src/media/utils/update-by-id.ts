import { Media } from "../models/media-model";
import { IMediaFile } from "../../all-types/all-interface";
import fs from "fs"
import { config } from "dotenv";
config()
export const updateUploadedFileById = async (
  id: string,
  file: Express.Multer.File
): Promise<IMediaFile> => {
  try {
    const existing = await Media.findById(id);
    if (!existing) {
      throw new Error("File record not found");
    }

    // Delete old file from disk
    if (existing.path && fs.existsSync(existing.path)) {
      fs.unlinkSync(existing.path);
    }

    // Update document fields
    existing.fieldname = file.fieldname;
    existing.originalname = file.originalname;
    existing.encoding = file.encoding;
    existing.mimetype = file.mimetype;
    existing.size = file.size;
    existing.destination = file.destination;
    existing.filename = file.filename;
    existing.path = file.path;
    existing.buffer = file.buffer;
    existing.fileLocation = `${process.env.BACKEND_URL}/uploads/${file.filename}`; // If you're serving from `/uploads`

    await existing.save();
    return existing;
  } catch (err) {
    console.error("Update file error:", err);
    throw err;
  }
};
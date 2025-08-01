import fs from "fs";
import { Media } from "../models/media-model";

export const deleteUploadedFileById = async (id: string): Promise<void> => {
  try {
    const fileRecord = await Media.findById(id);

    if (!fileRecord) {
      throw new Error("File record not found");
    }

    // Delete physical file
    if (fileRecord.path && fs.existsSync(fileRecord.path)) {
      fs.unlinkSync(fileRecord.path);
    }

    // Remove record from database
    await Media.findByIdAndDelete(id);
    console.log(`File with ID ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

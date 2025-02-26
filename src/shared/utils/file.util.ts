import { extname } from "path";
import { BusinessException } from "../exceptions/business.exception";
import { HttpStatus } from "@nestjs/common";

export class FileUtil {
  static readonly ALLOWED_IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".gif"];
  static readonly ALLOWED_DOCUMENT_TYPES = [".pdf", ".doc", ".docx"];
  static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  static validateImageFile(file: Express.Multer.File) {
    const ext = extname(file.originalname).toLowerCase();

    if (!this.ALLOWED_IMAGE_TYPES.includes(ext)) {
      throw new BusinessException(
        "Invalid file type",
        "INVALID_FILE_TYPE",
        HttpStatus.BAD_REQUEST,
        { allowedTypes: this.ALLOWED_IMAGE_TYPES }
      );
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new BusinessException(
        "File size too large",
        "FILE_TOO_LARGE",
        HttpStatus.BAD_REQUEST,
        { maxSize: this.MAX_FILE_SIZE }
      );
    }
  }

  static validateDocumentFile(file: Express.Multer.File) {
    const ext = extname(file.originalname).toLowerCase();

    if (!this.ALLOWED_DOCUMENT_TYPES.includes(ext)) {
      throw new BusinessException(
        "Invalid file type",
        "INVALID_FILE_TYPE",
        HttpStatus.BAD_REQUEST,
        { allowedTypes: this.ALLOWED_DOCUMENT_TYPES }
      );
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new BusinessException(
        "File size too large",
        "FILE_TOO_LARGE",
        HttpStatus.BAD_REQUEST,
        { maxSize: this.MAX_FILE_SIZE }
      );
    }
  }

  static generateUniqueFileName(originalName: string): string {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 15);
    const ext = extname(originalName);
    return `${timestamp}-${random}${ext}`;
  }
}

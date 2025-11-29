import multer from "multer";

export const handleUpload = (file?: Express.Multer.File): string | undefined => {
  if (!file) return undefined;
  const mimeType = file.mimetype;
  return `data:${mimeType};base64,${file.buffer.toString("base64")}`;
};

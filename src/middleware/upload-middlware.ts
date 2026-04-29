import multer from 'multer';

import path from 'path';


export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "/tmp"); // ✅ Writable di Vercel/Serverless
    },
    filename: (_req, file, cb) => {
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      cb(null, fileName + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
  fileFilter: (req: any, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya diperbolehkan mengunggah gambar (JPG/PNG/WebP)!") as any, false);
    }
  },
});

// 2. Middleware untuk Document (PDF/Docx)
export const docUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "/tmp"); // ✅ Writable di Vercel/Serverless
    },
    filename: (_req, file, cb) => {
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      cb(null, fileName + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit 10MB
  fileFilter: (req: any, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya diperbolehkan mengunggah dokumen (PDF/Word)!") as any, false);
    }
  },
});
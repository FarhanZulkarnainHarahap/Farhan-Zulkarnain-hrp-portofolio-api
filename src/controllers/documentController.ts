import { Request, Response } from 'express';
import { prisma } from '../configs/prisma';
import cloudinary from '../configs/cloudinary';
import { unlink } from 'fs/promises';

function isPdfFile(file: Express.Multer.File) {
  const name = file.originalname.toLowerCase();
  return file.mimetype === "application/pdf" || name.endsWith(".pdf");
}

async function createDocumentPreview(file: Express.Multer.File) {
  if (!isPdfFile(file)) return null;

  try {
    const preview = await cloudinary.uploader.upload(file.path, {
      folder: "DocumentPreviews",
      resource_type: "image",
    });

    return cloudinary.url(preview.public_id, {
      secure: true,
      resource_type: "image",
      format: "jpg",
      page: 1,
      transformation: [
        {
          width: 900,
          crop: "fit",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    });
  } catch (error) {
    console.warn("Gagal membuat preview dokumen:", error);
    return null;
  }
}

export async function createDocument(req: Request, res: Response): Promise<void> {
  try {
    const { name, category } = req.body;
    const file = req.file;

    console.log("[documents:create] request received", {
      body: { name, category },
      user: req.user ? { id: req.user.id, role: req.user.role, email: req.user.email } : null,
      file: file
        ? {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
          }
        : null,
    });

    // 1. Validasi keberadaan file
    if (!file) {
      console.log("[documents:create] rejected: missing file");
      res.status(400).json({ success: false, error: "File dokumen wajib diunggah" });
      return;
    }

    console.log("[documents:create] creating preview");
    const previewUrl = await createDocumentPreview(file);
    console.log("[documents:create] preview result", { hasPreviewUrl: Boolean(previewUrl) });

    // 2. Upload manual ke Cloudinary
    // Menggunakan resource_type: "raw" karena file berupa PDF/Doc
    console.log("[documents:create] uploading raw document to Cloudinary");
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "Documents",
      resource_type: "raw", 
    });
    console.log("[documents:create] Cloudinary upload complete", {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      bytes: result.bytes,
    });

    // 3. Hapus file fisik dari folder /tmp (server lokal) setelah upload berhasil
    // Sekarang hanya butuh 1 argumen karena menggunakan fs/promises
    await unlink(file.path);
    console.log("[documents:create] temporary file removed", { path: file.path });

    // 4. Simpan ke Database via Prisma
    console.log("[documents:create] saving document to database");
    const data = await prisma.document.create({
      data: {
        name,
        category,
        fileUrl: result.secure_url,
        previewUrl,
        size: file.size
      },
    });

    console.log("[documents:create] document created", { id: data.id });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("[documents:create] failed", error);

    // Pastikan file dihapus dari /tmp meskipun upload ke Cloudinary gagal
    if (req.file) {
      await unlink(req.file.path).catch(() => {}); 
    }

    const errorMessage = error instanceof Error ? error.message : "Gagal mengunggah dokumen";
    res.status(500).json({ success: false, error: errorMessage });
  }
}


export async function getDocumentsALL(_req: Request, res: Response) {
  try {
    const data = await prisma.document.findMany();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: "Gagal mengambil dokumen" });
  }
}
// GET ALL
export async function getAllDocuments(_req: Request, res: Response): Promise<void> {
  try {
    const data = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: "Gagal mengambil data dokumen" });
  }
}

// UPDATE DOCUMENT (Opsional)
export async function updateDocument(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    
    const fileData: {
      fileUrl?: string;
      previewUrl?: string | null;
      size?: number;
    } = {};

    if (req.file) {
      const previewUrl = await createDocumentPreview(req.file);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Documents",
        resource_type: "raw",
      });
      await unlink(req.file.path);
      fileData.fileUrl = result.secure_url;
      fileData.previewUrl = previewUrl;
      fileData.size = req.file.size;
    }

    const data = await prisma.document.update({
      where: { id: id as string },
      data: {
        name,
        category,
        ...fileData
      }
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: "Update gagal" });
  }
}

// DELETE
export async function deleteDocument(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, error: "ID dokumen wajib dikirim" });
      return;
    }
    
    await prisma.document.delete({
      where: { id: id as string }
    });
    
    res.status(200).json({ success: true, message: "Dokumen berhasil dihapus" });
  } catch (error) {
    const errorCode = typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

    if (errorCode === "P2025") {
      res.status(404).json({ success: false, error: "Dokumen tidak ditemukan atau sudah terhapus" });
      return;
    }

    console.error("[documents:delete] failed", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus dokumen";
    res.status(500).json({ success: false, error: errorMessage });
  }
}

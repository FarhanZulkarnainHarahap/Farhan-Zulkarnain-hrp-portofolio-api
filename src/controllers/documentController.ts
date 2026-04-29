import { Request, Response } from 'express';
import { prisma } from '../configs/prisma';
import cloudinary from '../configs/cloudinary';
import fs from 'fs';
import { unlink } from 'fs/promises'; 

export async function createDocument(req: Request, res: Response): Promise<void> {
  try {
    const { name, category } = req.body;
    const file = req.file;

    // 1. Validasi keberadaan file
    if (!file) {
      res.status(400).json({ success: false, error: "File dokumen wajib diunggah" });
      return;
    }

    // 2. Upload manual ke Cloudinary
    // Menggunakan resource_type: "raw" karena file berupa PDF/Doc
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "Documents",
      resource_type: "raw", 
    });

    // 3. Hapus file fisik dari folder /tmp (server lokal) setelah upload berhasil
    // Sekarang hanya butuh 1 argumen karena menggunakan fs/promises
    await unlink(file.path);

    // 4. Simpan ke Database via Prisma
    const data = await prisma.document.create({
      data: {
        name,
        category,
        fileUrl: result.secure_url,
         size: file!.size
      },
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
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
    
    let fileUrl: string | undefined;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Documents",
        resource_type: "raw",
      });
      await unlink(req.file.path);
      fileUrl = result.secure_url;
    }

    const data = await prisma.document.update({
      where: { id: id as string },
      data: {
        name,
        category,
        ...(fileUrl && { fileUrl })
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
    
    await prisma.document.delete({
      where: { id: id as string }
    });
    
    res.status(200).json({ success: true, message: "Dokumen berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Gagal menghapus dokumen" });
  }
}
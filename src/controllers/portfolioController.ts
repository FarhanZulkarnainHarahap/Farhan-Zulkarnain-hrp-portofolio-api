import { Request, Response } from 'express';
import { prisma } from '../configs/prisma';
import cloudinary from '../configs/cloudinary';
import fs, { unlink } from 'fs/promises'; 

const splitListValue = (value?: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/[,|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const optionalText = (value?: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

export async function createPortfolio(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, demoUrl, repoUrl, caseType, caseProblem, caseSolution, caseResult, tags, features } = req.body;
    const file = req.file; // Karena pakai .single('image')

    if (!file) {
      res.status(400).json({ success: false, error: "Image is required" });
      return;
    }
 console.log("API Key:", cloudinary.config().api_key);
    // 1. Upload ke Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "Porto",
    });

    // 2. Hapus file dari folder /tmp (Local)
    await fs.unlink(file.path);

    // 3. Simpan ke Database
    const data = await prisma.portfolio.create({
      data: {
        title,
        description,
        imageUrl: result.secure_url,
        demoUrl: demoUrl || null,
        repoUrl: repoUrl || null,
        caseType: optionalText(caseType),
        caseProblem: optionalText(caseProblem),
        caseSolution: optionalText(caseSolution),
        caseResult: optionalText(caseResult),
        tags: splitListValue(tags),
        features: splitListValue(features),
      } as any,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Gagal membuat portofolio" 
    });
  }
}

export async function getAllPortfolios(_req: Request, res: Response): Promise<void> {
  try {
    // Hapus ': Portfolio[]'
    const data = await prisma.portfolio.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: "Fetch failed" });
  }
}

export async function getPortfolioById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const data = await prisma.portfolio.findUnique({ where: { id: id as string } });
    if (!data) {
      res.status(404).json({ message: "Not Found" });
      return;
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: "Fetch failed" });
  }
}

export async function updatePortfolio(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { title, description, demoUrl, repoUrl, caseType, caseProblem, caseSolution, caseResult, tags, features } = req.body;
    const file = req.file;

    // Gunakan objek literal biasa agar tidak bentrok dengan model lama di cache
    const updateData: any = { // Gunakan any sementara HANYA jika npx prisma generate gagal
      title,
      description,
      demoUrl: demoUrl || null,
      repoUrl: repoUrl || null,
      caseType: optionalText(caseType),
      caseProblem: optionalText(caseProblem),
      caseSolution: optionalText(caseSolution),
      caseResult: optionalText(caseResult),
      tags: splitListValue(tags),
      features: splitListValue(features),
    };

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "Porto",
      });
      await unlink(file.path);
      updateData.imageUrl = result.secure_url;
    }

    // Jika npx prisma generate sudah sukses, baris di bawah tidak akan merah lagi
    const data = await prisma.portfolio.update({
      where: { id: id as string },
      data: updateData
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    if (req.file) await unlink(req.file.path).catch(() => {});
    res.status(500).json({ success: false, error: "Update failed" });
  }
}

export async function deletePortfolio(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.portfolio.delete({ where: { id: id as string } });
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Delete failed" });
  }
}

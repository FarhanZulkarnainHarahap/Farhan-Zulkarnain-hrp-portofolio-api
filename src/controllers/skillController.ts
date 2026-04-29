import { Request, Response } from 'express';
import { prisma } from '../configs/prisma';
import { SkillCategory } from '../../generated/prisma/enums';

// --- CREATE SKILL ---
export async function createSkill(req: Request, res: Response): Promise<void> {
  try {
    const { name, iconName, category } = req.body;

    // Validasi apakah category sesuai dengan Enum
    if (category && !Object.values(SkillCategory).includes(category)) {
       res.status(400).json({ success: false, error: "Kategori tidak valid" });
       return;
    }

    const data = await prisma.skill.create({
      data: { 
        name, 
        iconName, 
        category: category || SkillCategory.FRONTEND // Default jika tidak diisi
      }
    });
    
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Gagal membuat skill" 
    });
  }
}


// GET ALL
export async function getAllSkills(_req: Request, res: Response): Promise<void> {
  try {
    const data = await prisma.skill.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: "Gagal mengambil data skill" });
  }
}

// DELETE
export async function deleteSkill(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    await prisma.skill.delete({
      where: { id: id as string }
    });
    
    res.status(200).json({ success: true, message: "Skill berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Gagal menghapus skill" });
  }
}
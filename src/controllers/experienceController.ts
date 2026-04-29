import { Request, Response } from 'express';
import { prisma } from '../configs/prisma';

export async function getAllExperiences(req: Request, res: Response) {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: experiences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to get experiences' });
  }
}

export async function getExperienceById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    const experience = await prisma.experience.findUnique({
      where: { id },
    });
    if (!experience) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }
    res.json({ success: true, data: experience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to get experience' });
  }
}

export async function createExperience(req: Request, res: Response) {
  try {
    const { title, company, location, startDate, endDate, current, description, technologies, sortOrder } = req.body;
    const experience = await prisma.experience.create({
      data: {
        title,
        company,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current: current || false,
        description,
        technologies: technologies || [],
        sortOrder: sortOrder || 0,
      },
    });
    res.json({ success: true, data: experience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create experience' });
  }
}

export async function updateExperience(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    const { title, company, location, startDate, endDate, current, description, technologies, sortOrder } = req.body;
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        title,
        company,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current,
        description,
        technologies,
        sortOrder,
      },
    });
    res.json({ success: true, data: experience });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update experience' });
  }
}

export async function deleteExperience(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }
    
    await prisma.experience.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete experience' });
  }
}
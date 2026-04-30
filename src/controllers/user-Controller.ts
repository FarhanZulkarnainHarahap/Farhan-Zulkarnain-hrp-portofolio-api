import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../configs/prisma';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
      },
      select: { id: true, email: true, name: true, role: true, avatar: true },
    });

    res.json({ message: "Registrasi berhasil", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
     if (!req.body) {
    return res.status(400).json({ error: "Request body kosong!" });
  }
    const { email, password } = req.body;

    // 1. Validasi input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email dan password wajib diisi" 
      });
    }

    // 2. Cari user berdasarkan email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (!existingUser) {
      return res.status(401).json({ 
        success: false, 
        message: "Email atau password salah" 
      });
    }

    if (!existingUser.password) {
      return res.status(400).json({ 
        success: false, 
        message: "User tidak memiliki password" 
      });
    }

    // 3. Cek validasi password
    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: "Email atau password salah" 
      });
    }

    // 4. Generate JWT token dengan masa berlaku 1 hari
    const accesstoken = jwt.sign(
      {
        id: existingUser.id,
        username: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' } // Token berlaku 24 jam
    );

    // 5. Kirim Cookie ke Browser
    res.cookie("accessToken", accesstoken, {
  httpOnly: true,
  // Jika backend di Vercel, ini WAJIB true karena Vercel menggunakan HTTPS
  secure: true, 
  // WAJIB 'none' agar cookie bisa terkirim dari localhost:3000 ke domain-backend.vercel.app
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
});

    // 6. Response berhasil (Kirim data user tanpa password)
     res.status(200).json({ 
      success: true,
      message: "Login Berhasil",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        avatar: existingUser.avatar
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan pada server" 
    });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('accessToken');
  res.json({ success: true, message: 'Logged out successfully' });
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId || typeof userId !== 'string') {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, avatar: true, isActive: true, lastLogin: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId || typeof userId !== 'string') {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }
    
    const { name, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, avatar },
      select: { id: true, email: true, name: true, role: true, avatar: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, avatar: true, isActive: true, lastLogin: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to get users' });
  }
}
import "dotenv/config";
import { Request, Response } from 'express';
import { prisma } from '../configs/prisma';
import { Resend } from "resend";
import { contactEmailTemplate } from '../templates/contactEmail.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, message } = req.body;

    // 1. Validasi
    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: "Isi semua kolom!" });
      return;
    }

    // 2. Simpan ke Database Prisma
    await prisma.contact.create({
      data: { name, email, message }
    });

    // 3. Kirim via Resend
    // Catatan: Jika belum beli domain, 'from' harus menggunakan 'onboarding@resend.dev'
    const { data, error } = await resend.emails.send({
      from: `${name} <onboarding@resend.dev>`, 
      to: "farhanzulkarnaenhrp@gmail.com", // Email tujuan kamu
      replyTo: email, // <--- Ini kunci agar saat di-reply, langsung ke user
      subject: `🚀 New Inquiry from ${name}`,
      html: contactEmailTemplate(name, email, message),
    });

    if (error) {
      console.error("Resend Error:", error);
      res.status(400).json({ success: false, error });
      return;
    }

    res.status(201).json({ 
      success: true, 
      message: "Pesan terkirim via Resend!", 
      id: data?.id 
    });

  } catch (error) {
    console.error("System Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
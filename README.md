<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:030406,45:2563eb,100:93c5fd&text=Farhan%20Z.%20Portfolio%20API&fontColor=ffffff&fontAlignY=38&fontSize=38&desc=Express%20%2B%20Prisma%20%2B%20PostgreSQL&descAlignY=58&animation=fadeIn" alt="Farhan Z Portfolio API banner" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=800&size=18&duration=2600&pause=900&color=3B82F6&center=true&vCenter=true&width=760&lines=Portfolio+REST+API;Admin+Auth+%2B+Content+Management;Skills+%2B+Projects+%2B+Documents+%2B+Contact;Powered+by+the+Farhan+Z.+blue+palette" alt="Animated typing headline" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Express-5.2.1-030406?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-7.7.0-2563EB?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-3B82F6?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Cloudinary-Uploads-93C5FD?style=for-the-badge&logo=cloudinary&logoColor=030406" alt="Cloudinary" />
</p>

## Overview

`api` adalah backend REST untuk portofolio Farhan Zulkarnain. API ini menangani autentikasi admin, skill management, portfolio projects, document uploads, contact messages, dan health check.

## Color Palette

| Token | Hex | Preview | Usage |
| --- | --- | --- | --- |
| Void Black | `#030406` | ![#030406](https://placehold.co/80x18/030406/030406.png) | API landing page background |
| Card Navy | `#080b13` | ![#080b13](https://placehold.co/80x18/080b13/080b13.png) | System panel surface |
| Signature Blue | `#2563eb` | ![#2563eb](https://placehold.co/80x18/2563eb/2563eb.png) | Brand line and borders |
| Electric Blue | `#3b82f6` | ![#3b82f6](https://placehold.co/80x18/3b82f6/3b82f6.png) | Status accents |
| Soft Sky | `#93c5fd` | ![#93c5fd](https://placehold.co/80x18/93c5fd/93c5fd.png) | Glow highlights |

## Tech Stack

```txt
Express 5       TypeScript      Prisma 7
PostgreSQL      JWT Auth        Cookie Parser
Cloudinary      Multer          Nodemailer / Resend
```

## API Modules

| Route | Description |
| --- | --- |
| `GET /health` | Health check |
| `/api/auth` | Login, logout, auth session |
| `/api/users` | User/admin data |
| `/api/skills` | Skill CRUD |
| `/api/experiences` | Experience CRUD |
| `/api/portofolios` | Portfolio/project CRUD |
| `/api/documents` | Document upload and listing |
| `/api/contact` | Contact messages |

## Getting Started

```bash
npm install
npm run dev
```

Default development URL:

```txt
http://localhost:8000
```

## Environment

Create `.env` in `api/`:

```env
PORT=8000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
JWT_SECRET="your-secret"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

RESEND_API_KEY="your-resend-key"
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start API with `tsx --watch` |
| `npm run build` | Generate Prisma client and compile TypeScript |
| `npm run start` | Build then run `dist/app.js` |
| `npm run postinstall` | Generate Prisma client after install |

## Data Models

- `User`
- `Skill`
- `Experience`
- `Portfolio`
- `Document`
- `Contact`

## Upload Flow

1. Admin uploads project image or document.
2. Multer receives the file.
3. Cloudinary stores the asset.
4. Prisma saves the secure URL and metadata.
5. Frontend consumes the public endpoint.

## API Landing Page

The root route `/` renders an animated system panel showing that the service is online, using the same black-and-blue identity as the frontend.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&height=2&color=0:030406,40:2563eb,100:93c5fd" alt="Blue divider" />
</p>

# CREVID - YouTube Content Generator

Mockup aplikasi web untuk generate konten YouTube menggunakan AI (OpenAI GPT-5 nano).

## Fitur Utama

- **Dashboard**: Overview statistik dan aktivitas terbaru
- **Generate Content**: Buat judul, deskripsi, dan naskah video
- **Generate Media**: Generate prompt untuk gambar/video setiap scene
- **Generate Script**: Generate naskah video yang engaging dan terstruktur
- **Content Management**: Kelola semua konten yang telah dibuat
- **Settings**: Konfigurasi API dan preferensi pengguna

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + TypeScript + Drizzle ORM (planned)
- **Database**: Turso (SQLite edge) (planned)
- **Deployment**: Render (free tier) (planned)

## Instalasi

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Struktur Project

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   └── Layout.tsx    # Main layout component
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── GenerateContent.tsx
│   ├── GenerateMedia.tsx
│   ├── GenerateTTS.tsx    # Generate Script page
│   ├── ContentManagement.tsx
│   └── Settings.tsx
├── lib/
│   └── utils.ts      # Utility functions
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Fitur yang Diimplementasi (Mockup)

### 1. Dashboard
- Statistik overview
- Quick actions untuk generate content
- Aktivitas terbaru
- Cards untuk navigasi cepat

### 2. Generate Content
- **Ultra Minimalist Design**: Hanya 1 textarea per mode
- **2 Mode Input**:
  - **Input Topik**: Textarea untuk topik yang ingin dibahas
  - **Input Referensi**: Textarea untuk artikel/berita (tanpa URL)
- **Clean Presets Modal**: 
  - RUANG TUMBUH presets button untuk quick setup
  - 1 textarea besar untuk konfigurasi presets
  - Parameter guidelines dengan contoh (kotak biru)
  - Tombol Simpan untuk apply settings
- **Presets Configuration Format**: 
  - Text-based configuration yang mudah diedit
  - Semua parameter dalam satu tempat
  - Guidelines dan contoh untuk setiap parameter
- **S.O.C.I.A.L Formula Integration**: Story, Observation, Connection, Insight, Agenda, Lo-faen/Impact
- **Quality Guidelines**: Validation rules untuk memastikan kualitas content sesuai standar RUANG TUMBUH
- Generate judul dan deskripsi video
- Breakdown naskah per scene
- Media prompt untuk setiap scene

### 3. Generate Media
- **Content List View**: Tampilkan konten yang belum ada medianya
- **Scene Selection**: Klik konten → masuk ke scene selection
- **Media Presets System**: 
  - Textarea configuration seperti Generate Content
  - Default media presets dengan parameter lengkap
  - 12+ parameter media (type, style, resolution, quality, dll)
- **Media Generation**: Pilih scene untuk generate gambar/video
- **Back Navigation**: Tombol back untuk kembali ke content list

### 4. Generate TTS
- **Content List View**: Tampilkan konten yang sudah ada naskah tapi belum ada audio
- **Scene Selection**: Klik konten → masuk ke scene selection untuk TTS
- **TTS Presets System**: 
  - Textarea configuration untuk voice settings
  - Default TTS presets dengan 12+ parameter audio
  - Voice model, speed, format, quality, tone, emotion, dll
- **Audio Generation**: Convert naskah ke audio dengan preview player
- **Bulk Actions**: Download all, merge audio

### 5. Content Management
- List semua konten yang dibuat
- Filter dan search functionality
- Status tracking (completed, draft, processing)
- Bulk actions (export, delete, archive)

### 6. Settings
- API configuration (OpenAI)
- User profile management
- App preferences (theme, notifications)
- Save settings functionality

## UI/UX Features

- **Mobile First Design**: Responsive untuk semua device
- **Modern UI**: Menggunakan shadcn/ui components
- **Intuitive Navigation**: Sidebar dengan clear menu structure
- **Loading States**: Proper loading indicators
- **Status Indicators**: Visual feedback untuk berbagai status
- **Bulk Actions**: Efficient content management

## Next Steps (Implementation)

1. Setup backend dengan Node.js + Express
2. Integrate dengan OpenAI API
3. Setup database dengan Turso
4. Implement authentication
5. Deploy ke Render
6. Add real-time features
7. Implement file upload/download
8. Add analytics dan reporting

## Notes

Ini adalah mockup UI/UX untuk demonstrasi. Semua functionality saat ini adalah simulasi dan belum terintegrasi dengan backend atau API eksternal.
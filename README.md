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
- **File Storage**: GoFile API untuk menyimpan media dan audio files
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
│   │   ├── dialog.tsx    # Custom Dialog component
│   │   ├── label.tsx     # Custom Label component  
│   │   ├── textarea.tsx  # Textarea component
│   │   └── ...           # Other shadcn/ui components
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
- **Modern Presets Modal**: 
  - Dialog component dengan shadcn/ui styling
  - Direct editing dalam textarea yang bisa diedit langsung
  - Load default presets button untuk quick setup
  - Parameter guidelines dengan contoh (card biru)
  - Simpan langsung tanpa modal terpisah
- **Presets Configuration Format**: 
  - Text-based configuration yang mudah diedit dalam textarea
  - Semua parameter dalam satu tempat yang bisa diedit real-time
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
  - Modern Dialog modal dengan tab navigation (Gambar/Video)
  - Direct editing dalam textarea untuk setiap jenis media
  - Default media presets dengan parameter lengkap
  - 12+ parameter media (type, style, resolution, quality, dll)
- **Media Generation**: Pilih scene untuk generate gambar/video
- **GoFile Integration**: Otomatis membuat folder dan upload media ke GoFile
- **File Links Display**: Tampilkan link GoFile untuk setiap file yang di-generate
- **Back Navigation**: Tombol back untuk kembali ke content list

### 4. Generate TTS
- **Content List View**: Tampilkan konten yang sudah ada naskah tapi belum ada audio
- **Scene Selection**: Klik konten → masuk ke scene selection untuk TTS
- **TTS Presets System**: 
  - Modern Dialog modal dengan form controls (slider, dropdown, checkbox)
  - Interactive controls untuk voice settings: stability, similarity boost, style, speed
  - Voice selection dropdown dengan 4 pilihan voice model
  - Language code input dan timestamps checkbox
  - Default TTS presets dengan parameter audio yang essential
- **Audio Generation**: Convert naskah ke audio dan upload ke GoFile
- **GoFile Integration**: Otomatis membuat folder dan upload audio files
- **Audio Links Display**: Tampilkan link GoFile untuk file audio yang di-generate

### 5. Content Management
- **Content List View**: List semua konten dengan status tracking (completed, draft, processing)
- **Filter & Search**: Pencarian konten dan filter berdasarkan status
- **Statistics Cards**: Overview total content, completion rate, media & audio status
- **GoFile Links Display**: Tampilkan link folder GoFile untuk setiap konten yang memiliki files
- **Modal View System**: 
  - **View Modal**: Lihat dan edit konten secara langsung dalam satu modal
  - **Editable Fields**: Judul, deskripsi, dan naskah lengkap dalam textarea yang bisa diedit
  - **GoFile Section**: Tampilkan link folder GoFile dengan akses langsung ke files
  - **Scene Breakdown**: Tampilan khusus untuk generate media (jika ada media)
  - **Direct Save**: Simpan semua perubahan langsung tanpa modal terpisah
- **More Actions Modal**: Duplikasi, arsip, bagikan link, dan hapus konten
- **Mobile-First Interface**: Responsive design dengan tombol yang menyesuaikan layar

### 6. Settings
- **API Configuration**: OpenAI API key, model selection, max tokens, temperature
- **GoFile API Configuration**: GoFile token, root folder setup, file structure preview
- **User Profile Management**: Name, email, bio information
- **App Preferences**: Notifications, auto-save, theme, language, content generation settings
- **File Management Settings**: Auto upload to GoFile, file retention policies
- **Balanced 3-Column Layout**: Organized configuration sections
- **Save All Settings**: Centralized save functionality

## UI/UX Features

- **Mobile First Design**: Responsive untuk semua device
- **Modern UI**: Menggunakan shadcn/ui components dengan custom Dialog, Label, dan Textarea
- **Intuitive Navigation**: Sidebar dengan clear menu structure
- **Loading States**: Proper loading indicators
- **Status Indicators**: Visual feedback untuk berbagai status
- **Modal System**: Unified Dialog component system untuk semua modal (View, Presets, Actions)
- **Direct Editing**: Edit konten dan presets langsung dalam modal tanpa perpindahan halaman
- **Consistent UX**: Semua modal menggunakan shadcn/ui Dialog dengan styling yang konsisten

## Next Steps (Implementation)

1. Setup backend dengan Node.js + Express
2. Integrate dengan OpenAI API untuk content generation
3. Integrate dengan GoFile API untuk file storage
4. Setup database dengan Turso (hanya menyimpan metadata & links)
5. Implement authentication
6. Deploy ke Render
7. Add real-time features
8. Implement automatic file organization (1 konten = 1 folder)
9. Add analytics dan reporting

## Notes

Ini adalah mockup UI/UX untuk demonstrasi. Semua functionality saat ini adalah simulasi dan belum terintegrasi dengan backend atau API eksternal.
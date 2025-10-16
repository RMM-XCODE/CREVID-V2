# CREVID Backend API

Backend API untuk aplikasi CREVID (Content Creator Video) yang menyediakan layanan generasi konten, media, dan text-to-speech menggunakan AI.

## 🚀 Fitur Utama

- **Generasi Konten AI**: Membuat script video menggunakan OpenAI GPT
- **Generasi Media**: Membuat gambar dan video untuk setiap scene
- **Text-to-Speech**: Konversi script menjadi audio dengan berbagai pilihan suara
- **Job Queue**: Sistem antrian untuk pemrosesan background menggunakan QStash
- **File Management**: Upload dan manajemen file menggunakan GoFile
- **Rate Limiting**: Pembatasan request untuk mencegah abuse
- **Logging**: Sistem logging komprehensif dengan Winston

## 🛠️ Teknologi

- **Runtime**: Node.js dengan TypeScript
- **Framework**: Express.js
- **Database**: SQLite dengan Drizzle ORM
- **Queue**: Upstash QStash
- **AI Services**: OpenAI API
- **File Storage**: GoFile API
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## 📦 Instalasi

1. **Clone repository dan masuk ke folder backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Turso Database**
   
   Buat database Turso baru:
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Login ke Turso
   turso auth login
   
   # Buat database baru
   turso db create crevid-db
   
   # Dapatkan database URL dan token
   turso db show crevid-db
   turso db tokens create crevid-db
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit file `.env` dengan konfigurasi:
   ```env
   # Database (Turso)
   DATABASE_URL="libsql://your-database-name.turso.io"
   DATABASE_AUTH_TOKEN="your-turso-auth-token"
   
   # Security (REQUIRED)
   JWT_SECRET="your_secure_jwt_secret"
   ENCRYPTION_KEY="your_32_character_encryption_key"
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL="http://localhost:5173"
   ```
   
   **📝 Catatan Penting**: API keys (OpenAI, GoFile, QStash) **tidak perlu** diisi di `.env`. 
   Anda dapat mengkonfigurasinya nanti melalui **Settings UI** di aplikasi web yang lebih aman dan mudah.

4. **Generate dan migrate database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Initialize database dengan data default**
   ```bash
   npm run db:init
   ```

6. **Konfigurasi API Keys via Settings UI** (Setelah frontend running)
   - Buka `http://localhost:5173/settings`
   - Isi OpenAI API Key untuk content generation
   - Isi GoFile API Token untuk file storage  
   - Isi QStash credentials untuk background jobs
   - Klik Save - semua data akan terenkripsi otomatis

## 🚀 Menjalankan Aplikasi

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Database Management
```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (Database GUI)
npm run db:studio

# Initialize database with default settings
npm run db:init
```

## 📚 API Endpoints

### Content Management
- `POST /api/content/generate` - Generate konten dengan AI
- `GET /api/content` - Ambil semua konten
- `GET /api/content/:id` - Ambil konten spesifik
- `POST /api/content` - Simpan konten baru
- `PUT /api/content/:id` - Update konten
- `DELETE /api/content/:id` - Hapus konten

### Media Generation
- `POST /api/media/generate` - Generate media untuk scene tertentu
- `POST /api/media/generate-batch` - Generate media untuk semua scene

### Text-to-Speech
- `POST /api/tts/generate` - Generate audio dari script
- `POST /api/tts/generate-batch` - Generate audio batch

### Job Management
- `GET /api/jobs` - Ambil semua jobs
- `GET /api/jobs/:job_id` - Ambil job spesifik
- `GET /api/jobs/content/:content_id` - Ambil jobs untuk konten tertentu
- `POST /api/jobs/:job_id/cancel` - Cancel job
- `POST /api/jobs/:job_id/retry` - Retry job yang gagal

### Settings
- `GET /api/settings` - Ambil pengaturan aplikasi
- `PUT /api/settings` - Update pengaturan
- `POST /api/settings/reset` - Reset ke pengaturan default
- `GET /api/settings/status` - Status sistem

### Workers (QStash Callbacks)
- `POST /api/workers/content-generation` - Worker untuk generasi konten
- `POST /api/workers/media-generation` - Worker untuk generasi media
- `POST /api/workers/tts-generation` - Worker untuk TTS
- `POST /api/workers/batch-operation` - Worker untuk operasi batch

## 🔧 Konfigurasi

CREVID mendukung **dua cara konfigurasi** untuk fleksibilitas maksimal:

### 1. **Settings UI** (Recommended) ⭐
- Konfigurasi API keys melalui web interface
- Data terenkripsi dan tersimpan aman di database  
- Dapat diubah kapan saja tanpa restart server
- Akses melalui: `http://localhost:5173/settings`

### 2. **Environment Variables** (Optional)
Untuk konfigurasi sistem dasar dan deployment:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Turso database URL | ✅ |
| `DATABASE_AUTH_TOKEN` | Turso auth token | ✅ |
| `JWT_SECRET` | Secret untuk JWT | ✅ |
| `ENCRYPTION_KEY` | Key untuk enkripsi (32 karakter) | ✅ |
| `PORT` | Port server (default: 3001) | ❌ |
| `NODE_ENV` | Environment mode | ❌ |
| `FRONTEND_URL` | URL frontend untuk CORS | ❌ |

**API Keys** (Opsional di .env, bisa diatur via Settings UI):
| Variable | Description | Via Settings UI |
|----------|-------------|-----------------|
| `OPENAI_API_KEY` | API key untuk OpenAI | ✅ Recommended |
| `GOFILE_API_TOKEN` | Token untuk GoFile API | ✅ Recommended |
| `QSTASH_TOKEN` | Token untuk QStash | ✅ Recommended |
| `QSTASH_CURRENT_SIGNING_KEY` | Current signing key QStash | ✅ Recommended |
| `QSTASH_NEXT_SIGNING_KEY` | Next signing key QStash | ✅ Recommended |

### Rate Limiting

Default rate limiting:
- 100 requests per hour per IP
- Dapat dikonfigurasi melalui settings API

### Job Queue

Menggunakan QStash untuk background processing:
- Content generation: ~30-60 detik
- Media generation: ~2-5 menit per scene
- TTS generation: ~1-3 menit
- Batch operations: Tergantung jumlah operasi

## 🗄️ Database Schema

### Tables
- `contents` - Menyimpan konten yang dihasilkan
- `jobs` - Tracking job queue dan status
- `files` - Metadata file yang diupload
- `gofile_folders` - Informasi folder GoFile
- `app_settings` - Pengaturan aplikasi

### Relationships
- Content → Jobs (one-to-many)
- Content → Files (one-to-many)
- Content → GoFile Folders (one-to-many)
- Jobs → Files (one-to-many)

## 🔒 Security

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Mencegah abuse
- **Input Validation**: Validasi semua input
- **Error Handling**: Error handling yang aman
- **Encryption**: Sensitive data dienkripsi
- **QStash Signature**: Verifikasi webhook signature

## 📝 Logging

Menggunakan Winston dengan level:
- `error`: Error yang perlu perhatian
- `warn`: Warning yang perlu dimonitor
- `info`: Informasi umum
- `debug`: Debug information (development only)

Log disimpan di:
- Console (development)
- File `logs/app.log` (production)

## 🧪 Testing

```bash
# Run tests (belum diimplementasi)
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Configure semua environment variables
3. Setup database dengan `npm run db:init`
4. Setup reverse proxy (nginx/apache)
5. Setup SSL certificate
6. Configure monitoring dan logging
7. Setup backup database

### Docker (Opsional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🆘 Support

Jika mengalami masalah:
1. Cek logs di `logs/app.log`
2. Pastikan semua environment variables sudah diset
3. Cek status sistem di `/api/settings/status`
4. Buat issue di GitHub repository

## 🔄 Changelog

### v2.0.0
- Implementasi TypeScript
- Sistem job queue dengan QStash
- Integrasi GoFile untuk file storage
- Rate limiting dan security improvements
- Comprehensive logging system
- Database schema improvements
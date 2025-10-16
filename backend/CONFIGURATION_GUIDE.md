# 🔧 Panduan Konfigurasi CREVID Backend

## 📋 Dua Cara Konfigurasi

CREVID Backend mendukung dua cara konfigurasi untuk fleksibilitas maksimal:

### 1. **Konfigurasi via Settings UI** (Recommended) ⭐
- API keys disimpan terenkripsi di database
- Dapat diubah kapan saja melalui web interface
- Lebih aman dan user-friendly
- Mendukung hot-reload tanpa restart server

### 2. **Konfigurasi via Environment Variables** (Optional)
- Untuk deployment otomatis atau CI/CD
- Sebagai fallback jika database belum dikonfigurasi
- Untuk development setup yang cepat

## 🎯 Prioritas Konfigurasi

```
Database Settings (via UI) > Environment Variables > Default Values
```

Jika API key ada di database, maka akan digunakan. Jika tidak, akan fallback ke environment variables.

## 🔐 Konfigurasi via Settings UI

### Langkah-langkah:

1. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```

2. **Buka Settings page** di frontend
   ```
   http://localhost:5173/settings
   ```

3. **Isi konfigurasi yang diperlukan:**
   - **OpenAI API Key**: Untuk content generation
   - **GoFile API Token**: Untuk file storage
   - **QStash Token**: Untuk background jobs
   - **QStash Signing Keys**: Untuk webhook security

4. **Simpan konfigurasi**
   - Data akan terenkripsi dan disimpan di database
   - Langsung aktif tanpa restart server

### Keuntungan Settings UI:
- ✅ **Aman**: Data terenkripsi di database
- ✅ **Mudah**: Interface yang user-friendly
- ✅ **Fleksibel**: Bisa diubah kapan saja
- ✅ **Hot-reload**: Tidak perlu restart server
- ✅ **Backup**: Tersimpan dalam database backup

## 🌍 Konfigurasi via Environment Variables

### File `.env` (Minimal Setup):

```env
# === REQUIRED CONFIGURATION ===

# Database (Turso)
DATABASE_URL=libsql://your-database-name.turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token

# Security (WAJIB untuk production)
JWT_SECRET=your-secure-jwt-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key

# Server
PORT=3001
NODE_ENV=development

# === OPTIONAL CONFIGURATION ===
# (Bisa diatur via Settings UI)

# OpenAI (Optional)
# OPENAI_API_KEY=sk-proj-your-key

# GoFile (Optional)  
# GOFILE_API_TOKEN=your-token

# QStash (Optional)
# QSTASH_TOKEN=your-token
# QSTASH_CURRENT_SIGNING_KEY=your-key
# QSTASH_NEXT_SIGNING_KEY=your-key
```

### Konfigurasi Minimal untuk Development:

```env
DATABASE_URL=file:./crevid.db
JWT_SECRET=dev-secret-key
ENCRYPTION_KEY=dev-32-character-encryption-key
PORT=3001
NODE_ENV=development
```

## 🚀 Setup untuk Production

### 1. **Environment Variables** (Required):
```env
# Database
DATABASE_URL=your-production-database-url

# Security (CRITICAL!)
JWT_SECRET=your-super-secure-jwt-secret
ENCRYPTION_KEY=your-super-secure-32-char-key

# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

### 2. **API Keys via Settings UI**:
- Login ke admin panel
- Masuk ke Settings
- Konfigurasi semua API keys
- Test koneksi untuk memastikan working

## 🔒 Keamanan

### Environment Variables:
- ✅ **JWT_SECRET**: Wajib unik dan aman
- ✅ **ENCRYPTION_KEY**: Harus 32 karakter, aman
- ✅ **DATABASE_URL**: Jangan expose credentials

### Database Settings:
- ✅ **Auto-encrypted**: Semua API keys terenkripsi
- ✅ **Access control**: Hanya admin yang bisa akses
- ✅ **Audit trail**: Semua perubahan tercatat

## 📊 Monitoring Konfigurasi

### Health Check Endpoint:
```bash
GET /api/settings/status
```

Response:
```json
{
  "success": true,
  "data": {
    "database": "connected",
    "openai": "configured",
    "gofile": "configured", 
    "qstash": "configured",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Status Indicators:
- `configured`: API key tersedia dan valid
- `not_configured`: API key belum diset
- `error`: Ada masalah dengan konfigurasi

## 🛠️ Troubleshooting

### Problem: "OpenAI API not configured"
**Solution:**
1. Cek Settings UI → OpenAI section
2. Pastikan API key valid dan aktif
3. Test dengan endpoint health check

### Problem: "Database connection failed"
**Solution:**
1. Cek DATABASE_URL di .env
2. Pastikan database file accessible
3. Run `npm run db:migrate`

### Problem: "Encryption key invalid"
**Solution:**
1. Pastikan ENCRYPTION_KEY tepat 32 karakter
2. Jangan ubah key setelah ada data terenkripsi
3. Backup database sebelum ganti key

## 📝 Best Practices

### Development:
1. **Gunakan mock values** di .env untuk development
2. **Konfigurasi real API keys** via Settings UI saat testing
3. **Jangan commit** real API keys ke git

### Production:
1. **Set environment variables** untuk sistem config
2. **Gunakan Settings UI** untuk API keys
3. **Regular backup** database settings
4. **Monitor health check** endpoint

### Security:
1. **Rotate API keys** secara berkala
2. **Use strong encryption key** (32 karakter random)
3. **Secure database access**
4. **Enable audit logging**

## 🎯 Kesimpulan

**Recommended Flow:**
1. Setup minimal `.env` dengan sistem config
2. Jalankan aplikasi
3. Konfigurasi API keys via Settings UI
4. Monitor via health check endpoint

Dengan pendekatan ini, Anda mendapatkan fleksibilitas maksimal dan keamanan optimal! 🚀
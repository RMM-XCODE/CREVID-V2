# 🗄️ Panduan Setup Turso Database

## 📋 **Langkah-langkah Setup Turso:**

### 1. **Install Turso CLI**
```bash
# Windows (PowerShell)
iwr -useb https://get.tur.so/install.ps1 | iex

# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash
```

### 2. **Login ke Turso**
```bash
turso auth login
```

### 3. **Buat Database Baru**
```bash
# Buat database dengan nama crevidv2
turso db create crevidv2

# Atau jika sudah ada, list database yang ada
turso db list
```

### 4. **Dapatkan Database URL**
```bash
turso db show crevidv2
```
Output akan menampilkan URL seperti:
```
URL: libsql://crevidv2-[username].turso.io
```

### 5. **Generate Auth Token**
```bash
turso db tokens create crevidv2
```
Output akan menampilkan token seperti:
```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### 6. **Update File .env**
Masukkan URL dan token ke file `.env`:
```env
# Database Configuration (Turso)
DATABASE_URL=libsql://crevidv2-[username].turso.io
DATABASE_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

## 🔧 **Konfigurasi yang Benar:**

Berdasarkan URL yang Anda berikan, konfigurasi yang benar adalah:

```env
# Database Configuration (Turso)
DATABASE_URL=libsql://crevidv2-rungatumbuh.aws-ap-northeast-1.turso.io
DATABASE_AUTH_TOKEN=[AUTH_TOKEN_DARI_TURSO_CLI]
```

## 🧪 **Test Koneksi Database:**

Setelah konfigurasi benar, jalankan:

```bash
# 1. Migrate schema ke Turso
npm run db:migrate

# 2. Initialize database dengan data default
npm run db:init

# 3. Test koneksi
node test-integration.js
```

## 🚨 **Troubleshooting:**

### Error: "SERVER_ERROR: Server returned HTTP status 404"
- **Penyebab**: Database URL salah atau database tidak ada
- **Solusi**: Cek `turso db list` dan pastikan database ada

### Error: "UNAUTHORIZED"
- **Penyebab**: Auth token salah atau expired
- **Solusi**: Generate token baru dengan `turso db tokens create crevidv2`

### Error: "Connection timeout"
- **Penyebab**: Network issue atau region salah
- **Solusi**: Cek koneksi internet dan region database

## 📝 **Catatan Penting:**

1. **Auth Token**: Token bersifat sensitif, jangan commit ke git
2. **Region**: Database Anda di region `aws-ap-northeast-1` (Tokyo)
3. **Backup**: Turso otomatis backup, tapi bisa manual backup juga
4. **Limits**: Free tier Turso ada limit, monitor usage

## 🎯 **Next Steps:**

Setelah setup Turso berhasil:
1. ✅ Database connection working
2. ✅ Schema migrated
3. ✅ Default settings initialized
4. ✅ API endpoints tested
5. 🚀 Ready for production!
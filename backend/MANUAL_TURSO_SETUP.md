# 🗄️ Manual Turso Setup Guide

## 📋 **Cara Manual Setup Turso Database:**

### 1. **Install Turso CLI**

#### Windows:
```powershell
# Download dari GitHub releases
# https://github.com/tursodatabase/turso-cli/releases

# Atau gunakan Scoop
scoop install turso

# Atau gunakan Chocolatey  
choco install turso
```

#### Alternative - Download Binary:
1. Buka: https://github.com/tursodatabase/turso-cli/releases
2. Download `turso-windows-amd64.exe`
3. Rename ke `turso.exe`
4. Pindahkan ke folder yang ada di PATH

### 2. **Login ke Turso**
```bash
turso auth login
```

### 3. **Setup Database**
```bash
# List database yang ada
turso db list

# Jika crevidv2 belum ada, buat baru
turso db create crevidv2

# Dapatkan info database
turso db show crevidv2

# Generate auth token
turso db tokens create crevidv2
```

### 4. **Update .env File**

Berdasarkan URL yang Anda berikan, update file `.env`:

```env
# Database Configuration (Turso)
DATABASE_URL=libsql://crevidv2-rungatumbuh.aws-ap-northeast-1.turso.io
DATABASE_AUTH_TOKEN=[PASTE_TOKEN_DARI_TURSO_CLI_DISINI]
```

## 🔧 **Alternatif: Gunakan Turso Web Dashboard**

Jika CLI sulit diinstall, gunakan web dashboard:

1. **Buka**: https://app.turso.tech/
2. **Login** dengan akun Anda
3. **Pilih database** `crevidv2-rungatumbuh`
4. **Klik "Generate Token"** di settings
5. **Copy token** dan paste ke `.env`

## 🧪 **Test Setup**

Setelah konfigurasi benar:

```bash
# 1. Test koneksi
npm run db:migrate

# 2. Initialize data
npm run db:init

# 3. Test API
node test-integration.js
```

## 📝 **Contoh Konfigurasi yang Benar:**

```env
# Database Configuration (Turso)
DATABASE_URL=libsql://crevidv2-rungatumbuh.aws-ap-northeast-1.turso.io
DATABASE_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTc0NjI0MDAsImlkIjoiYWJjZGVmZ2gtaWprbC1tbm9wLXFyc3QtdXZ3eHl6MTIzNCJ9.abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz

# Security
JWT_SECRET=your-secure-jwt-secret-key-here
ENCRYPTION_KEY=your-32-character-encryption-key

# Server
PORT=3001
NODE_ENV=development
```

## 🚨 **Troubleshooting:**

### Jika masih error "404" atau "UNAUTHORIZED":
1. Pastikan database `crevidv2-rungatumbuh` ada di dashboard Turso
2. Generate token baru dari web dashboard
3. Pastikan tidak ada spasi di awal/akhir token
4. Cek region database (harus sama dengan URL)

### Jika tidak bisa install CLI:
1. Gunakan web dashboard Turso untuk generate token
2. Manual copy-paste ke `.env`
3. Test dengan `npm run db:migrate`

## 🎯 **Ready to Test:**

Setelah setup selesai, jalankan:
```bash
npm run db:migrate && npm run db:init && node test-integration.js
```

Jika semua berhasil, Anda akan melihat:
```
🎉 ALL INTEGRATIONS SUCCESSFUL!
🚀 Backend is fully integrated and ready for production!
```
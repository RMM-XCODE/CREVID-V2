# 🔑 Cara Mendapatkan Turso Auth Token

## 🎯 **PENTING: Anda perlu auth token asli dari Turso!**

Saat ini di `.env` masih ada placeholder:
```env
DATABASE_AUTH_TOKEN=your-turso-auth-token-here
```

## 📋 **Cara Mendapatkan Token:**

### **Opsi 1: Turso Web Dashboard (Termudah)**
1. Buka: https://app.turso.tech/
2. Login dengan akun Anda
3. Pilih database: `crevidv2-rungatumbuh`
4. Klik tab **"Settings"** atau **"Tokens"**
5. Klik **"Generate Token"** atau **"Create Token"**
6. Copy token yang dihasilkan
7. Paste ke `.env` file

### **Opsi 2: Turso CLI (Jika sudah terinstall)**
```bash
# Login ke Turso
turso auth login

# Generate token untuk database crevidv2
turso db tokens create crevidv2-rungatumbuh

# Copy token yang dihasilkan
```

## 🔧 **Update .env File:**

Setelah mendapat token, update file `.env`:

```env
# Database Configuration (Turso)
DATABASE_URL=libsql://crevidv2-rungatumbuh.aws-ap-northeast-1.turso.io
DATABASE_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...  # <-- PASTE TOKEN DISINI
```

## 🧪 **Test Koneksi:**

Setelah update token, test koneksi:

```bash
# 1. Migrate schema ke Turso
npm run db:migrate

# 2. Initialize database
npm run db:init

# 3. Test integration
node test-integration.js
```

## ✅ **Hasil yang Diharapkan:**

Jika berhasil, Anda akan melihat:
```
✅ Database initialized successfully
🎉 ALL INTEGRATIONS SUCCESSFUL!
🚀 Backend is fully integrated and ready for production!
```

## 🚨 **Jika Masih Error:**

### Error "UNAUTHORIZED" atau "403":
- Token salah atau expired
- Generate token baru dari dashboard

### Error "404" atau "NOT_FOUND":
- Database name salah
- Pastikan database `crevidv2-rungatumbuh` ada

### Error "Network timeout":
- Cek koneksi internet
- Coba lagi beberapa saat

## 🎯 **Next Steps:**

Setelah Turso connection berhasil:
1. ✅ Database schema applied
2. ✅ Default settings initialized  
3. ✅ API endpoints working
4. 🚀 Ready for frontend integration!

**Silakan dapatkan auth token dari Turso dashboard dan update `.env` file!**
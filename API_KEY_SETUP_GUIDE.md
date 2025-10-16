# 🔑 API Key Setup Guide - CREVID

## ❌ **MASALAH YANG DIPERBAIKI**

**Error:** `401 Incorrect API key provided`  
**Penyebab:** API key lama/rusak tersimpan di database  
**Status:** ✅ **DIPERBAIKI** - Settings sudah di-reset

---

## 🔧 **CARA SETUP API KEY YANG BENAR**

### 1. **Dapatkan OpenAI API Key**

1. **Buka:** https://platform.openai.com/account/api-keys
2. **Login** dengan akun OpenAI Anda
3. **Klik:** "Create new secret key"
4. **Copy** API key yang dimulai dengan `sk-...`

**Format yang benar:**
```
sk-proj-1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
```

### 2. **Masukkan API Key di CREVID**

1. **Buka:** http://localhost:5173/settings
2. **Scroll ke:** "API Configuration" section
3. **Paste** API key di field "OpenAI API Key"
4. **Klik:** "Save All Settings"

### 3. **Verifikasi Setup**

1. **Buka:** http://localhost:5173/generate
2. **Masukkan topik:** contoh "Tutorial React Hooks"
3. **Klik:** "Generate Content"
4. **Tunggu:** 10-30 detik untuk hasil

---

## ✅ **PERBAIKAN YANG SUDAH DILAKUKAN**

### 1. **Database Reset** ✅
- API key lama yang rusak sudah dihapus
- Settings di-reset ke kondisi bersih
- Database siap menerima API key baru

### 2. **Enkripsi Fixed** ✅
- Sistem enkripsi/dekripsi API key diperbaiki
- ENCRYPTION_KEY diperbarui
- API key disimpan dengan aman

### 3. **Error Handling** ✅
- Error message lebih jelas
- OpenAI service memberikan panduan yang tepat
- Validasi API key format ditingkatkan

---

## 🚨 **TROUBLESHOOTING**

### **Error: "OpenAI API key not configured"**
**Solusi:** Masukkan API key baru di Settings

### **Error: "401 Incorrect API key"**
**Solusi:** 
1. Pastikan API key dimulai dengan `sk-`
2. Copy ulang dari OpenAI dashboard
3. Paste di Settings dan save

### **Error: "API key format invalid"**
**Solusi:**
1. Cek API key tidak terpotong saat copy
2. Pastikan tidak ada spasi di awal/akhir
3. API key harus lengkap (biasanya 51+ karakter)

---

## 📋 **CHECKLIST SETUP**

- [ ] **Dapatkan API key dari OpenAI** (https://platform.openai.com/account/api-keys)
- [ ] **Pastikan format benar** (dimulai dengan `sk-`)
- [ ] **Buka Settings CREVID** (http://localhost:5173/settings)
- [ ] **Paste API key** di field OpenAI API Key
- [ ] **Save settings** dengan tombol "Save All Settings"
- [ ] **Test generate content** di halaman Generate Content
- [ ] **Verifikasi berhasil** - content ter-generate dalam 10-30 detik

---

## 🎯 **NEXT STEPS**

1. **Setup OpenAI API Key** (WAJIB untuk content generation)
2. **Setup GoFile Token** (opsional - untuk media storage)
3. **Setup QStash Keys** (opsional - untuk background jobs)

**Prioritas:** OpenAI API Key adalah yang paling penting untuk mulai menggunakan CREVID.

---

## 💡 **TIPS**

- **API Key OpenAI berbayar** - pastikan ada credit di akun
- **Rate limit** - API key gratis ada batasan request
- **Keamanan** - jangan share API key ke orang lain
- **Backup** - simpan API key di tempat aman

---

**Status:** 🎉 **READY FOR SETUP**  
**Next Action:** Masukkan OpenAI API Key di Settings UI
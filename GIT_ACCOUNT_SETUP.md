# 🔄 Git Account Setup Guide

## ✅ **GIT LOGOUT COMPLETE**

Semua konfigurasi git dan credential sudah di-clear:
- ✅ Global user.name removed
- ✅ Global user.email removed  
- ✅ Local user.name removed
- ✅ Local user.email removed
- ✅ GitHub credentials deleted from Windows Credential Manager

---

## 🔧 **SETUP AKUN GIT BARU**

### **1. Configure Git dengan Akun Baru**
```bash
# Set global git config (untuk semua repository)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Atau set hanya untuk repository ini
git config user.name "Your Name"  
git config user.email "your-email@example.com"
```

### **2. Setup GitHub Authentication**

#### **Opsi A: Personal Access Token (Recommended)**
```bash
# 1. Buat Personal Access Token di GitHub:
#    Settings > Developer settings > Personal access tokens > Generate new token
#    
# 2. Set remote dengan token:
git remote set-url origin https://YOUR_TOKEN@github.com/RMM-XCODE/CREVID-V2.git

# 3. Push
git push -u origin main
```

#### **Opsi B: SSH Key**
```bash
# 1. Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# 2. Add SSH key to GitHub
#    Settings > SSH and GPG keys > New SSH key
#    Copy content dari ~/.ssh/id_ed25519.pub

# 3. Change remote to SSH
git remote set-url origin git@github.com:RMM-XCODE/CREVID-V2.git

# 4. Push
git push -u origin main
```

#### **Opsi C: GitHub CLI**
```bash
# 1. Install GitHub CLI
winget install GitHub.cli

# 2. Login
gh auth login

# 3. Push
git push -u origin main
```

---

## 📋 **CURRENT STATUS**

### **✅ Ready for New Account:**
- Repository: Initialized and committed (80 files)
- Remote: Set to https://github.com/RMM-XCODE/CREVID-V2.git
- Commit: 39d4447 "Initial commit: CREVID V2 Complete Integration"
- Status: Ready to push with new authentication

### **🔄 Next Steps:**
1. Configure git dengan akun yang diinginkan
2. Setup authentication (Token/SSH/GitHub CLI)
3. Push ke repository
4. Deploy ke production

---

## 🎯 **QUICK SETUP COMMANDS**

```bash
# Replace dengan informasi akun Anda
git config --global user.name "RMM-XCODE"
git config --global user.email "rmmxcode@gmail.com"

# Setup dengan Personal Access Token
git remote set-url origin https://YOUR_TOKEN@github.com/RMM-XCODE/CREVID-V2.git
git push -u origin main
```

---

**Status:** 🔄 **READY FOR NEW GIT ACCOUNT SETUP**
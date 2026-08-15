# 🚀 Quick Start Guide

## Langkah 1: Instalasi

Jika belum install dependencies:
```bash
npm install
```

## Langkah 2: Jalankan Bot

```bash
npm start
```

atau

```bash
node index.js
```

## Langkah 3: Scan QR Code

1. Setelah menjalankan bot, QR code akan muncul di terminal
2. Buka WhatsApp di smartphone Anda
3. Tap menu (⋮) > **Linked Devices**
4. Tap **Link a Device**
5. Scan QR code yang muncul di terminal

## Langkah 4: Tunggu Bot Siap

Anda akan melihat pesan:
```
✅ Bot WhatsApp siap digunakan!
```

## Langkah 5: Test Bot

Kirim pesan ke nomor WhatsApp yang sudah di-link:

```
!ping
```

Bot akan membalas:
```
🏓 Pong!
```

## Langkah 6: Lihat Daftar Perintah

```
!help
```

Bot akan menampilkan semua perintah yang tersedia.

---

## 🎯 Perintah Favorit untuk Dicoba

1. **!joke** - Dapatkan lelucon
2. **!dice** - Lempar dadu
3. **!time** - Lihat waktu sekarang
4. **!calc 5 * 10** - Kalkulator
5. **!sticker** - Buat sticker (reply ke gambar)

---

## ❓ Troubleshooting

### QR Code tidak muncul
- Pastikan dependencies sudah terinstall: `npm install`
- Cek koneksi internet
- Restart bot: tutup dan jalankan ulang

### Bot tidak merespon
- Pastikan bot sudah dalam status "ready" (lihat di terminal)
- Cek apakah ada error di terminal
- Pastikan menggunakan prefix `!` di awal perintah

### Session error
- Hapus folder `.wwebjs_auth/` dan scan QR code lagi
```bash
rm -rf .wwebjs_auth/
npm start
```

### Port/Browser error
- Pastikan tidak ada instance bot lain yang berjalan
- Tutup semua proses Chrome/Chromium yang tidak perlu

---

## 📱 Tips Penggunaan

1. **Session Tersimpan**: Setelah scan QR pertama kali, session akan tersimpan. Anda tidak perlu scan ulang setiap restart.

2. **Multiple Commands**: Bot bisa menangani multiple pesan sekaligus dari berbagai user.

3. **Group & Personal**: Bot bekerja di personal chat dan grup.

4. **Admin Commands**: Beberapa perintah seperti `!tagall` hanya bisa digunakan admin grup.

---

## 🔄 Update Bot

Untuk menambah fitur baru, edit file `index.js` dan restart bot:

```bash
# Ctrl+C untuk stop bot
npm start
```

---

## 📚 Dokumentasi Lengkap

- **README.md** - Overview dan fitur lengkap
- **COMMANDS.md** - Dokumentasi semua perintah
- **config.js** - File konfigurasi bot

---

## ⚠️ Penting!

- Jangan share session folder (`.wwebjs_auth/`) dengan orang lain
- Jangan gunakan bot untuk spam atau melanggar ToS WhatsApp
- Backup session folder jika ingin pindah device

---

Selamat menggunakan bot WhatsApp! 🎉

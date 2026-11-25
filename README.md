# 🤖 Bot WhatsApp

Bot WhatsApp yang dibuat menggunakan `whatsapp-web.js` dengan berbagai fitur menarik!

## ✨ Fitur

### 📝 Perintah Dasar
- `!ping` - Test koneksi bot
- `!help` / `!menu` - Tampilkan daftar perintah
- `!info` - Informasi tentang bot
- `!sticker` - Buat sticker dari gambar (reply ke gambar dengan perintah ini)
- `!group` - Info tentang grup (hanya di grup)

### 💬 Perintah Chat
- `!quote` - Tampilkan quote motivasi acak
- `!time` - Tampilkan waktu sekarang
- `!tagall` - Tag semua member grup (hanya admin)
- `!say <teks>` - Bot akan mengulangi teks yang Anda kirim

### 🎲 Hiburan
- `!dice` - Lempar dadu (1-6)
- `!flip` - Lempar koin (kepala/ekor)
- `!joke` - Cerita lelucon acak

### 🧮 Utilitas
- `!calc <ekspresi>` - Kalkulator sederhana
  - Contoh: `!calc 10 + 5 * 2`

### 📤 Kirim Pesan Langsung
- `!send <nomor> <pesan>` - Kirim pesan ke 1 nomor
  - Contoh: `!send 628123456789 Halo!`
- `!broadcast <nomor1,nomor2> <pesan>` - Kirim ke banyak nomor
  - Contoh: `!broadcast 628111,628222 Promo spesial!`

> **Dokumentasi lengkap**: Lihat [SEND-MESSAGE.md](SEND-MESSAGE.md)

## 🚀 Instalasi

1. Clone atau download repository ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan bot:
   ```bash
   npm start
   ```
   atau
   ```bash
   node index.js
   ```

4. Scan QR code yang muncul di terminal menggunakan WhatsApp Anda:
   - Buka WhatsApp di HP
   - Tap menu (titik tiga) > Linked Devices
   - Tap "Link a Device"
   - Scan QR code di terminal

   QR juga otomatis disimpan sebagai file **`qr.png`** di folder project, jadi bisa dibuka/di-scan dari layar jika QR di terminal kurang jelas.

   Jika memakai REST API, buka **http://localhost:3000/qr-page** di browser untuk melihat QR yang bisa di-scan.

## 🔌 Koneksi WhatsApp Bermasalah?

Jika QR tidak muncul, muncul error, atau bot minta scan terus:

```bash
npm run reset-session   # pindahkan session lama ke folder .bak-* (tidak dihapus)
npm start               # jalankan ulang, lalu scan QR baru
```

Catatan penting:
- Hanya boleh ada **satu** proses bot yang berjalan (jangan `npm start` dan `npm run api` bersamaan).
- Session tersimpan di `.wwebjs_auth/`. Session lama/expired bisa membuat bot gagal menampilkan QR.
- Versi `whatsapp-web.js` di project ini di-pin ke commit perbaikan `38eb45b` (24 Nov 2026) karena rilis npm 1.34.8 belum mendukung WhatsApp Web terbaru. Setelah versi baru dirilis di npm, dependency bisa dikembalikan ke `^1.34.9` atau lebih baru.

## 📋 Persyaratan

- Node.js versi 18 atau lebih tinggi
- NPM atau Yarn
- Google Chrome / Chromium terpasang
- WhatsApp aktif di smartphone

## 🛠️ Teknologi yang Digunakan

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - Library untuk berinteraksi dengan WhatsApp Web
- [qrcode-terminal](https://github.com/gtanner/qrcode-terminal) - Untuk menampilkan QR code di terminal

## 📝 Catatan

- Bot ini menggunakan WhatsApp Web protocol
- Session akan disimpan di folder `.wwebjs_auth/` sehingga Anda tidak perlu scan QR code setiap kali restart
- Bot akan merespon di personal chat maupun grup
- Bot dapat mengirim pesan langsung ke nomor tanpa menunggu pesan masuk

## 📚 Dokumentasi Tambahan

- **[SEND-MESSAGE.md](SEND-MESSAGE.md)** - Panduan lengkap kirim pesan langsung ke nomor
- **[COMMANDS.md](COMMANDS.md)** - Dokumentasi semua perintah bot
- **[EXTENDING.md](EXTENDING.md)** - Tutorial menambah fitur custom
- **[QUICKSTART.md](QUICKSTART.md)** - Panduan cepat memulai

## 💼 Use Cases

### 1. Customer Service
```
!send 628123456789 Terima kasih telah menghubungi kami! Tim kami akan segera membantu.
```

### 2. Notifikasi Order
```javascript
// Kirim notifikasi otomatis saat ada order baru
await client.sendMessage('628123456789@c.us', 
  '✅ Order Anda telah diterima!\n\nNomor Order: #12345'
);
```

### 3. Broadcast Promo
```
!broadcast 628111,628222,628333 🎉 FLASH SALE! Diskon 50% hari ini!
```

### 4. Reminder Otomatis
Lihat contoh di `examples/scheduled-message.js`

## 🔧 Kustomisasi

Anda dapat menambahkan perintah baru dengan mengedit file `index.js`:

```javascript
else if (command === '!perintahbaru') {
    await message.reply('Respon dari perintah baru!');
}
```

## ⚠️ Disclaimer

Bot ini dibuat untuk tujuan edukasi. Pastikan Anda mematuhi [Terms of Service WhatsApp](https://www.whatsapp.com/legal/terms-of-service) saat menggunakannya.

## 📄 Lisensi

ISC

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau buka issue untuk saran dan perbaikan.

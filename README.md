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

## 📋 Persyaratan

- Node.js versi 14 atau lebih tinggi
- NPM atau Yarn
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

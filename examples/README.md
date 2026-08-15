# 📁 Contoh Penggunaan Bot WhatsApp

Folder ini berisi berbagai contoh script untuk mendemonstrasikan fitur-fitur bot WhatsApp.

## 📄 File yang Tersedia

### 1. `broadcast-example.js`
Contoh untuk mengirim pesan broadcast ke banyak nomor dengan personalisasi nama.

**Fitur:**
- Broadcast ke multiple nomor
- Personalisasi pesan dengan nama
- Tracking success/failed
- Auto delay antar pesan

**Cara Jalankan:**
```bash
node examples/broadcast-example.js
```

**Edit yang Perlu Dilakukan:**
```javascript
const daftarCustomer = [
    { nama: 'Andi', nomor: '628111111111@c.us' },
    { nama: 'Budi', nomor: '628222222222@c.us' },
    // Ganti dengan nomor Anda
];
```

---

### 2. `scheduled-message.js`
Contoh untuk mengirim pesan terjadwal dan reminder berulang.

**Fitur:**
- Kirim pesan setelah delay tertentu
- Reminder berulang (setiap X menit/jam)
- Kirim di waktu spesifik (jam tertentu)
- Reminder berbasis hari (Senin, Jumat, dll)
- Countdown timer

**Cara Jalankan:**
```bash
node examples/scheduled-message.js
```

**Contoh Penggunaan:**

**Kirim setelah 5 detik:**
```javascript
setTimeout(async () => {
    await client.sendMessage(nomor, 'Pesan delayed!');
}, 5000);
```

**Reminder setiap 1 jam:**
```javascript
setInterval(async () => {
    await client.sendMessage(nomor, 'Reminder per jam!');
}, 3600000); // 1 jam
```

**Kirim setiap hari jam 08:00:**
```javascript
kirimDiWaktuTertentu(8, 0, 'Selamat pagi!', nomor);
```

---

### 3. `send-media.js`
Contoh untuk mengirim berbagai jenis media (gambar, dokumen, video).

**Fitur:**
- Kirim gambar dari file lokal
- Kirim gambar dari URL
- Kirim dokumen/PDF
- Kirim multiple media sekaligus
- Kirim dengan base64
- Broadcast media ke multiple nomor

**Cara Jalankan:**
```bash
node examples/send-media.js
```

**Contoh Kode:**

**Kirim gambar dari file:**
```javascript
const media = MessageMedia.fromFilePath('./images/promo.jpg');
await client.sendMessage(nomor, media, {
    caption: 'Lihat promo kami!'
});
```

**Kirim gambar dari URL:**
```javascript
const media = await MessageMedia.fromUrl('https://example.com/image.jpg');
await client.sendMessage(nomor, media, {
    caption: 'Promo spesial!'
});
```

**Kirim dokumen:**
```javascript
const media = MessageMedia.fromFilePath('./files/katalog.pdf');
await client.sendMessage(nomor, media, {
    sendMediaAsDocument: true,
    fileName: 'Katalog.pdf'
});
```

---

## 🚀 Cara Menggunakan

### Langkah 1: Install Dependencies
```bash
cd /home/aris/Documents/coding/whatsapp-bot/whatsapp-bot
npm install
```

### Langkah 2: Edit File Contoh
Buka file yang ingin Anda coba dan edit bagian:
- `nomorTujuan` - Ganti dengan nomor WhatsApp tujuan
- `daftarCustomer` - Ganti dengan daftar nomor Anda
- `pesanBroadcast` - Sesuaikan pesan yang ingin dikirim

### Langkah 3: Jalankan Script
```bash
node examples/nama-file.js
```

### Langkah 4: Scan QR Code
Scan QR code yang muncul dengan WhatsApp Anda.

### Langkah 5: Lihat Hasil
Bot akan otomatis mengirim pesan sesuai dengan script yang dijalankan.

---

## 💡 Tips Penggunaan

### 1. Testing
Selalu test ke nomor sendiri dulu sebelum kirim ke customer:
```javascript
const nomorTest = '628123456789@c.us'; // Nomor Anda sendiri
```

### 2. Delay Antar Pesan
Gunakan delay minimal 2 detik untuk menghindari spam detection:
```javascript
await new Promise(resolve => setTimeout(resolve, 2000));
```

### 3. Error Handling
Selalu gunakan try-catch:
```javascript
try {
    await client.sendMessage(nomor, pesan);
    console.log('✅ Terkirim');
} catch (error) {
    console.error('❌ Gagal:', error.message);
}
```

### 4. Logging
Log setiap pengiriman untuk tracking:
```javascript
console.log(`📤 Kirim ke ${nomor}: ${pesan}`);
```

### 5. Session Management
File-file ini akan menggunakan session yang sama dengan bot utama (folder `.wwebjs_auth/`), jadi Anda tidak perlu scan QR berkali-kali.

---

## 🔧 Modifikasi Script

### Menambah Nomor Broadcast
Edit array `daftarCustomer` di `broadcast-example.js`:
```javascript
const daftarCustomer = [
    { nama: 'Customer 1', nomor: '628111111111@c.us' },
    { nama: 'Customer 2', nomor: '628222222222@c.us' },
    { nama: 'Customer 3', nomor: '628333333333@c.us' },
];
```

### Mengubah Jadwal Reminder
Edit waktu di `scheduled-message.js`:
```javascript
// Ubah jam dan menit
kirimDiWaktuTertentu(9, 30, 'Reminder jam 9:30', nomor);
```

### Menambah Jenis Media
Edit `send-media.js` untuk menambah gambar/file lain:
```javascript
const media = MessageMedia.fromFilePath('./images/gambar-baru.jpg');
await client.sendMessage(nomor, media, { caption: 'Caption baru' });
```

---

## 📊 Format Nomor

Semua nomor harus dalam format:
```
[kode_negara][nomor]@c.us
```

**Contoh Indonesia:**
```
628123456789@c.us
```

**Catatan:**
- Tanpa tanda `+`
- Tanpa angka `0` di depan
- Tanpa spasi atau tanda hubung
- Harus pakai suffix `@c.us`

---

## ⚠️ Catatan Penting

1. **Rate Limiting**: Jangan kirim terlalu cepat (max ~20 pesan/menit)
2. **Spam Detection**: WhatsApp bisa ban akun jika spam
3. **Valid Numbers**: Nomor harus terdaftar di WhatsApp
4. **Testing First**: Selalu test ke nomor sendiri dulu
5. **Delay Required**: Gunakan delay minimal 1-2 detik antar pesan

---

## 🎯 Use Case Real

### Customer Service Automation
```javascript
// Auto reply untuk order baru
await client.sendMessage(customer, 
  '✅ Order Anda (#12345) sedang diproses.\n' +
  'Estimasi: 1-2 hari kerja.'
);
```

### Marketing Campaign
```javascript
// Broadcast promo ke customer list
for (const customer of customerList) {
    await client.sendMessage(customer.nomor,
      `Halo ${customer.nama}! 🎉\n\n` +
      'Dapatkan diskon 30% dengan kode: PROMO30'
    );
    await delay(2000);
}
```

### Daily Reminder
```javascript
// Reminder meeting setiap hari jam 9
kirimDiWaktuTertentu(9, 0, 
  '📅 Reminder: Daily standup meeting dalam 30 menit!',
  teamGroupId
);
```

---

## 📞 Support

Jika ada pertanyaan tentang contoh-contoh ini:
1. Baca dokumentasi di folder utama (`README.md`, `SEND-MESSAGE.md`)
2. Cek error log di terminal
3. Pastikan format nomor sudah benar
4. Test ke nomor sendiri dulu

---

Selamat bereksperimen! 🚀

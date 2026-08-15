# 📤 Cara Mengirim Pesan Langsung ke Nomor WhatsApp

Bot ini mendukung pengiriman pesan langsung ke nomor WhatsApp tanpa harus menunggu pesan masuk terlebih dahulu.

## 🎯 Metode 1: Menggunakan Perintah Bot

### A. Kirim ke 1 Nomor

**Format:**
```
!send [nomor] [pesan]
```

**Contoh:**
```
!send 628123456789 Halo, ini pesan dari bot!
```

**Penjelasan:**
- `628123456789` = nomor tujuan (format: kode negara + nomor)
- Format Indonesia: `628xxxxxxxxx` (62 = kode negara Indonesia)
- Tanpa tanda `+`, `-`, atau spasi

**Contoh Lain:**
```
!send 628123456789 Selamat pagi! Semoga harimu menyenangkan.
!send 6281234567890 Reminder: Meeting jam 2 siang hari ini.
```

---

### B. Broadcast ke Banyak Nomor

**Format:**
```
!broadcast [nomor1,nomor2,nomor3] [pesan]
```

**Contoh:**
```
!broadcast 628111,628222,628333 Halo semua! Ini pesan broadcast.
```

**Penjelasan:**
- Pisahkan nomor dengan koma `,`
- Tanpa spasi antara nomor
- Bot akan mengirim ke semua nomor satu per satu
- Ada delay 2 detik antar pengiriman (anti-spam)

**Contoh Lain:**
```
!broadcast 628111,628222 Promo spesial hari ini!
!broadcast 6281111,6281222,6281333,6281444 Meeting dibatalkan.
```

---

## 🎯 Metode 2: Menggunakan Script Terpisah

### File: `send-direct.js`

Script ini khusus untuk mengirim pesan otomatis saat bot start.

**Cara Menggunakan:**

1. Edit file `send-direct.js`
2. Ganti nomor tujuan:
   ```javascript
   const nomorTujuan = '628123456789@c.us';
   ```

3. Ganti pesan:
   ```javascript
   await client.sendMessage(nomorTujuan, 'Pesan Anda di sini');
   ```

4. Jalankan:
   ```bash
   node send-direct.js
   ```

**Contoh Kode untuk Kirim ke 1 Nomor:**
```javascript
client.on('ready', async () => {
    const nomor = '628123456789@c.us';
    await client.sendMessage(nomor, 'Halo! Pesan otomatis.');
    console.log('Pesan terkirim!');
});
```

**Contoh Kode untuk Kirim ke Banyak Nomor:**
```javascript
client.on('ready', async () => {
    const daftarNomor = [
        '628111111111@c.us',
        '628222222222@c.us',
        '628333333333@c.us'
    ];

    for (const nomor of daftarNomor) {
        try {
            await client.sendMessage(nomor, 'Broadcast message!');
            console.log('✅ Terkirim ke', nomor);
            
            // Delay 2 detik
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error('❌ Gagal kirim ke', nomor);
        }
    }
});
```

---

## 📋 Format Nomor yang Benar

### Indonesia
```
628123456789@c.us
```
- Kode negara: `62`
- Nomor: `8123456789` (tanpa 0 di depan)
- Suffix: `@c.us`

### Negara Lain

**Malaysia (+60):**
```
60123456789@c.us
```

**Singapura (+65):**
```
6512345678@c.us
```

**Amerika Serikat (+1):**
```
11234567890@c.us
```

### ⚠️ Catatan Penting tentang Format Nomor

1. **Tanpa tanda +**: `628xxx` bukan `+628xxx`
2. **Tanpa 0 di depan**: `628xxx` bukan `6208xxx`
3. **Tanpa spasi/tanda hubung**: `628123456789` bukan `62 812-3456-789`
4. **Harus pakai @c.us**: Suffix wajib untuk personal chat
5. **Grup pakai @g.us**: Untuk grup chat (ID grup berbeda)

---

## 🚀 Contoh Use Case

### 1. Reminder Otomatis
```javascript
// Kirim reminder setiap pagi jam 8
const nomor = '628123456789@c.us';
await client.sendMessage(nomor, '☀️ Selamat pagi! Jangan lupa meeting jam 9.');
```

### 2. Notifikasi Order
```javascript
const customer = '628123456789@c.us';
await client.sendMessage(customer, '✅ Pesanan Anda sudah diproses!\n\nNomor Resi: ABC123456');
```

### 3. Broadcast Promo
```javascript
const customers = [
    '628111111111@c.us',
    '628222222222@c.us',
    '628333333333@c.us'
];

for (const customer of customers) {
    await client.sendMessage(customer, '🎉 PROMO SPESIAL!\nDiskon 50% untuk hari ini!');
    await new Promise(r => setTimeout(r, 2000));
}
```

### 4. Konfirmasi Pembayaran
```javascript
const customer = '628123456789@c.us';
await client.sendMessage(customer, 
    '✅ *Pembayaran Diterima*\n\n' +
    'Jumlah: Rp 150.000\n' +
    'Waktu: ' + new Date().toLocaleString('id-ID') + '\n\n' +
    'Terima kasih! 🙏'
);
```

---

## 🔧 Fungsi Helper untuk Format Nomor

Tambahkan di `index.js` atau buat file terpisah:

```javascript
/**
 * Format nomor WhatsApp
 * @param {string} number - Nomor telepon
 * @returns {string} - Format WhatsApp ID
 */
function formatWhatsAppNumber(number) {
    // Hilangkan karakter non-numeric
    let cleaned = number.replace(/\D/g, '');
    
    // Jika diawali 0, ganti dengan 62 (Indonesia)
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
    }
    
    // Jika tidak diawali kode negara, tambahkan 62
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned;
    }
    
    return cleaned + '@c.us';
}

// Contoh penggunaan:
const nomor1 = formatWhatsAppNumber('08123456789');     // 628123456789@c.us
const nomor2 = formatWhatsAppNumber('62 812-3456-789'); // 628123456789@c.us
const nomor3 = formatWhatsAppNumber('+628123456789');   // 628123456789@c.us
```

---

## 📤 Kirim Media (Gambar, Video, File)

### Kirim Gambar
```javascript
const { MessageMedia } = require('whatsapp-web.js');

const nomor = '628123456789@c.us';
const media = MessageMedia.fromFilePath('./images/foto.jpg');

await client.sendMessage(nomor, media, {
    caption: 'Ini caption gambar'
});
```

### Kirim File/Dokumen
```javascript
const media = MessageMedia.fromFilePath('./files/dokumen.pdf');

await client.sendMessage('628123456789@c.us', media, {
    sendMediaAsDocument: true,
    fileName: 'Dokumen.pdf'
});
```

### Kirim dari URL
```javascript
const media = await MessageMedia.fromUrl('https://example.com/image.jpg');
await client.sendMessage('628123456789@c.us', media);
```

---

## ⚠️ Batasan dan Tips

### Batasan WhatsApp
1. **Rate Limit**: Jangan kirim terlalu cepat (max ~20 pesan/menit)
2. **Spam Detection**: WhatsApp bisa ban akun jika spam
3. **Nomor Harus Valid**: Nomor harus terdaftar di WhatsApp
4. **Business Account**: Untuk broadcast besar, gunakan WhatsApp Business API

### Tips Penggunaan
1. **Delay Antar Pesan**: Minimal 1-2 detik
2. **Verifikasi Nomor**: Cek nomor valid sebelum kirim
3. **Error Handling**: Selalu pakai try-catch
4. **Logging**: Log semua pengiriman untuk tracking
5. **Opt-out**: Berikan cara user untuk stop notifikasi

### Contoh Anti-Spam
```javascript
const DELAY_MS = 2000; // 2 detik
const MAX_MESSAGES_PER_HOUR = 50;

let messageCount = 0;

async function sendSafe(number, text) {
    if (messageCount >= MAX_MESSAGES_PER_HOUR) {
        console.log('⚠️ Limit tercapai, tunggu 1 jam');
        return false;
    }

    try {
        await client.sendMessage(number, text);
        messageCount++;
        await new Promise(r => setTimeout(r, DELAY_MS));
        return true;
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
}

// Reset counter setiap jam
setInterval(() => {
    messageCount = 0;
    console.log('✅ Message counter direset');
}, 3600000); // 1 jam
```

---

## 🔍 Cek Nomor Valid

```javascript
async function isNumberValid(number) {
    try {
        const numberId = await client.getNumberId(number);
        return numberId !== null;
    } catch (error) {
        return false;
    }
}

// Contoh penggunaan:
const nomor = '628123456789@c.us';
const valid = await isNumberValid(nomor);

if (valid) {
    await client.sendMessage(nomor, 'Halo!');
} else {
    console.log('Nomor tidak valid atau tidak terdaftar di WhatsApp');
}
```

---

## 📝 Logging Pengiriman

```javascript
const fs = require('fs');

function logMessage(to, message, status) {
    const log = {
        timestamp: new Date().toISOString(),
        to: to,
        message: message,
        status: status
    };
    
    fs.appendFileSync('message-log.txt', JSON.stringify(log) + '\n');
}

// Contoh penggunaan:
try {
    await client.sendMessage(nomor, pesan);
    logMessage(nomor, pesan, 'SUCCESS');
} catch (error) {
    logMessage(nomor, pesan, 'FAILED: ' + error.message);
}
```

---

## 🎯 Testing

Sebelum kirim ke customer, test dulu ke nomor sendiri:

```bash
node send-direct.js
```

Atau gunakan perintah:
```
!send [nomor-anda] Test message
```

---

Selamat menggunakan fitur kirim pesan langsung! 📤

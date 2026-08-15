# 📡 WhatsApp Bot REST API Documentation

REST API untuk mengirim pesan WhatsApp dengan mudah. Tinggal POST request!

## 🚀 Quick Start

### 1. Jalankan API Server

```bash
node api-server.js
```

Server akan berjalan di: `http://localhost:3000`

### 2. Scan QR Code

Pertama kali jalankan, bot akan menampilkan QR code di terminal. Scan dengan WhatsApp.

Atau akses: `http://localhost:3000/qr` untuk mendapatkan QR code via API.

### 3. Kirim Pesan!

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "message": "Halo! Ini pesan dari API"
  }'
```

---

## 📚 API Endpoints

### 1. **GET /** - Info API

Mendapatkan informasi tentang API.

**Request:**
```bash
curl http://localhost:3000/
```

**Response:**
```json
{
  "status": "online",
  "message": "WhatsApp Bot API Server",
  "version": "1.0.0",
  "whatsapp_ready": true,
  "endpoints": {
    "status": "GET /status",
    "send": "POST /send",
    "send_media": "POST /send-media",
    "broadcast": "POST /broadcast",
    "qr": "GET /qr"
  }
}
```

---

### 2. **GET /status** - Cek Status Bot

Mengecek apakah bot sudah siap menerima pesan.

**Request:**
```bash
curl http://localhost:3000/status
```

**Response:**
```json
{
  "ready": true,
  "message": "Bot siap menerima pesan",
  "timestamp": "2026-07-09T16:30:00.000Z"
}
```

---

### 3. **GET /qr** - Dapatkan QR Code

Mendapatkan QR code untuk scan WhatsApp (jika belum tersambung).

**Request:**
```bash
curl http://localhost:3000/qr
```

**Response:**
```json
{
  "success": true,
  "qr": "2@ABC123...",
  "message": "Scan QR code ini dengan WhatsApp Anda"
}
```

---

### 4. **POST /send** - Kirim Pesan (UTAMA) ⭐

Mengirim pesan WhatsApp ke satu nomor.

**Request:**
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "message": "Halo! Ini pesan test dari API"
  }'
```

**Request Body:**
```json
{
  "number": "089509844606",      // Format: 08xxx atau 628xxx
  "message": "Pesan Anda di sini"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Pesan berhasil dikirim",
  "data": {
    "to": "089509844606",
    "formatted": "6289509844606@c.us",
    "message": "Halo! Ini pesan test dari API",
    "timestamp": "2026-07-09T16:30:00.000Z"
  }
}
```

**Response Error:**
```json
{
  "success": false,
  "error": "Bot belum siap. Cek /status atau /qr"
}
```

---

### 5. **POST /send-media** - Kirim Gambar/File

Mengirim media (gambar, video, file) ke nomor WhatsApp.

**Request:**
```bash
curl -X POST http://localhost:3000/send-media \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "media_url": "https://example.com/image.jpg",
    "caption": "Lihat gambar ini!"
  }'
```

**Request Body:**
```json
{
  "number": "089509844606",
  "media_url": "https://example.com/image.jpg",
  "caption": "Caption opsional"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Media berhasil dikirim",
  "data": {
    "to": "089509844606",
    "media_url": "https://example.com/image.jpg",
    "caption": "Lihat gambar ini!",
    "timestamp": "2026-07-09T16:30:00.000Z"
  }
}
```

---

### 6. **POST /broadcast** - Kirim ke Banyak Nomor

Mengirim pesan ke multiple nomor sekaligus (broadcast).

**Request:**
```bash
curl -X POST http://localhost:3000/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "numbers": ["089509844606", "081234567890", "082345678901"],
    "message": "Broadcast message untuk semua!"
  }'
```

**Request Body:**
```json
{
  "numbers": [
    "089509844606",
    "081234567890",
    "082345678901"
  ],
  "message": "Pesan broadcast"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Broadcast selesai",
  "summary": {
    "total": 3,
    "success": 3,
    "failed": 0
  },
  "results": [
    {
      "number": "089509844606",
      "status": "success"
    },
    {
      "number": "081234567890",
      "status": "success"
    },
    {
      "number": "082345678901",
      "status": "success"
    }
  ],
  "timestamp": "2026-07-09T16:30:00.000Z"
}
```

---

## 💻 Contoh Penggunaan

### JavaScript (Fetch)

```javascript
// Kirim pesan
fetch('http://localhost:3000/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    number: '089509844606',
    message: 'Halo dari JavaScript!'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### Python

```python
import requests

# Kirim pesan
response = requests.post('http://localhost:3000/send', json={
    'number': '089509844606',
    'message': 'Halo dari Python!'
})

print(response.json())
```

### PHP

```php
<?php
$data = [
    'number' => '089509844606',
    'message' => 'Halo dari PHP!'
];

$ch = curl_init('http://localhost:3000/send');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
```

### cURL (Terminal)

```bash
# Kirim pesan sederhana
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"number":"089509844606","message":"Test"}'

# Kirim media
curl -X POST http://localhost:3000/send-media \
  -H "Content-Type: application/json" \
  -d '{"number":"089509844606","media_url":"https://picsum.photos/500","caption":"Random image"}'

# Broadcast
curl -X POST http://localhost:3000/broadcast \
  -H "Content-Type: application/json" \
  -d '{"numbers":["089509844606","081234567890"],"message":"Broadcast!"}'
```

---

## 📋 Format Nomor

API akan otomatis memformat nomor. Anda bisa pakai format apapun:

| Input | Output |
|-------|--------|
| `089509844606` | `6289509844606@c.us` |
| `6289509844606` | `6289509844606@c.us` |
| `+6289509844606` | `6289509844606@c.us` |
| `0895-0984-4606` | `6289509844606@c.us` |

---

## ⚠️ Error Codes

| Status | Error | Solusi |
|--------|-------|--------|
| `503` | Bot belum siap | Tunggu bot ready atau scan QR |
| `400` | Parameter tidak lengkap | Periksa request body |
| `500` | Gagal kirim pesan | Cek nomor valid & terdaftar di WA |

---

## 🔒 Security Tips

### 1. Gunakan API Key (Opsional)

Edit `api-server.js`, tambahkan middleware:

```javascript
const API_KEY = 'your-secret-key';

app.use((req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

Penggunaan:
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{"number":"089509844606","message":"Test"}'
```

### 2. Rate Limiting

Install: `npm install express-rate-limit`

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 20 // max 20 request per menit
});

app.use('/send', limiter);
```

### 3. HTTPS

Gunakan reverse proxy (nginx) dengan SSL certificate.

---

## 🚀 Deploy ke Production

### 1. Gunakan PM2

```bash
npm install -g pm2
pm2 start api-server.js --name whatsapp-api
pm2 save
pm2 startup
```

### 2. Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Environment Variables

Buat `.env`:
```
PORT=3000
API_KEY=your-secret-key
NODE_ENV=production
```

---

## 📊 Monitoring

### Cek Logs

```bash
# Jika pakai PM2
pm2 logs whatsapp-api

# Atau tail log file
tail -f api-server.log
```

### Health Check

```bash
# Cek setiap 1 menit
watch -n 60 'curl -s http://localhost:3000/status | jq'
```

---

## 🎯 Use Cases

### 1. Notifikasi Order E-Commerce

```javascript
// Setelah order dibuat
await fetch('http://localhost:3000/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    number: customer.phone,
    message: `Order #${order.id} berhasil dibuat!\n\nTotal: Rp ${order.total}\nStatus: Pending`
  })
});
```

### 2. OTP / Verifikasi

```javascript
const otp = generateOTP();

await fetch('http://localhost:3000/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    number: user.phone,
    message: `Kode OTP Anda: ${otp}\n\nBerlaku 5 menit.`
  })
});
```

### 3. Reminder Appointment

```javascript
await fetch('http://localhost:3000/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    number: appointment.customer_phone,
    message: `Reminder: Appointment Anda besok jam ${appointment.time}\n\nLokasi: ${appointment.location}`
  })
});
```

---

## 🔧 Troubleshooting

### Bot tidak siap (503 error)

```bash
# Cek status
curl http://localhost:3000/status

# Dapatkan QR
curl http://localhost:3000/qr
```

### Nomor tidak terdaftar

Pastikan nomor terdaftar di WhatsApp dan format benar.

### Session expired

Restart server dan scan QR ulang:
```bash
pm2 restart whatsapp-api
```

---

## 📞 Support

Untuk bantuan lebih lanjut, baca:
- `README.md` - Dokumentasi utama
- `SEND-MESSAGE.md` - Panduan kirim pesan
- `EXTENDING.md` - Custom fitur

---

**API siap digunakan! 🚀**

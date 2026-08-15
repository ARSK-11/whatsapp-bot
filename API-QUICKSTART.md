# 🚀 REST API Quick Start

## Langkah 1: Jalankan API Server

```bash
npm run api
```

atau

```bash
node api-server.js
```

Server berjalan di: **http://localhost:3000**

---

## Langkah 2: Scan QR Code

Saat pertama kali jalan, bot akan tampilkan QR code di terminal. Scan dengan WhatsApp.

---

## Langkah 3: Test API

### ✅ Cara 1: Via Browser (UI)

Buka file `test-api.html` di browser:

```bash
open test-api.html
# atau double-click file test-api.html
```

### ✅ Cara 2: Via cURL (Terminal)

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"number":"089509844606","message":"Test pesan!"}'
```

### ✅ Cara 3: Via Postman

1. Method: **POST**
2. URL: `http://localhost:3000/send`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "number": "089509844606",
  "message": "Halo! Ini test dari Postman"
}
```

---

## 📡 Endpoint Tersedia

| Endpoint | Method | Fungsi |
|----------|--------|--------|
| `/` | GET | Info API |
| `/status` | GET | Cek status bot |
| `/qr` | GET | Dapatkan QR code |
| `/send` | POST | **Kirim pesan** ⭐ |
| `/send-media` | POST | Kirim gambar/file |
| `/broadcast` | POST | Kirim ke banyak nomor |

---

## 💻 Contoh Request

### Kirim Pesan Sederhana

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "message": "Halo! Pesan test"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Pesan berhasil dikirim",
  "data": {
    "to": "089509844606",
    "formatted": "6289509844606@c.us",
    "message": "Halo! Pesan test",
    "timestamp": "2026-07-09T16:30:00.000Z"
  }
}
```

---

### Kirim Gambar

```bash
curl -X POST http://localhost:3000/send-media \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "media_url": "https://picsum.photos/500",
    "caption": "Lihat gambar ini!"
  }'
```

---

### Broadcast ke Banyak Nomor

```bash
curl -X POST http://localhost:3000/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "numbers": ["089509844606", "081234567890"],
    "message": "Broadcast message!"
  }'
```

---

## 🔧 Integrasi dengan Aplikasi

### JavaScript

```javascript
async function kirimPesan(nomor, pesan) {
  const response = await fetch('http://localhost:3000/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      number: nomor,
      message: pesan
    })
  });
  
  const data = await response.json();
  return data;
}

// Penggunaan
kirimPesan('089509844606', 'Halo dari JavaScript!')
  .then(data => console.log(data));
```

### Python

```python
import requests

def kirim_pesan(nomor, pesan):
    response = requests.post('http://localhost:3000/send', json={
        'number': nomor,
        'message': pesan
    })
    return response.json()

# Penggunaan
result = kirim_pesan('089509844606', 'Halo dari Python!')
print(result)
```

### PHP

```php
<?php
function kirimPesan($nomor, $pesan) {
    $data = [
        'number' => $nomor,
        'message' => $pesan
    ];
    
    $ch = curl_init('http://localhost:3000/send');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Penggunaan
$result = kirimPesan('089509844606', 'Halo dari PHP!');
print_r($result);
?>
```

---

## ⚠️ Troubleshooting

### API tidak bisa diakses

```bash
# Cek apakah server berjalan
curl http://localhost:3000/status
```

### Bot belum siap (503 error)

1. Cek terminal API server - lihat QR code
2. Scan QR dengan WhatsApp
3. Tunggu sampai muncul "Bot siap digunakan!"

### CORS error di browser

Sudah diatasi dengan `cors` middleware. Jika masih error, restart server.

---

## 🎯 Use Case Praktis

### 1. Notifikasi Order E-Commerce

```javascript
// Setelah customer order
await fetch('http://localhost:3000/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    number: customerPhone,
    message: `Order #${orderId} berhasil!\n\nTotal: Rp ${total}\nStatus: Pending`
  })
});
```

### 2. OTP Verification

```javascript
const otp = generateOTP();

await fetch('http://localhost:3000/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    number: userPhone,
    message: `Kode OTP: ${otp}\n\nBerlaku 5 menit.`
  })
});
```

### 3. Appointment Reminder

```javascript
await fetch('http://localhost:3000/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    number: appointmentPhone,
    message: `Reminder: Appointment besok jam ${time}\n\nLokasi: ${location}`
  })
});
```

---

## 📚 Dokumentasi Lengkap

Baca **API-DOCUMENTATION.md** untuk dokumentasi lengkap dengan:
- Semua endpoint detail
- Error handling
- Security tips
- Deployment guide
- Dan lainnya

---

## 🚀 Kirim Pesan Sekarang!

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"number":"089509844606","message":"Hello World!"}'
```

✅ **API siap digunakan!**

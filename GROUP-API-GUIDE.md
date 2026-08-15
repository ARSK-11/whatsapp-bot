# 👥 WhatsApp Bot API - Panduan Kirim ke Grup

Dokumentasi lengkap untuk mengirim pesan ke grup WhatsApp.

---

## 🔵 1. List Semua Grup

Mendapatkan daftar semua grup yang bot ikuti.

### Request:
```bash
curl http://localhost:3000/groups
```

### Response:
```json
{
  "success": true,
  "message": "Ditemukan 3 grup",
  "count": 3,
  "groups": [
    {
      "id": "123456789-1234567890@g.us",
      "name": "Keluarga Besar",
      "participants": 15,
      "description": "Grup keluarga"
    },
    {
      "id": "987654321-0987654321@g.us",
      "name": "Tim Kerja",
      "participants": 8,
      "description": "Grup tim project"
    },
    {
      "id": "555555555-5555555555@g.us",
      "name": "Teman Sekolah",
      "participants": 25,
      "description": ""
    }
  ]
}
```

### Dengan jq (format pretty):
```bash
curl -s http://localhost:3000/groups | jq .
```

### Lihat nama grup saja:
```bash
curl -s http://localhost:3000/groups | jq '.groups[].name'
```

---

## 🔵 2. Kirim ke Grup (By ID)

Kirim pesan ke grup menggunakan Group ID.

### Request:
```bash
curl -X POST http://localhost:3000/send-group \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": "123456789-1234567890@g.us",
    "message": "Halo semua! Ini pesan dari bot"
  }'
```

### Response:
```json
{
  "success": true,
  "message": "Pesan berhasil dikirim ke grup",
  "data": {
    "group_id": "123456789-1234567890@g.us",
    "message": "Halo semua! Ini pesan dari bot",
    "timestamp": "2026-07-09T16:45:00.000Z"
  }
}
```

---

## 🔵 3. Kirim ke Grup (By Name) ⭐

Kirim pesan ke grup menggunakan nama grup (lebih mudah!).

### Request:
```bash
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{
    "group_name": "Keluarga",
    "message": "Halo keluarga! Pesan dari bot"
  }'
```

**Catatan:** Nama grup tidak perlu exact match. Bot akan mencari grup yang mengandung kata tersebut.

Contoh:
- `"group_name": "Keluarga"` → akan match "Keluarga Besar", "Keluarga Kecil", dll
- `"group_name": "Tim"` → akan match "Tim Kerja", "Tim Project", dll

### Response:
```json
{
  "success": true,
  "message": "Pesan berhasil dikirim ke grup",
  "data": {
    "group_id": "123456789-1234567890@g.us",
    "group_name": "Keluarga Besar",
    "message": "Halo keluarga! Pesan dari bot",
    "timestamp": "2026-07-09T16:45:00.000Z"
  }
}
```

---

## 💡 Contoh Penggunaan

### 1. Cari dan Kirim ke Grup

**Step 1: List semua grup**
```bash
curl -s http://localhost:3000/groups | jq '.groups[] | {name, id}'
```

**Output:**
```json
{
  "name": "Keluarga Besar",
  "id": "123456789-1234567890@g.us"
}
{
  "name": "Tim Kerja",
  "id": "987654321-0987654321@g.us"
}
```

**Step 2: Kirim pesan**
```bash
curl -X POST http://localhost:3000/send-group \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": "123456789-1234567890@g.us",
    "message": "Halo grup!"
  }'
```

---

### 2. Kirim Langsung dengan Nama Grup

Lebih simple, langsung pakai nama:

```bash
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{
    "group_name": "Keluarga",
    "message": "Halo semua!"
  }'
```

---

### 3. Kirim Pesan Multi-line ke Grup

```bash
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{
    "group_name": "Keluarga",
    "message": "📢 PENGUMUMAN\n\nAda acara keluarga:\n📅 Minggu, 15 Juli\n🕐 10:00 WIB\n📍 Rumah Nenek\n\nDitunggu kehadirannya! 🙏"
  }'
```

---

### 4. Kirim dengan Emoji

```bash
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{
    "group_name": "Tim Kerja",
    "message": "🎉 GOOD NEWS!\n\n✅ Project selesai tepat waktu\n🚀 Client sangat puas\n🙌 Terima kasih semua!"
  }'
```

---

### 5. Broadcast ke Multiple Grup

```bash
#!/bin/bash

GRUP_LIST=("Keluarga" "Tim Kerja" "Teman Sekolah")
PESAN="📢 Broadcast: Ini pesan penting untuk semua grup!"

for grup in "${GRUP_LIST[@]}"; do
  echo "Mengirim ke grup: $grup"
  
  curl -X POST http://localhost:3000/send-group-name \
    -H "Content-Type: application/json" \
    -d "{\"group_name\":\"$grup\",\"message\":\"$PESAN\"}"
  
  echo ""
  sleep 2  # Delay 2 detik antar grup
done
```

---

## 🔧 Use Cases

### 1. Pengumuman Keluarga

```bash
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{
    "group_name": "Keluarga",
    "message": "🏠 Pengumuman Keluarga\n\nArisan bulan ini:\n📅 Sabtu, 20 Juli\n🕐 19:00\n📍 Rumah Pak Budi\n\nJangan lupa ya! 😊"
  }'
```

### 2. Update Project Tim

```bash
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{
    "group_name": "Tim",
    "message": "📊 Update Project\n\nStatus: 85% Complete\n✅ Backend: Done\n✅ Frontend: Done\n⏳ Testing: In Progress\n\nTarget Launch: 25 Juli"
  }'
```

### 3. Reminder Meeting

```bash
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{
    "group_name": "Tim",
    "message": "⏰ REMINDER\n\nMeeting dalam 30 menit!\n\n🕐 14:00 WIB\n📹 Zoom Link: https://zoom.us/j/123456\n\nSampai jumpa! 👋"
  }'
```

### 4. Birthday Announcement

```bash
NAMA="John"
TANGGAL="10 Juli"

curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d "{
    \"group_name\": \"Kantor\",
    \"message\": \"🎂 HAPPY BIRTHDAY! 🎉\n\nSelamat ulang tahun untuk ${NAMA}!\n📅 ${TANGGAL}\n\nSemoga panjang umur, sehat selalu, dan sukses! 🎈🎁\"
  }"
```

### 5. Event Invitation

```bash
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{
    "group_name": "Teman",
    "message": "🎊 UNDANGAN EVENT\n\n📌 Reuni Angkatan 2020\n📅 Sabtu, 30 Juli 2026\n🕐 18:00 WIB\n📍 Restoran XYZ\n💰 Rp 150.000/orang\n\nKonfirmasi kehadiran ke: 0895-0984-4606\n\nDitunggu ya! 🙏"
  }'
```

---

## 📋 Tips & Tricks

### 1. Cari Group ID Spesifik

```bash
curl -s http://localhost:3000/groups | jq '.groups[] | select(.name | contains("Keluarga"))'
```

### 2. Count Total Participants

```bash
curl -s http://localhost:3000/groups | jq '[.groups[].participants] | add'
```

### 3. List Grup dengan Banyak Member

```bash
curl -s http://localhost:3000/groups | jq '.groups[] | select(.participants > 10)'
```

### 4. Export Grup List ke File

```bash
curl -s http://localhost:3000/groups | jq . > my-groups.json
```

### 5. Interactive Script

```bash
#!/bin/bash

echo "📱 WhatsApp Bot - Kirim ke Grup"
echo "================================"
echo ""

# Get groups
echo "Daftar Grup:"
curl -s http://localhost:3000/groups | jq -r '.groups[] | "\(.name) (\(.participants) members)"'

echo ""
read -p "Nama grup tujuan: " GRUP_NAME
read -p "Pesan: " PESAN

echo ""
echo "Mengirim pesan..."

curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d "{\"group_name\":\"$GRUP_NAME\",\"message\":\"$PESAN\"}"

echo ""
echo "✅ Selesai!"
```

---

## ⚠️ Error Handling

### Error: Grup tidak ditemukan

```json
{
  "success": false,
  "error": "Grup dengan nama \"XYZ\" tidak ditemukan",
  "help": "Gunakan GET /groups untuk melihat daftar grup"
}
```

**Solusi:**
1. Cek daftar grup: `curl http://localhost:3000/groups`
2. Pastikan nama grup benar
3. Gunakan sebagian nama (contoh: "Kel" untuk "Keluarga")

---

### Error: Bot belum siap

```json
{
  "success": false,
  "error": "Bot belum siap"
}
```

**Solusi:**
1. Cek status: `curl http://localhost:3000/status`
2. Tunggu bot ready
3. Scan QR jika diperlukan

---

## 🎯 Quick Reference

### List Grup:
```bash
curl http://localhost:3000/groups
```

### Kirim ke Grup (by ID):
```bash
curl -X POST http://localhost:3000/send-group \
  -H "Content-Type: application/json" \
  -d '{"group_id":"GROUP_ID","message":"Pesan"}'
```

### Kirim ke Grup (by Name) - RECOMMENDED:
```bash
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{"group_name":"Nama Grup","message":"Pesan"}'
```

---

## 💻 Integrasi Code

### JavaScript

```javascript
// List groups
fetch('http://localhost:3000/groups')
  .then(res => res.json())
  .then(data => console.log(data.groups));

// Send to group
fetch('http://localhost:3000/send-group-name', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    group_name: 'Keluarga',
    message: 'Halo grup!'
  })
}).then(res => res.json()).then(console.log);
```

### Python

```python
import requests

# List groups
groups = requests.get('http://localhost:3000/groups').json()
print(groups)

# Send to group
requests.post('http://localhost:3000/send-group-name', json={
    'group_name': 'Keluarga',
    'message': 'Halo dari Python!'
})
```

### PHP

```php
<?php
// List groups
$groups = file_get_contents('http://localhost:3000/groups');
echo $groups;

// Send to group
$ch = curl_init('http://localhost:3000/send-group-name');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'group_name' => 'Keluarga',
    'message' => 'Halo dari PHP!'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_exec($ch);
?>
```

---

✅ **Fitur Grup API sudah siap digunakan!**

Gunakan endpoint `/send-group-name` untuk kemudahan - tidak perlu tahu Group ID!

# 📡 cURL Examples - WhatsApp Bot API

Koleksi lengkap perintah cURL untuk WhatsApp Bot API.

---

## 🔵 1. Cek Status Bot

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

**Dengan format JSON pretty:**
```bash
curl -s http://localhost:3000/status | jq .
```

---

## 🔵 2. Kirim Pesan Sederhana

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"number":"089509844606","message":"Halo! Ini pesan test"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Pesan berhasil dikirim",
  "data": {
    "to": "089509844606",
    "formatted": "6289509844606@c.us",
    "message": "Halo! Ini pesan test",
    "timestamp": "2026-07-09T16:30:00.000Z"
  }
}
```

---

## 🔵 3. Kirim Pesan Multi-line

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "message": "Halo!\n\nIni pesan multi-line.\n\nBaris ketiga.\n\nSalam!"
  }'
```

---

## 🔵 4. Kirim Pesan dengan Emoji

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "message": "👋 Halo!\n\n✅ Pesan berhasil dikirim\n🚀 Via API\n📅 '"$(date '+%d/%m/%Y')"'"
  }'
```

---

## 🔵 5. Kirim Pesan dengan Variable

### Bash Variable:
```bash
NOMOR="089509844606"
PESAN="Halo dari variable!"

curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d "{\"number\":\"$NOMOR\",\"message\":\"$PESAN\"}"
```

### Dengan Timestamp:
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d "{\"number\":\"089509844606\",\"message\":\"Pesan dikirim pada: $(date '+%d/%m/%Y %H:%M:%S')\"}"
```

---

## 🔵 6. Kirim Notifikasi Order

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "message": "📦 *NOTIFIKASI ORDER*\n\nOrder ID: #12345\nTotal: Rp 150.000\nStatus: Pending\n\nTerima kasih!"
  }'
```

---

## 🔵 7. Kirim OTP

```bash
OTP="123456"

curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d "{\"number\":\"089509844606\",\"message\":\"🔐 Kode OTP Anda:\n\n*${OTP}*\n\nBerlaku 5 menit.\nJangan bagikan ke siapa pun!\"}"
```

---

## 🔵 8. Kirim Gambar (Media)

```bash
curl -X POST http://localhost:3000/send-media \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "media_url": "https://picsum.photos/500",
    "caption": "🖼️ Ini gambar random!"
  }'
```

### Kirim Gambar Spesifik:
```bash
curl -X POST http://localhost:3000/send-media \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "media_url": "https://via.placeholder.com/600x400.png?text=Promo+Spesial",
    "caption": "🎉 PROMO SPESIAL!\n\nDiskon 50% hari ini!"
  }'
```

---

## 🔵 9. Broadcast ke Banyak Nomor

```bash
curl -X POST http://localhost:3000/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "numbers": ["089509844606", "081234567890", "082345678901"],
    "message": "📢 BROADCAST MESSAGE\n\nIni pesan untuk semua!"
  }'
```

### Broadcast dengan Variable:
```bash
NOMOR1="089509844606"
NOMOR2="081234567890"
PESAN="Broadcast dari cURL!"

curl -X POST http://localhost:3000/broadcast \
  -H "Content-Type: application/json" \
  -d "{\"numbers\":[\"$NOMOR1\",\"$NOMOR2\"],\"message\":\"$PESAN\"}"
```

---

## 🔵 10. Kirim dari File JSON

### Buat file `message.json`:
```json
{
  "number": "089509844606",
  "message": "Halo dari file JSON!"
}
```

### Kirim:
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d @message.json
```

---

## 🔵 11. Loop - Kirim Banyak Pesan

```bash
for i in {1..5}; do
  curl -X POST http://localhost:3000/send \
    -H "Content-Type: application/json" \
    -d "{\"number\":\"089509844606\",\"message\":\"Pesan ke-$i\"}"
  
  echo "Pesan $i terkirim"
  sleep 2  # Delay 2 detik
done
```

---

## 🔵 12. Kirim ke Multiple Nomor (Loop)

```bash
NOMOR_LIST=("089509844606" "081234567890" "082345678901")

for nomor in "${NOMOR_LIST[@]}"; do
  curl -X POST http://localhost:3000/send \
    -H "Content-Type: application/json" \
    -d "{\"number\":\"$nomor\",\"message\":\"Halo! Pesan untuk $nomor\"}"
  
  echo "Terkirim ke $nomor"
  sleep 2
done
```

---

## 🔵 13. Cek Response & Save ke File

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"number":"089509844606","message":"Test"}' \
  -o response.json

cat response.json
```

---

## 🔵 14. Error Handling

```bash
response=$(curl -s -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"number":"089509844606","message":"Test"}')

success=$(echo $response | jq -r '.success')

if [ "$success" = "true" ]; then
  echo "✅ Pesan berhasil dikirim!"
else
  echo "❌ Gagal kirim pesan"
  echo $response | jq .
fi
```

---

## 🔵 15. Kirim dengan Timeout

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"number":"089509844606","message":"Test"}' \
  --max-time 10
```

---

## 🔵 16. Verbose Mode (Debug)

```bash
curl -v -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"number":"089509844606","message":"Test"}'
```

---

## 🔵 17. Silent Mode + Pretty JSON

```bash
curl -s -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"number":"089509844606","message":"Test"}' | jq .
```

---

## 🔵 18. Kirim Reminder Appointment

```bash
CUSTOMER_NAME="John Doe"
APPOINTMENT_DATE="10/07/2026"
APPOINTMENT_TIME="14:00"
LOCATION="Klinik ABC"

curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d "{
    \"number\": \"089509844606\",
    \"message\": \"📅 *REMINDER APPOINTMENT*\n\nHalo ${CUSTOMER_NAME}!\n\nAppointment Anda:\n📆 ${APPOINTMENT_DATE}\n🕐 ${APPOINTMENT_TIME}\n📍 ${LOCATION}\n\nJangan lupa hadir ya! 😊\"
  }"
```

---

## 🔵 19. Kirim Invoice

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "message": "🧾 *INVOICE*\n\nInvoice No: INV-001\nTanggal: 09/07/2026\n\n📦 Items:\n- Produk A: Rp 50.000\n- Produk B: Rp 100.000\n\n💰 Total: Rp 150.000\n\nTerima kasih!"
  }'
```

---

## 🔵 20. Kirim Tracking Pesanan

```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{
    "number": "089509844606",
    "message": "📦 *UPDATE PENGIRIMAN*\n\nPesanan Anda sedang dalam pengiriman!\n\n🚚 Kurir: JNE\n📋 Resi: JNE123456789\n📍 Status: Dalam Perjalanan\n\nEst. tiba: 1-2 hari"
  }'
```

---

## 🔵 21. Script Lengkap dengan Menu

```bash
#!/bin/bash

echo "WhatsApp Bot API - cURL Examples"
echo "================================="
echo "1. Kirim Pesan Sederhana"
echo "2. Kirim Pesan dengan Emoji"
echo "3. Kirim Gambar"
echo "4. Broadcast"
echo "5. Cek Status"
echo ""
read -p "Pilih (1-5): " pilihan

case $pilihan in
  1)
    curl -X POST http://localhost:3000/send \
      -H "Content-Type: application/json" \
      -d '{"number":"089509844606","message":"Test sederhana"}'
    ;;
  2)
    curl -X POST http://localhost:3000/send \
      -H "Content-Type: application/json" \
      -d '{"number":"089509844606","message":"👋 Test dengan emoji! ✅"}'
    ;;
  3)
    curl -X POST http://localhost:3000/send-media \
      -H "Content-Type: application/json" \
      -d '{"number":"089509844606","media_url":"https://picsum.photos/500","caption":"Gambar test"}'
    ;;
  4)
    curl -X POST http://localhost:3000/broadcast \
      -H "Content-Type: application/json" \
      -d '{"numbers":["089509844606"],"message":"Broadcast test"}'
    ;;
  5)
    curl http://localhost:3000/status | jq .
    ;;
  *)
    echo "Pilihan tidak valid"
    ;;
esac
```

---

## 🔵 22. One-Liner: Kirim Cepat

```bash
# Quick send
curl -X POST http://localhost:3000/send -H "Content-Type: application/json" -d '{"number":"089509844606","message":"Quick message!"}'

# Quick send dengan emoji
curl -X POST http://localhost:3000/send -H "Content-Type: application/json" -d '{"number":"089509844606","message":"👋 Hi!"}'
```

---

## 🔵 23. Kirim Pesan ke Nomor Anda

**GANTI `089509844606` dengan nomor Anda:**

```bash
NOMOR_ANDA="089509844606"  # <-- GANTI INI

curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d "{\"number\":\"$NOMOR_ANDA\",\"message\":\"🎉 Halo! Test pesan ke nomor saya sendiri.\"}"
```

---

## 📋 Template Format

### Format Dasar:
```bash
curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d '{"number":"NOMOR","message":"PESAN"}'
```

### Format dengan Variable:
```bash
NOMOR="089509844606"
PESAN="Isi pesan"

curl -X POST http://localhost:3000/send \
  -H "Content-Type: application/json" \
  -d "{\"number\":\"$NOMOR\",\"message\":\"$PESAN\"}"
```

---

## 🎯 Tips:

1. **Gunakan `jq`** untuk format JSON pretty:
   ```bash
   curl ... | jq .
   ```

2. **Silent mode** dengan `-s`:
   ```bash
   curl -s ...
   ```

3. **Save response** ke file:
   ```bash
   curl ... -o response.json
   ```

4. **Timeout** dengan `--max-time`:
   ```bash
   curl --max-time 10 ...
   ```

5. **Multi-line** dalam JSON:
   - Gunakan `\n` untuk baris baru
   - Contoh: `"Baris 1\n\nBaris 2"`

---

## 🚀 Copy-Paste Ready

**Kirim ke 089509844606:**
```bash
curl -X POST http://localhost:3000/send -H "Content-Type: application/json" -d '{"number":"089509844606","message":"👋 Test pesan dari cURL!"}'
```

**Cek Status:**
```bash
curl http://localhost:3000/status | jq .
```

**Kirim Gambar:**
```bash
curl -X POST http://localhost:3000/send-media -H "Content-Type: application/json" -d '{"number":"089509844606","media_url":"https://picsum.photos/500","caption":"Test gambar"}'
```

---

✅ **Siap digunakan!**

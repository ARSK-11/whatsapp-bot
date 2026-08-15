# 📚 Dokumentasi Perintah Bot WhatsApp

## 📝 Perintah Dasar

### `!ping`
Test koneksi bot untuk memastikan bot aktif dan merespon.

**Contoh:**
```
!ping
```
**Respon:**
```
🏓 Pong!
```

---

### `!help` atau `!menu`
Menampilkan daftar lengkap perintah yang tersedia.

**Contoh:**
```
!help
```

---

### `!info`
Menampilkan informasi tentang bot (versi, teknologi, dll).

**Contoh:**
```
!info
```

---

## 💬 Perintah Chat

### `!time`
Menampilkan waktu dan tanggal saat ini dengan format Indonesia.

**Contoh:**
```
!time
```
**Respon:**
```
🕐 Waktu sekarang:
Rabu, 9 Juli 2026 pukul 23.05.30 Waktu Indonesia Barat
```

---

### `!quote`
Menampilkan quote motivasi acak.

**Contoh:**
```
!quote
```
**Respon:**
```
💭 "Mimpi tanpa aksi hanyalah angan-angan." - Unknown
```

---

### `!say <teks>`
Bot akan mengulangi teks yang Anda kirim.

**Contoh:**
```
!say Halo dunia!
```
**Respon:**
```
🗣️ Halo dunia!
```

---

## 🎲 Perintah Hiburan

### `!dice`
Melempar dadu virtual (hasil 1-6).

**Contoh:**
```
!dice
```
**Respon:**
```
🎲 Dadu menunjukkan: *4*
```

---

### `!flip`
Melempar koin virtual (kepala atau ekor).

**Contoh:**
```
!flip
```
**Respon:**
```
Hasil lempar koin: *Kepala 🪙*
```

---

### `!joke`
Menampilkan lelucon acak.

**Contoh:**
```
!joke
```
**Respon:**
```
Kenapa programmer tidak pernah mati? Karena mereka selalu di-backup! 😄
```

---

## 🧮 Perintah Utilitas

### `!calc <ekspresi>` atau `!calculate <ekspresi>`
Kalkulator sederhana untuk operasi matematika.

**Contoh:**
```
!calc 10 + 5 * 2
```
**Respon:**
```
🧮 Hasil: 10 + 5 * 2 = *20*
```

**Operator yang didukung:**
- Penjumlahan: `+`
- Pengurangan: `-`
- Perkalian: `*`
- Pembagian: `/`
- Kurung: `(` dan `)`

---

## 🎨 Perintah Media

### `!sticker`
Membuat sticker dari gambar. Reply ke gambar dengan perintah ini.

**Cara menggunakan:**
1. Cari pesan yang berisi gambar
2. Reply pesan tersebut dengan teks `!sticker`
3. Bot akan membuat sticker dari gambar tersebut

**Contoh:**
```
[Reply ke gambar]
!sticker
```
**Respon:**
```
⏳ Membuat sticker...
[Sticker terkirim]
```

---

## 👥 Perintah Grup

### `!group`
Menampilkan informasi tentang grup (hanya bisa digunakan di grup).

**Contoh:**
```
!group
```
**Respon:**
```
📊 Info Grup

Nama: Keluarga Besar
Deskripsi: Grup keluarga tercinta
Jumlah Member: 15
Dibuat: 1/1/2025
```

---

### `!tagall` (Admin Only)
Mention semua member di grup. Hanya admin grup yang bisa menggunakan perintah ini.

**Contoh:**
```
!tagall
```
**Respon:**
```
📢 Pengumuman untuk semua member:

@user1 @user2 @user3 ...
```

---

## 🔒 Catatan Penting

1. Semua perintah **case insensitive** (tidak membedakan huruf besar/kecil)
2. Perintah dengan label **(Admin Only)** hanya bisa digunakan oleh admin grup
3. Beberapa perintah hanya bisa digunakan di grup, akan ada notifikasi jika digunakan di personal chat
4. Bot akan merespon di personal chat maupun di grup

---

## 🆕 Cara Menambah Perintah Baru

Edit file `index.js` dan tambahkan kondisi baru di event `message`:

```javascript
else if (command === '!perintahbaru') {
    await message.reply('Respon dari perintah baru!');
}
```

---

## 💡 Tips

- Gunakan `!help` kapanpun untuk melihat daftar perintah
- Pastikan bot sudah dalam status "ready" sebelum mengirim perintah
- Jika bot tidak merespon, cek koneksi internet dan restart bot

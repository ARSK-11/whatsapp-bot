# 🔧 Cara Extend Bot dengan Fitur Baru

## 📝 Menambah Perintah Sederhana

Edit `index.js` dan tambahkan di dalam event `client.on('message', async (message) => {...})`:

```javascript
else if (command === '!halo') {
    await message.reply('Halo juga! 👋');
}
```

## 🎲 Perintah dengan Parameter

```javascript
else if (command.startsWith('!nama ')) {
    const nama = message.body.slice(6); // ambil teks setelah "!nama "
    await message.reply(`Halo ${nama}! Senang berkenalan denganmu! 😊`);
}
```

**Contoh penggunaan:**
```
!nama Aris
```
**Bot reply:**
```
Halo Aris! Senang berkenalan denganmu! 😊
```

## 🔢 Perintah dengan Multiple Parameter

```javascript
else if (command.startsWith('!umur ')) {
    const parts = message.body.split(' ');
    const nama = parts[1];
    const umur = parts[2];
    
    if (nama && umur) {
        await message.reply(`${nama} berumur ${umur} tahun`);
    } else {
        await message.reply('Format: !umur [nama] [umur]');
    }
}
```

## 🖼️ Mengirim Gambar

```javascript
const { MessageMedia } = require('whatsapp-web.js');

else if (command === '!foto') {
    const media = MessageMedia.fromFilePath('./images/foto.jpg');
    await message.reply(media, { caption: 'Ini fotonya!' });
}
```

## 📄 Mengirim File

```javascript
else if (command === '!dokumen') {
    const media = MessageMedia.fromFilePath('./files/dokumen.pdf');
    await client.sendMessage(message.from, media, {
        sendMediaAsDocument: true,
        fileName: 'dokumen.pdf'
    });
}
```

## 🎤 Download Media dari Pesan

```javascript
else if (command === '!download') {
    if (message.hasMedia) {
        await message.reply('⏳ Mengunduh media...');
        const media = await message.downloadMedia();
        // Simpan atau proses media
        await message.reply('✅ Media berhasil diunduh!');
    } else {
        await message.reply('❌ Tidak ada media dalam pesan ini!');
    }
}
```

## 🔄 Reply ke Pesan Tertentu

```javascript
else if (command === '!reply') {
    if (message.hasQuotedMsg) {
        const quotedMsg = await message.getQuotedMessage();
        await message.reply(`Anda me-reply: "${quotedMsg.body}"`);
    } else {
        await message.reply('Reply pesan dengan !reply');
    }
}
```

## 👥 Cek Member Grup

```javascript
else if (command === '!members') {
    const chat = await message.getChat();
    if (chat.isGroup) {
        const members = chat.participants.length;
        await message.reply(`👥 Grup ini memiliki ${members} member`);
    } else {
        await message.reply('❌ Hanya bisa di grup!');
    }
}
```

## 🔒 Perintah Khusus Admin

```javascript
else if (command === '!broadcast') {
    const chat = await message.getChat();
    if (chat.isGroup) {
        const authorNumber = message.author || message.from;
        const author = chat.participants.find(p => p.id._serialized === authorNumber);
        
        if (author && author.isAdmin) {
            // Lakukan sesuatu
            await message.reply('✅ Broadcast terkirim!');
        } else {
            await message.reply('❌ Hanya admin!');
        }
    }
}
```

## ⏰ Perintah dengan Delay

```javascript
else if (command === '!countdown') {
    await message.reply('3...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await message.reply('2...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await message.reply('1...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await message.reply('🎉 Selesai!');
}
```

## 📊 Perintah dengan Data Array

```javascript
else if (command === '!random-food') {
    const foods = [
        'Nasi Goreng 🍳',
        'Mie Ayam 🍜',
        'Sate 串',
        'Bakso 🥣',
        'Gado-gado 🥗'
    ];
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    await message.reply(`Rekomendasi makanan: ${randomFood}`);
}
```

## 🌐 Menggunakan API Eksternal

```javascript
const axios = require('axios'); // install dulu: npm install axios

else if (command === '!cuaca') {
    try {
        await message.reply('⏳ Mengecek cuaca...');
        const response = await axios.get('https://api.example.com/weather');
        await message.reply(`☀️ Cuaca hari ini: ${response.data.weather}`);
    } catch (error) {
        await message.reply('❌ Gagal mendapatkan data cuaca');
    }
}
```

## 📝 Menyimpan Data User (Simple)

```javascript
// Di awal file
const userData = {};

// Perintah simpan
else if (command.startsWith('!simpan ')) {
    const text = message.body.slice(8);
    const userId = message.from;
    userData[userId] = text;
    await message.reply('✅ Data tersimpan!');
}

// Perintah ambil
else if (command === '!ambil') {
    const userId = message.from;
    const saved = userData[userId];
    if (saved) {
        await message.reply(`📝 Data Anda: ${saved}`);
    } else {
        await message.reply('❌ Belum ada data tersimpan');
    }
}
```

## 🎨 Membuat Button (WhatsApp Business API)

**Note:** Fitur button hanya tersedia untuk WhatsApp Business API, bukan WhatsApp Web.

```javascript
// Contoh untuk WA Business API (bukan whatsapp-web.js)
const buttons = [
    { id: 'btn1', title: 'Pilihan 1' },
    { id: 'btn2', title: 'Pilihan 2' }
];

const buttonMessage = {
    text: 'Pilih salah satu:',
    buttons: buttons,
    headerType: 1
};

await client.sendMessage(message.from, buttonMessage);
```

## 🔄 Auto Reply Pattern

```javascript
else if (message.body.toLowerCase().includes('halo')) {
    await message.reply('Halo juga! Ada yang bisa dibantu? 😊');
}

else if (message.body.toLowerCase().includes('terima kasih')) {
    await message.reply('Sama-sama! 🙏');
}
```

## 📋 Tips Best Practices

1. **Error Handling**: Selalu gunakan try-catch untuk operasi yang bisa gagal
   ```javascript
   try {
       // kode Anda
   } catch (error) {
       console.error(error);
       await message.reply('❌ Terjadi kesalahan!');
   }
   ```

2. **Rate Limiting**: Jangan spam pesan terlalu cepat
   ```javascript
   await new Promise(resolve => setTimeout(resolve, 1000)); // delay 1 detik
   ```

3. **Logging**: Log aktivitas untuk debugging
   ```javascript
   console.log(`[${new Date().toISOString()}] User ${contact.pushname}: ${message.body}`);
   ```

4. **Validasi Input**: Selalu validasi input user
   ```javascript
   if (!input || input.trim() === '') {
       await message.reply('❌ Input tidak valid!');
       return;
   }
   ```

5. **Modular Code**: Pisahkan logik ke fungsi terpisah
   ```javascript
   async function handlePingCommand(message) {
       await message.reply('🏓 Pong!');
   }
   
   // Gunakan:
   if (command === '!ping') {
       await handlePingCommand(message);
   }
   ```

## 📦 Package Berguna

```bash
# HTTP requests
npm install axios

# Database
npm install sqlite3
npm install mysql2
npm install mongodb

# Utilitas
npm install moment          # Date manipulation
npm install lodash          # Utility functions
npm install dotenv          # Environment variables

# Media processing
npm install sharp           # Image processing
npm install fluent-ffmpeg   # Video/audio processing
```

## 🎯 Contoh Proyek Lanjutan

1. **Bot Reminder**: Gunakan `node-schedule` untuk scheduling
2. **Bot Polling**: Buat polling/voting di grup
3. **Bot Translator**: Integrasi dengan Google Translate API
4. **Bot Weather**: Integrasi dengan OpenWeatherMap API
5. **Bot News**: Scraping berita dari website

---

Selamat bereksperimen! 🚀

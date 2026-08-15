const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('Scan QR code ini dengan WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot WhatsApp siap digunakan!');
});

client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil!');
});

client.on('auth_failure', msg => {
    console.error('❌ Autentikasi gagal:', msg);
});

client.on('message', async (message) => {
    const chat = await message.getChat();
    const contact = await message.getContact();

    console.log(`📨 Pesan dari ${contact.pushname || contact.number}: ${message.body}`);

    const command = message.body.toLowerCase();

    if (command === '!ping') {
        await message.reply('🏓 Pong!');
    }

    else if (command === '!help' || command === '!menu') {
        const helpText = `
🤖 *Bot WhatsApp - Daftar Perintah*

📝 *Perintah Dasar:*
• !ping - Test koneksi bot
• !help / !menu - Tampilkan menu ini
• !info - Info tentang bot
• !sticker - Buat sticker dari gambar (reply ke gambar)
• !group - Info tentang grup (hanya di grup)

💬 *Perintah Chat:*
• !quote - Quote pesan acak
• !time - Tampilkan waktu sekarang
• !tagall - Tag semua member (admin only)

📤 *Kirim Pesan:*
• !send [nomor] [pesan] - Kirim ke 1 nomor
• !broadcast [nomor1,nomor2] [pesan] - Kirim ke banyak nomor

🎲 *Hiburan:*
• !dice - Lempar dadu
• !flip - Lempar koin
• !joke - Cerita lelucon

Ketik perintah tanpa tanda kutip!
        `.trim();
        await message.reply(helpText);
    }

    else if (command === '!info') {
        await message.reply('🤖 Bot WhatsApp versi 1.0\n\nDibuat dengan whatsapp-web.js\n\nKetik !help untuk melihat perintah yang tersedia.');
    }

    else if (command === '!time') {
        const now = new Date();
        const timeStr = now.toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            dateStyle: 'full',
            timeStyle: 'long'
        });
        await message.reply(`🕐 Waktu sekarang:\n${timeStr}`);
    }

    else if (command === '!dice') {
        const result = Math.floor(Math.random() * 6) + 1;
        await message.reply(`🎲 Dadu menunjukkan: *${result}*`);
    }

    else if (command === '!flip') {
        const result = Math.random() < 0.5 ? 'Kepala 🪙' : 'Ekor 🪙';
        await message.reply(`Hasil lempar koin: *${result}*`);
    }

    else if (command === '!joke') {
        const jokes = [
            'Kenapa programmer tidak pernah mati? Karena mereka selalu di-backup! 😄',
            'Apa bedanya programmer dan tukang pos? Tukang pos kirim paket, programmer kirim packet! 📦',
            'Kenapa komputer kedinginan? Karena lupa tutup Windows! 🪟',
            'Programmer minum apa? Java! ☕',
            'Kenapa programmer suka gelap? Karena light mode menyakitkan mata! 🌙'
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        await message.reply(randomJoke);
    }

    else if (command === '!quote') {
        const quotes = [
            '"Kesempatan tidak datang dua kali, ambil saat ini." - Unknown',
            '"Mimpi tanpa aksi hanyalah angan-angan." - Unknown',
            '"Kegagalan adalah kesuksesan yang tertunda." - Unknown',
            '"Jangan menunggu waktu yang tepat, ciptakan waktunya." - Unknown',
            '"Perjalanan seribu mil dimulai dengan satu langkah." - Lao Tzu'
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        await message.reply(`💭 ${randomQuote}`);
    }

    else if (command === '!sticker') {
        if (message.hasQuotedMsg) {
            const quotedMsg = await message.getQuotedMessage();
            if (quotedMsg.hasMedia) {
                await message.reply('⏳ Membuat sticker...');
                const media = await quotedMsg.downloadMedia();
                await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
            } else {
                await message.reply('❌ Pesan yang di-reply harus berisi gambar!');
            }
        } else {
            await message.reply('❌ Reply ke gambar dengan perintah !sticker');
        }
    }

    else if (command === '!group') {
        if (chat.isGroup) {
            const groupInfo = `
📊 *Info Grup*

Nama: ${chat.name}
Deskripsi: ${chat.description || 'Tidak ada deskripsi'}
Jumlah Member: ${chat.participants.length}
Dibuat: ${new Date(chat.createdAt * 1000).toLocaleDateString('id-ID')}
            `.trim();
            await message.reply(groupInfo);
        } else {
            await message.reply('❌ Perintah ini hanya bisa digunakan di grup!');
        }
    }

    else if (command === '!tagall') {
        if (chat.isGroup) {
            const authorNumber = message.author || message.from;
            const author = chat.participants.find(p => p.id._serialized === authorNumber);

            if (author && author.isAdmin) {
                let mentions = [];
                let text = '📢 *Pengumuman untuk semua member:*\n\n';

                for (let participant of chat.participants) {
                    mentions.push(participant.id._serialized);
                    text += `@${participant.id.user} `;
                }

                await chat.sendMessage(text, { mentions });
            } else {
                await message.reply('❌ Hanya admin yang bisa menggunakan perintah ini!');
            }
        } else {
            await message.reply('❌ Perintah ini hanya bisa digunakan di grup!');
        }
    }

    else if (command.startsWith('!say ')) {
        const text = message.body.slice(5);
        await message.reply(`🗣️ ${text}`);
    }

    else if (command.startsWith('!calculate ') || command.startsWith('!calc ')) {
        const expression = message.body.split(' ').slice(1).join(' ');
        try {
            const allowedChars = /^[0-9+\-*/().\s]+$/;
            if (!allowedChars.test(expression)) {
                throw new Error('Karakter tidak valid');
            }
            const result = eval(expression);
            await message.reply(`🧮 Hasil: ${expression} = *${result}*`);
        } catch (error) {
            await message.reply('❌ Perhitungan tidak valid! Contoh: !calc 10 + 5 * 2');
        }
    }

    else if (command.startsWith('!send ')) {
        // Format: !send 628123456789 Halo ini pesan
        const parts = message.body.split(' ');

        if (parts.length < 3) {
            await message.reply('❌ Format salah!\n\nContoh:\n!send 628123456789 Halo ini pesan');
            return;
        }

        const targetNumber = parts[1];
        const text = parts.slice(2).join(' ');

        const numberId = targetNumber.includes('@c.us') ? targetNumber : `${targetNumber}@c.us`;

        try {
            await message.reply('⏳ Mengirim pesan...');
            await client.sendMessage(numberId, text);
            await message.reply(`✅ Pesan berhasil dikirim ke ${targetNumber}`);
            console.log(`📤 Pesan dikirim ke ${numberId}: ${text}`);
        } catch (error) {
            await message.reply('❌ Gagal mengirim pesan!\n\nPastikan:\n• Format nomor benar (628xxx)\n• Nomor terdaftar di WhatsApp');
            console.error('Error sending message:', error);
        }
    }

    else if (command.startsWith('!broadcast ')) {
        // Format: !broadcast 628111,628222,628333 Pesan broadcast
        const parts = message.body.split(' ');

        if (parts.length < 3) {
            await message.reply('❌ Format salah!\n\nContoh:\n!broadcast 628111,628222 Halo semua!');
            return;
        }

        const numbersString = parts[1];
        const text = parts.slice(2).join(' ');
        const numbers = numbersString.split(',').map(n => n.trim());

        await message.reply(`⏳ Mengirim broadcast ke ${numbers.length} nomor...`);

        let success = 0;
        let failed = 0;

        for (const number of numbers) {
            const numberId = number.includes('@c.us') ? number : `${number}@c.us`;

            try {
                await client.sendMessage(numberId, text);
                success++;
                console.log(`✅ Broadcast terkirim ke ${numberId}`);

                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                failed++;
                console.error(`❌ Gagal kirim ke ${numberId}:`, error.message);
            }
        }

        await message.reply(`📊 *Hasil Broadcast:*\n\n✅ Berhasil: ${success}\n❌ Gagal: ${failed}`);
    }
});

client.on('disconnected', (reason) => {
    console.log('❌ Client terputus:', reason);
});

console.log('🚀 Memulai bot WhatsApp...');
client.initialize();

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
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

client.on('ready', async () => {
    console.log('✅ Bot siap untuk mengirim media!\n');

    const nomorTujuan = '628123456789@c.us'; // Ganti dengan nomor tujuan

    try {
        // ============================================
        // CONTOH 1: Kirim Gambar dari File Lokal
        // ============================================

        console.log('📤 Mengirim gambar...');

        // Pastikan file ada di folder yang benar
        // const mediaGambar = MessageMedia.fromFilePath('./images/promo.jpg');
        // await client.sendMessage(nomorTujuan, mediaGambar, {
        //     caption: '🎉 Lihat promo spesial kami!'
        // });
        // console.log('✅ Gambar terkirim!\n');

        // ============================================
        // CONTOH 2: Kirim Gambar dari URL
        // ============================================

        console.log('📤 Mengirim gambar dari URL...');

        const mediaUrl = await MessageMedia.fromUrl(
            'https://via.placeholder.com/500x500.png?text=Promo+Spesial',
            { unsafeMime: true }
        );

        await client.sendMessage(nomorTujuan, mediaUrl, {
            caption: '🎉 Promo spesial hari ini!\n\nDiskon 50% untuk semua produk!'
        });

        console.log('✅ Gambar dari URL terkirim!\n');

        // Delay sebelum kirim berikutnya
        await new Promise(r => setTimeout(r, 2000));

        // ============================================
        // CONTOH 3: Kirim Dokumen/File
        // ============================================

        console.log('📤 Mengirim dokumen...');

        // const mediaDokumen = MessageMedia.fromFilePath('./files/katalog.pdf');
        // await client.sendMessage(nomorTujuan, mediaDokumen, {
        //     sendMediaAsDocument: true,
        //     fileName: 'Katalog_Produk_2026.pdf'
        // });
        // console.log('✅ Dokumen terkirim!\n');

        // ============================================
        // CONTOH 4: Kirim Multiple Media
        // ============================================

        console.log('📤 Mengirim multiple media...');

        const media1 = await MessageMedia.fromUrl(
            'https://via.placeholder.com/400x300.png?text=Produk+1'
        );
        const media2 = await MessageMedia.fromUrl(
            'https://via.placeholder.com/400x300.png?text=Produk+2'
        );

        await client.sendMessage(nomorTujuan, media1, {
            caption: '📦 Produk 1: Rp 100.000'
        });

        await new Promise(r => setTimeout(r, 1000));

        await client.sendMessage(nomorTujuan, media2, {
            caption: '📦 Produk 2: Rp 150.000'
        });

        console.log('✅ Multiple media terkirim!\n');

        // ============================================
        // CONTOH 5: Kirim dengan Base64
        // ============================================

        console.log('📤 Mengirim gambar dari base64...');

        // Contoh data base64 (gambar kecil 1x1 pixel)
        const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const mediaBase64 = new MessageMedia('image/png', base64Data, 'image.png');

        await client.sendMessage(nomorTujuan, mediaBase64, {
            caption: '🖼️ Gambar dari base64'
        });

        console.log('✅ Gambar base64 terkirim!\n');

        // ============================================
        // CONTOH 6: Broadcast Media ke Multiple Nomor
        // ============================================

        console.log('📤 Broadcast media ke multiple nomor...');

        const daftarNomor = [
            '628111111111@c.us',
            '628222222222@c.us',
            // Tambahkan nomor lainnya
        ];

        const mediaBroadcast = await MessageMedia.fromUrl(
            'https://via.placeholder.com/600x400.png?text=Broadcast+Promo'
        );

        for (const nomor of daftarNomor) {
            try {
                await client.sendMessage(nomor, mediaBroadcast, {
                    caption: '🎉 PROMO SPESIAL!\n\nDiskon 30% hari ini saja!'
                });
                console.log(`✅ Broadcast terkirim ke ${nomor}`);

                // Delay 2 detik
                await new Promise(r => setTimeout(r, 2000));
            } catch (error) {
                console.error(`❌ Gagal kirim ke ${nomor}:`, error.message);
            }
        }

        console.log('✅ Broadcast media selesai!\n');

        console.log('✨ Semua contoh pengiriman media selesai!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
});

client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil!');
});

client.on('auth_failure', msg => {
    console.error('❌ Autentikasi gagal:', msg);
});

console.log('🚀 Memulai bot...');
client.initialize();

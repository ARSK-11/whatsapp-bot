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

client.on('ready', async () => {
    console.log('✅ Bot siap!\n');

    // ============================================
    // CONTOH BROADCAST KE MULTIPLE NOMOR
    // ============================================

    const daftarCustomer = [
        { nama: 'Andi', nomor: '628111111111@c.us' },
        { nama: 'Budi', nomor: '628222222222@c.us' },
        { nama: 'Citra', nomor: '628333333333@c.us' },
        // Tambahkan customer lainnya
    ];

    const pesanBroadcast = `
🎉 *PROMO SPESIAL HARI INI!*

Dapatkan diskon hingga *50%* untuk semua produk!

⏰ Berlaku sampai: Hari ini jam 23:59
📱 Order sekarang: wa.me/628123456789

Terima kasih! 🙏
    `.trim();

    console.log(`📤 Memulai broadcast ke ${daftarCustomer.length} customer...\n`);

    let berhasil = 0;
    let gagal = 0;

    for (const customer of daftarCustomer) {
        try {
            // Personalisasi pesan dengan nama
            const pesanPersonal = `Halo ${customer.nama}! 👋\n\n${pesanBroadcast}`;

            await client.sendMessage(customer.nomor, pesanPersonal);

            console.log(`✅ Terkirim ke ${customer.nama} (${customer.nomor})`);
            berhasil++;

            // Delay 2 detik untuk menghindari spam detection
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.error(`❌ Gagal kirim ke ${customer.nama}: ${error.message}`);
            gagal++;
        }
    }

    console.log('\n📊 HASIL BROADCAST:');
    console.log(`✅ Berhasil: ${berhasil}`);
    console.log(`❌ Gagal: ${gagal}`);
    console.log('\n✨ Broadcast selesai!');

    // Disconnect setelah selesai (opsional)
    // await client.destroy();
});

client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil!');
});

client.on('auth_failure', msg => {
    console.error('❌ Autentikasi gagal:', msg);
});

console.log('🚀 Memulai bot...');
client.initialize();

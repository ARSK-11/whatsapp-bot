const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Gunakan session directory berbeda agar tidak konflik dengan bot utama
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth_temp' }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('⚠️  QR Code muncul - Bot perlu di-scan ulang:');
    console.log('');
    qrcode.generate(qr, { small: true });
    console.log('');
    console.log('Scan QR di atas dengan WhatsApp Anda.');
});

client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil!');
});

client.on('ready', async () => {
    console.log('✅ Bot siap!');
    console.log('');

    const nomorTujuan = '6289509844606@c.us';
    const pesan = `👋 Halo! Ini pesan test dari bot WhatsApp.

✅ Bot berhasil mengirim pesan ke 089509844606!

🤖 Dikirim otomatis via whatsapp-web.js
📅 ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    try {
        console.log(`📤 Mengirim ke 089509844606...`);
        await client.sendMessage(nomorTujuan, pesan);
        console.log('✅ BERHASIL! Pesan terkirim!');
        console.log('📱 Silakan cek WhatsApp di 089509844606');

        setTimeout(() => {
            console.log('\n✨ Selesai! Menutup bot...');
            process.exit(0);
        }, 3000);
    } catch (error) {
        console.error('❌ Gagal:', error.message);
        process.exit(1);
    }
});

client.on('auth_failure', msg => {
    console.error('❌ Auth gagal:', msg);
    process.exit(1);
});

client.on('disconnected', (reason) => {
    console.log('❌ Client terputus:', reason);
});

console.log('🚀 Memulai pengiriman pesan...');
console.log('📱 Target: 089509844606');
console.log('');
client.initialize().catch((error) => {
    console.error('❌ Gagal menjalankan bot:', error.message);
    process.exit(1);
});

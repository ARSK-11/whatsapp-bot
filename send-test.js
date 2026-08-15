const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('ready', async () => {
    console.log('✅ Bot siap mengirim pesan!\n');

    // Format nomor: 089509844606 → 6289509844606@c.us
    const nomorTujuan = '6289509844606@c.us';
    const pesan = '👋 Halo! Ini adalah pesan test dari bot WhatsApp.\n\n✅ Bot berhasil mengirim pesan langsung ke nomor Anda!';

    try {
        console.log(`📤 Mengirim pesan ke ${nomorTujuan}...`);

        await client.sendMessage(nomorTujuan, pesan);

        console.log('✅ Pesan berhasil dikirim!');
        console.log(`📱 Nomor: 089509844606`);
        console.log(`💬 Pesan: ${pesan}`);
        console.log('\n✨ Selesai!');

        // Tunggu 2 detik lalu tutup
        setTimeout(() => {
            process.exit(0);
        }, 2000);

    } catch (error) {
        console.error('❌ Gagal mengirim pesan!');
        console.error('Error:', error.message);
        process.exit(1);
    }
});

client.on('authenticated', () => {
    console.log('✅ Menggunakan session yang sudah ada...');
});

client.on('auth_failure', msg => {
    console.error('❌ Autentikasi gagal:', msg);
    process.exit(1);
});

console.log('🚀 Memulai pengiriman pesan...');
client.initialize();

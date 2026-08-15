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

client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil!');
});

client.on('ready', async () => {
    console.log('✅ Bot WhatsApp siap digunakan!');
    console.log('');

    // Nomor tujuan: 089509844606
    // Format: 62 + nomor tanpa 0 = 6289509844606
    const nomorTujuan = '6289509844606@c.us';

    const pesan = `👋 Halo! Ini adalah pesan test dari bot WhatsApp.

✅ Bot berhasil mengirim pesan langsung ke nomor Anda!

🤖 Pesan ini dikirim secara otomatis menggunakan whatsapp-web.js

📅 Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    try {
        console.log(`📤 Mengirim pesan ke 089509844606 (${nomorTujuan})...`);

        await client.sendMessage(nomorTujuan, pesan);

        console.log('✅ Pesan berhasil dikirim!');
        console.log('📱 Nomor: 089509844606');
        console.log('💬 Pesan terkirim!');
        console.log('');
        console.log('✨ Silakan cek WhatsApp Anda!');

        // Tunggu 3 detik lalu tutup bot
        setTimeout(() => {
            console.log('\n🔚 Menutup bot...');
            process.exit(0);
        }, 3000);

    } catch (error) {
        console.error('❌ Gagal mengirim pesan!');
        console.error('Error:', error.message);
        console.error('');
        console.error('💡 Pastikan:');
        console.error('   - Nomor 089509844606 terdaftar di WhatsApp');
        console.error('   - Tidak ada bot lain yang sedang running');
        console.error('   - Koneksi internet stabil');

        process.exit(1);
    }
});

client.on('auth_failure', msg => {
    console.error('❌ Autentikasi gagal:', msg);
    process.exit(1);
});

client.on('disconnected', (reason) => {
    console.log('❌ Client terputus:', reason);
});

console.log('🚀 Memulai bot untuk kirim pesan ke 089509844606...');
console.log('📱 Target: 089509844606 → 6289509844606@c.us');
console.log('');
client.initialize();

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

    // ========================================
    // CONTOH PENGGUNAAN: Kirim Pesan Langsung
    // ========================================

    // Format nomor: [kode negara][nomor]@c.us
    // Contoh Indonesia: 628123456789@c.us
    // Tanpa +, tanpa tanda minus, tanpa spasi

    // CONTOH 1: Kirim pesan teks sederhana
    const nomorTujuan = '628123456789@c.us'; // Ganti dengan nomor tujuan

    try {
        await client.sendMessage(nomorTujuan, '👋 Halo! Ini pesan otomatis dari bot WhatsApp.');
        console.log('✅ Pesan berhasil dikirim ke', nomorTujuan);
    } catch (error) {
        console.error('❌ Gagal mengirim pesan:', error.message);
    }

    // CONTOH 2: Kirim pesan ke multiple nomor
    const daftarNomor = [
        '628123456789@c.us',
        '628987654321@c.us',
        // Tambahkan nomor lainnya
    ];

    // Uncomment untuk menggunakan:
    /*
    for (const nomor of daftarNomor) {
        try {
            await client.sendMessage(nomor, '📢 Broadcast message dari bot!');
            console.log('✅ Pesan terkirim ke', nomor);

            // Delay 2 detik antar pesan (anti-spam)
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error('❌ Gagal kirim ke', nomor, ':', error.message);
        }
    }
    */
});

client.on('auth_failure', msg => {
    console.error('❌ Autentikasi gagal:', msg);
});

client.on('disconnected', (reason) => {
    console.log('❌ Client terputus:', reason);
});

console.log('🚀 Memulai bot WhatsApp...');
client.initialize();

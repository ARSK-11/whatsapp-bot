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
    console.log('✅ Bot siap untuk scheduled messages!\n');

    // ================================================
    // CONTOH 1: Kirim Pesan Setelah Delay Tertentu
    // ================================================

    const nomorTujuan = '628123456789@c.us';

    // Kirim setelah 5 detik
    setTimeout(async () => {
        try {
            await client.sendMessage(nomorTujuan, '⏰ Pesan terjadwal: 5 detik telah berlalu!');
            console.log('✅ Pesan delayed 5 detik terkirim');
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }, 5000);

    // ================================================
    // CONTOH 2: Reminder Berulang (Setiap 1 Jam)
    // ================================================

    setInterval(async () => {
        try {
            const waktu = new Date().toLocaleString('id-ID');
            await client.sendMessage(
                nomorTujuan,
                `⏰ *Reminder Otomatis*\n\nWaktu: ${waktu}\n\nJangan lupa istirahat! 💪`
            );
            console.log(`✅ Reminder terkirim pada ${waktu}`);
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }, 3600000); // 3600000 ms = 1 jam

    // ================================================
    // CONTOH 3: Kirim Pesan di Waktu Spesifik
    // ================================================

    function kirimDiWaktuTertentu(jam, menit, pesan, nomor) {
        const sekarang = new Date();
        const jadwal = new Date();
        jadwal.setHours(jam, menit, 0, 0);

        // Jika waktu sudah lewat hari ini, jadwalkan untuk besok
        if (jadwal <= sekarang) {
            jadwal.setDate(jadwal.getDate() + 1);
        }

        const delay = jadwal.getTime() - sekarang.getTime();

        console.log(`📅 Pesan dijadwalkan pada: ${jadwal.toLocaleString('id-ID')}`);

        setTimeout(async () => {
            try {
                await client.sendMessage(nomor, pesan);
                console.log(`✅ Pesan terjadwal terkirim pada ${new Date().toLocaleString('id-ID')}`);

                // Set ulang untuk hari berikutnya
                kirimDiWaktuTertentu(jam, menit, pesan, nomor);
            } catch (error) {
                console.error('❌ Error:', error.message);
            }
        }, delay);
    }

    // Kirim reminder setiap hari jam 08:00
    kirimDiWaktuTertentu(8, 0, '☀️ Selamat pagi! Semangat untuk hari ini! 💪', nomorTujuan);

    // Kirim reminder setiap hari jam 20:00
    kirimDiWaktuTertentu(20, 0, '🌙 Selamat malam! Jangan lupa istirahat yang cukup. 😴', nomorTujuan);

    // ================================================
    // CONTOH 4: Countdown Timer
    // ================================================

    async function kirimCountdown(nomor, detik) {
        console.log(`\n⏱️ Memulai countdown ${detik} detik...\n`);

        for (let i = detik; i > 0; i--) {
            await client.sendMessage(nomor, `⏰ ${i}...`);
            console.log(`Countdown: ${i}`);
            await new Promise(r => setTimeout(r, 1000));
        }

        await client.sendMessage(nomor, '🎉 Countdown selesai!');
        console.log('✅ Countdown selesai!');
    }

    // Uncomment untuk menjalankan countdown
    // kirimCountdown(nomorTujuan, 5);

    // ================================================
    // CONTOH 5: Schedule Berbasis Hari
    // ================================================

    function cekHariDanKirim() {
        const hari = new Date().getDay(); // 0 = Minggu, 1 = Senin, dst

        if (hari === 1) { // Senin
            client.sendMessage(
                nomorTujuan,
                '📅 *Reminder Senin*\n\nSelamat pagi! Semangat untuk minggu yang baru! 💪'
            ).then(() => console.log('✅ Reminder Senin terkirim'));
        } else if (hari === 5) { // Jumat
            client.sendMessage(
                nomorTujuan,
                '🎉 *Happy Friday!*\n\nSebentar lagi weekend! Semangat! 🎊'
            ).then(() => console.log('✅ Reminder Jumat terkirim'));
        }
    }

    // Cek setiap jam apakah perlu kirim reminder
    setInterval(cekHariDanKirim, 3600000); // Cek tiap 1 jam

    console.log('✅ Semua scheduled messages telah diatur!');
});

client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil!');
});

client.on('auth_failure', msg => {
    console.error('❌ Autentikasi gagal:', msg);
});

console.log('🚀 Memulai bot...');
client.initialize();

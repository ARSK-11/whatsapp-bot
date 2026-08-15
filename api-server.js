const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let isReady = false;
let qrCodeData = null;

// WhatsApp Events
client.on('qr', (qr) => {
    console.log('📱 QR Code Generated! Scan dengan WhatsApp:');
    qrcode.generate(qr, { small: true });
    qrCodeData = qr;
});

client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil!');
});

client.on('ready', () => {
    console.log('✅ WhatsApp Bot siap digunakan!');
    isReady = true;
    qrCodeData = null;
});

client.on('disconnected', (reason) => {
    console.log('❌ Bot terputus:', reason);
    isReady = false;
});

// Initialize WhatsApp
console.log('🚀 Memulai WhatsApp Bot API Server...');
client.initialize();

// ============================================
// API ROUTES
// ============================================

// 1. Health Check
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'WhatsApp Bot API Server',
        version: '1.0.0',
        whatsapp_ready: isReady,
        endpoints: {
            status: 'GET /status',
            send: 'POST /send',
            send_media: 'POST /send-media',
            broadcast: 'POST /broadcast',
            groups: 'GET /groups',
            send_group: 'POST /send-group',
            send_group_name: 'POST /send-group-name',
            qr: 'GET /qr'
        }
    });
});

// 2. Check Bot Status
app.get('/status', (req, res) => {
    res.json({
        ready: isReady,
        message: isReady ? 'Bot siap menerima pesan' : 'Bot belum siap atau perlu scan QR',
        timestamp: new Date().toISOString()
    });
});

// 3. Get QR Code (jika belum tersambung)
app.get('/qr', (req, res) => {
    if (qrCodeData) {
        res.json({
            success: true,
            qr: qrCodeData,
            message: 'Scan QR code ini dengan WhatsApp Anda'
        });
    } else if (isReady) {
        res.json({
            success: true,
            message: 'Bot sudah tersambung, tidak perlu scan QR'
        });
    } else {
        res.json({
            success: false,
            message: 'QR code belum tersedia, tunggu beberapa saat'
        });
    }
});

// 4. Send Message (ENDPOINT UTAMA)
app.post('/send', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(503).json({
                success: false,
                error: 'Bot belum siap. Cek /status atau /qr'
            });
        }

        const { number, message } = req.body;

        // Validasi input
        if (!number || !message) {
            return res.status(400).json({
                success: false,
                error: 'Parameter "number" dan "message" wajib diisi',
                example: {
                    number: '6289509844606',
                    message: 'Halo ini pesan test'
                }
            });
        }

        // Format nomor
        let formattedNumber = number.replace(/\D/g, ''); // Hapus non-digit

        // Jika diawali 0, ganti dengan 62
        if (formattedNumber.startsWith('0')) {
            formattedNumber = '62' + formattedNumber.substring(1);
        }

        // Jika tidak diawali 62, tambahkan 62 (asumsi Indonesia)
        if (!formattedNumber.startsWith('62')) {
            formattedNumber = '62' + formattedNumber;
        }

        const numberId = `${formattedNumber}@c.us`;

        console.log(`📤 Mengirim pesan ke ${numberId}...`);

        // Kirim pesan
        await client.sendMessage(numberId, message);

        console.log(`✅ Pesan terkirim ke ${number}`);

        res.json({
            success: true,
            message: 'Pesan berhasil dikirim',
            data: {
                to: number,
                formatted: numberId,
                message: message,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Gagal mengirim pesan',
            details: error.message
        });
    }
});

// 5. Send Media (Gambar/File)
app.post('/send-media', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(503).json({
                success: false,
                error: 'Bot belum siap'
            });
        }

        const { number, media_url, caption } = req.body;

        if (!number || !media_url) {
            return res.status(400).json({
                success: false,
                error: 'Parameter "number" dan "media_url" wajib diisi'
            });
        }

        // Format nomor
        let formattedNumber = number.replace(/\D/g, '');
        if (formattedNumber.startsWith('0')) {
            formattedNumber = '62' + formattedNumber.substring(1);
        }
        if (!formattedNumber.startsWith('62')) {
            formattedNumber = '62' + formattedNumber;
        }
        const numberId = `${formattedNumber}@c.us`;

        console.log(`📤 Mengirim media ke ${numberId}...`);

        // Download dan kirim media
        const media = await MessageMedia.fromUrl(media_url);
        await client.sendMessage(numberId, media, {
            caption: caption || ''
        });

        console.log(`✅ Media terkirim ke ${number}`);

        res.json({
            success: true,
            message: 'Media berhasil dikirim',
            data: {
                to: number,
                media_url: media_url,
                caption: caption || '',
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Gagal mengirim media',
            details: error.message
        });
    }
});

// 6. Broadcast (Kirim ke banyak nomor)
app.post('/broadcast', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(503).json({
                success: false,
                error: 'Bot belum siap'
            });
        }

        const { numbers, message } = req.body;

        // Validasi
        if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Parameter "numbers" harus berupa array',
                example: {
                    numbers: ['6289509844606', '6281234567890'],
                    message: 'Broadcast message'
                }
            });
        }

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Parameter "message" wajib diisi'
            });
        }

        console.log(`📤 Broadcast ke ${numbers.length} nomor...`);

        const results = [];

        for (const number of numbers) {
            try {
                // Format nomor
                let formattedNumber = number.replace(/\D/g, '');
                if (formattedNumber.startsWith('0')) {
                    formattedNumber = '62' + formattedNumber.substring(1);
                }
                if (!formattedNumber.startsWith('62')) {
                    formattedNumber = '62' + formattedNumber;
                }
                const numberId = `${formattedNumber}@c.us`;

                await client.sendMessage(numberId, message);

                results.push({
                    number: number,
                    status: 'success'
                });

                console.log(`✅ Terkirim ke ${number}`);

                // Delay 2 detik antar pesan (anti-spam)
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                results.push({
                    number: number,
                    status: 'failed',
                    error: error.message
                });
                console.error(`❌ Gagal ke ${number}: ${error.message}`);
            }
        }

        const successCount = results.filter(r => r.status === 'success').length;
        const failedCount = results.filter(r => r.status === 'failed').length;

        res.json({
            success: true,
            message: 'Broadcast selesai',
            summary: {
                total: numbers.length,
                success: successCount,
                failed: failedCount
            },
            results: results,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Gagal broadcast',
            details: error.message
        });
    }
});

// 7. Get All Groups (List Grup)
app.get('/groups', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(503).json({
                success: false,
                error: 'Bot belum siap'
            });
        }

        const chats = await client.getChats();
        const groups = chats.filter(chat => chat.isGroup);

        const groupList = groups.map(group => ({
            id: group.id._serialized,
            name: group.name,
            participants: group.participants ? group.participants.length : 0,
            description: group.description || ''
        }));

        console.log(`📊 Ditemukan ${groupList.length} grup`);

        res.json({
            success: true,
            message: `Ditemukan ${groupList.length} grup`,
            count: groupList.length,
            groups: groupList
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Gagal mendapatkan daftar grup',
            details: error.message
        });
    }
});

// 8. Send to Group (Kirim ke Grup)
app.post('/send-group', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(503).json({
                success: false,
                error: 'Bot belum siap'
            });
        }

        const { group_id, message } = req.body;

        // Validasi
        if (!group_id || !message) {
            return res.status(400).json({
                success: false,
                error: 'Parameter "group_id" dan "message" wajib diisi',
                help: 'Gunakan GET /groups untuk mendapatkan daftar group_id'
            });
        }

        console.log(`📤 Mengirim pesan ke grup ${group_id}...`);

        // Kirim pesan ke grup
        await client.sendMessage(group_id, message);

        console.log(`✅ Pesan terkirim ke grup`);

        res.json({
            success: true,
            message: 'Pesan berhasil dikirim ke grup',
            data: {
                group_id: group_id,
                message: message,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Gagal mengirim pesan ke grup',
            details: error.message,
            help: 'Pastikan group_id valid. Gunakan GET /groups untuk mendapatkan daftar grup'
        });
    }
});

// 9. Send to Group by Name (Kirim ke Grup berdasarkan Nama)
app.post('/send-group-name', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(503).json({
                success: false,
                error: 'Bot belum siap'
            });
        }

        const { group_name, message } = req.body;

        // Validasi
        if (!group_name || !message) {
            return res.status(400).json({
                success: false,
                error: 'Parameter "group_name" dan "message" wajib diisi',
                example: {
                    group_name: 'Keluarga',
                    message: 'Halo semua!'
                }
            });
        }

        console.log(`🔍 Mencari grup dengan nama: ${group_name}...`);

        // Cari grup berdasarkan nama
        const chats = await client.getChats();
        const group = chats.find(chat =>
            chat.isGroup &&
            chat.name.toLowerCase().includes(group_name.toLowerCase())
        );

        if (!group) {
            return res.status(404).json({
                success: false,
                error: `Grup dengan nama "${group_name}" tidak ditemukan`,
                help: 'Gunakan GET /groups untuk melihat daftar grup'
            });
        }

        console.log(`✅ Grup ditemukan: ${group.name} (${group.id._serialized})`);
        console.log(`📤 Mengirim pesan...`);

        // Kirim pesan
        await client.sendMessage(group.id._serialized, message);

        console.log(`✅ Pesan terkirim ke grup ${group.name}`);

        res.json({
            success: true,
            message: 'Pesan berhasil dikirim ke grup',
            data: {
                group_id: group.id._serialized,
                group_name: group.name,
                message: message,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Gagal mengirim pesan ke grup',
            details: error.message
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('🚀 WhatsApp Bot API Server berjalan!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log('');
    console.log('📚 Endpoints:');
    console.log(`   GET  http://localhost:${PORT}/               - Info API`);
    console.log(`   GET  http://localhost:${PORT}/status         - Cek status bot`);
    console.log(`   GET  http://localhost:${PORT}/qr             - Dapatkan QR code`);
    console.log(`   POST http://localhost:${PORT}/send           - Kirim pesan`);
    console.log(`   POST http://localhost:${PORT}/send-media     - Kirim media`);
    console.log(`   POST http://localhost:${PORT}/broadcast      - Broadcast`);
    console.log(`   GET  http://localhost:${PORT}/groups         - List grup`);
    console.log(`   POST http://localhost:${PORT}/send-group     - Kirim ke grup (by ID)`);
    console.log(`   POST http://localhost:${PORT}/send-group-name - Kirim ke grup (by name)`);
    console.log('');
    console.log('💡 Contoh penggunaan:');
    console.log('   curl -X POST http://localhost:3000/send \\');
    console.log('        -H "Content-Type: application/json" \\');
    console.log('        -d \'{"number":"089509844606","message":"Test"}\'');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
});

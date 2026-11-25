const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');

const { toChatId, toGroupId } = require('./utils/phone');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

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
let qrImageData = null;

// WhatsApp Events
client.on('qr', async (qr) => {
    console.log('📱 QR Code Generated! Scan dengan WhatsApp:');
    qrcode.generate(qr, { small: true });
    qrCodeData = qr;

    try {
        qrImageData = await QRCode.toDataURL(qr, { width: 360, margin: 2 });
        console.log(`🖼️  Buka http://localhost:${PORT}/qr-page di browser untuk scan QR.`);
    } catch (error) {
        qrImageData = null;
        console.error('⚠️  Gagal membuat gambar QR:', error.message);
    }
});

client.on('authenticated', () => {
    console.log('✅ Autentikasi berhasil!');
});

client.on('ready', () => {
    console.log('✅ WhatsApp Bot siap digunakan!');
    isReady = true;
    qrCodeData = null;
    qrImageData = null;
});

client.on('disconnected', (reason) => {
    console.log('❌ Bot terputus:', reason);
    isReady = false;
});

client.on('auth_failure', (message) => {
    console.error('❌ Autentikasi gagal:', message);
    isReady = false;
});

// Initialize WhatsApp
console.log('🚀 Memulai WhatsApp Bot API Server...');
client.initialize().catch((error) => {
    console.error('❌ Gagal menjalankan WhatsApp client:', error.message);
    process.exit(1);
});

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
            qr: 'GET /qr',
            qr_page: 'GET /qr-page'
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
            qr_image: qrImageData,
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

// 3b. Halaman scan QR (buka di browser)
app.get('/qr-page', (req, res) => {
    res.type('html').send(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Scan QR - WhatsApp Bot</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; background: #f0f2f5; margin: 0;
         display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .card { background: #fff; border-radius: 16px; padding: 32px 40px; text-align: center;
          box-shadow: 0 8px 30px rgba(0,0,0,.12); max-width: 420px; }
  h1 { font-size: 20px; margin: 0 0 8px; }
  p { color: #667781; font-size: 14px; margin: 8px 0 20px; line-height: 1.5; }
  img { width: 300px; height: 300px; image-rendering: pixelated; }
  .ok { color: #16a34a; font-weight: 600; font-size: 18px; }
  .hint { font-size: 12px; color: #8696a0; margin-top: 16px; }
</style>
</head>
<body>
  <div class="card">
    <h1>Hubungkan WhatsApp</h1>
    <p>Buka WhatsApp di HP &rarr; <b>Perangkat Tertaut</b> &rarr; <b>Tautkan Perangkat</b>, lalu scan QR di bawah.</p>
    <div id="content"><p>Memuat QR...</p></div>
    <div class="hint" id="hint">Halaman ini memperbarui QR otomatis.</div>
  </div>
<script>
  let lastQr = null;
  async function refresh() {
    try {
      const res = await fetch('/qr', { cache: 'no-store' });
      const data = await res.json();
      const content = document.getElementById('content');
      if (data.qr_image) {
        if (data.qr_image !== lastQr) {
          lastQr = data.qr_image;
          content.innerHTML = '<img alt="QR WhatsApp" src="' + data.qr_image + '">';
        }
      } else if (data.success && !data.qr) {
        content.innerHTML = '<p class="ok">✅ WhatsApp sudah tersambung!</p>';
        document.getElementById('hint').textContent = 'Tidak perlu scan QR lagi.';
      } else {
        content.innerHTML = '<p>Menunggu QR dari WhatsApp...</p>';
      }
    } catch (e) {
      document.getElementById('content').innerHTML = '<p>Gagal memuat QR. Coba refresh halaman.</p>';
    }
  }
  refresh();
  setInterval(refresh, 3000);
</script>
</body>
</html>`);
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

        const { number, message } = req.body || {};

        // Validasi input
        if (number === undefined || number === null || number === '' ||
            message === undefined || message === null || String(message).trim() === '') {
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
        let numberId;
        try {
            numberId = toChatId(number);
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message,
                example: { number: '089509844606' }
            });
        }

        const text = String(message);

        console.log(`📤 Mengirim pesan ke ${numberId}...`);

        // Kirim pesan
        await client.sendMessage(numberId, text);

        console.log(`✅ Pesan terkirim ke ${number}`);

        res.json({
            success: true,
            message: 'Pesan berhasil dikirim',
            data: {
                to: number,
                formatted: numberId,
                message: text,
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

        const { number, media_url, caption } = req.body || {};

        if (number === undefined || number === null || number === '' ||
            media_url === undefined || media_url === null || media_url === '') {
            return res.status(400).json({
                success: false,
                error: 'Parameter "number" dan "media_url" wajib diisi'
            });
        }

        // Validasi URL media
        let mediaUrl;
        try {
            mediaUrl = new URL(String(media_url));
            if (!['http:', 'https:'].includes(mediaUrl.protocol)) {
                throw new Error('Protokol harus http atau https');
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: `Parameter "media_url" tidak valid: ${error.message}`
            });
        }

        // Format nomor
        let numberId;
        try {
            numberId = toChatId(number);
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        const mediaCaption = caption === undefined || caption === null ? '' : String(caption);

        console.log(`📤 Mengirim media ke ${numberId}...`);

        // Download dan kirim media
        const media = await MessageMedia.fromUrl(mediaUrl.href, { unsafeMime: true });
        await client.sendMessage(numberId, media, {
            caption: mediaCaption
        });

        console.log(`✅ Media terkirim ke ${number}`);

        res.json({
            success: true,
            message: 'Media berhasil dikirim',
            data: {
                to: number,
                media_url: mediaUrl.href,
                caption: mediaCaption,
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

        const { numbers, message } = req.body || {};

        // Validasi
        if (!Array.isArray(numbers) || numbers.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Parameter "numbers" harus berupa array',
                example: {
                    numbers: ['6289509844606', '6281234567890'],
                    message: 'Broadcast message'
                }
            });
        }

        if (message === undefined || message === null || String(message).trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Parameter "message" wajib diisi'
            });
        }

        const text = String(message);

        console.log(`📤 Broadcast ke ${numbers.length} nomor...`);

        const results = [];

        for (const number of numbers) {
            try {
                // Format nomor
                const numberId = toChatId(number);

                await client.sendMessage(numberId, text);

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
            success: successCount > 0,
            message: successCount > 0 ? 'Broadcast selesai' : 'Broadcast gagal dikirim ke semua nomor',
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

        const { group_id, message } = req.body || {};

        // Validasi
        if (group_id === undefined || group_id === null || group_id === '' ||
            message === undefined || message === null || String(message).trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Parameter "group_id" dan "message" wajib diisi',
                help: 'Gunakan GET /groups untuk mendapatkan daftar group_id'
            });
        }

        let groupId;
        try {
            groupId = toGroupId(group_id);
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        const text = String(message);

        console.log(`📤 Mengirim pesan ke grup ${groupId}...`);

        // Kirim pesan ke grup
        await client.sendMessage(groupId, text);

        console.log(`✅ Pesan terkirim ke grup`);

        res.json({
            success: true,
            message: 'Pesan berhasil dikirim ke grup',
            data: {
                group_id: groupId,
                message: text,
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

        const { group_name, message } = req.body || {};

        // Validasi
        if (group_name === undefined || group_name === null || String(group_name).trim() === '' ||
            message === undefined || message === null || String(message).trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Parameter "group_name" dan "message" wajib diisi',
                example: {
                    group_name: 'Keluarga',
                    message: 'Halo semua!'
                }
            });
        }

        const groupName = String(group_name);
        const text = String(message);

        console.log(`🔍 Mencari grup dengan nama: ${groupName}...`);

        // Cari grup berdasarkan nama
        const chats = await client.getChats();
        const group = chats.find(chat =>
            chat.isGroup &&
            (chat.name || '').toLowerCase().includes(groupName.toLowerCase())
        );

        if (!group) {
            return res.status(404).json({
                success: false,
                error: `Grup dengan nama "${groupName}" tidak ditemukan`,
                help: 'Gunakan GET /groups untuk melihat daftar grup'
            });
        }

        console.log(`✅ Grup ditemukan: ${group.name} (${group.id._serialized})`);
        console.log(`📤 Mengirim pesan...`);

        // Kirim pesan
        await client.sendMessage(group.id._serialized, text);

        console.log(`✅ Pesan terkirim ke grup ${group.name}`);

        res.json({
            success: true,
            message: 'Pesan berhasil dikirim ke grup',
            data: {
                group_id: group.id._serialized,
                group_name: group.name,
                message: text,
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

// ============================================
// 404 & ERROR HANDLER
// ============================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Endpoint ${req.method} ${req.path} tidak ditemukan`,
        help: 'Lihat GET / untuk daftar endpoint yang tersedia'
    });
});

app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    if (res.headersSent) {
        return next(error);
    }
    res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan pada server',
        details: error.message
    });
});

// Start Server
const server = app.listen(PORT, () => {
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
    console.log(`   GET  http://localhost:${PORT}/qr-page        - Scan QR via browser`);
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

// Graceful shutdown agar session WhatsApp tidak korup
let shuttingDown = false;

async function shutdown(signal) {
    if (shuttingDown) {
        return;
    }
    shuttingDown = true;

    console.log(`\n🛑 Menerima ${signal}, menutup server...`);

    const forceExit = setTimeout(() => {
        console.error('⚠️  Penutupan terlalu lama, memaksa keluar.');
        process.exit(1);
    }, 10000);
    forceExit.unref();

    server.close(async () => {
        try {
            await client.destroy();
        } catch (error) {
            console.error('❌ Gagal menutup WhatsApp client:', error.message);
        }
        clearTimeout(forceExit);
        console.log('✅ Server ditutup dengan rapi.');
        process.exit(0);
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled promise rejection:', reason);
});

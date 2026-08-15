module.exports = {
    botName: 'WhatsApp Bot',
    version: '1.0.0',

    // Prefix untuk perintah (bisa diganti sesuai keinginan)
    prefix: '!',

    // Pesan sambutan saat bot siap
    readyMessage: '✅ Bot WhatsApp siap digunakan!',

    // Timezone
    timezone: 'Asia/Jakarta',

    // Pengaturan Puppeteer
    puppeteerOptions: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    },

    // Fitur yang diaktifkan
    features: {
        autoReply: true,
        groupCommands: true,
        stickerMaker: true,
        adminOnly: ['tagall'], // Perintah yang hanya bisa digunakan admin
    },

    // Pesan default
    messages: {
        adminOnly: '❌ Hanya admin yang bisa menggunakan perintah ini!',
        groupOnly: '❌ Perintah ini hanya bisa digunakan di grup!',
        error: '❌ Terjadi kesalahan saat memproses perintah!',
        processing: '⏳ Memproses...',
    }
};

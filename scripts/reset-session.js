'use strict';

// Menghapus session WhatsApp lama agar bot menampilkan QR baru.
// Folder lama TIDAK dihapus permanen, tapi di-rename menjadi .bak-<timestamp>.

const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const targets = ['.wwebjs_auth', '.wwebjs_auth_temp'];

let moved = 0;

for (const target of targets) {
    const fullPath = path.join(projectDir, target);

    if (!fs.existsSync(fullPath)) {
        continue;
    }

    const backupPath = `${fullPath}.bak-${Date.now()}`;
    fs.renameSync(fullPath, backupPath);
    console.log(`✅ ${target} -> ${path.basename(backupPath)}`);
    moved++;
}

if (moved === 0) {
    console.log('ℹ️  Tidak ada session lama yang perlu dihapus.');
} else {
    console.log('');
    console.log('Session lama sudah dipindahkan. Jalankan bot lagi lalu scan QR baru:');
    console.log('   npm start      (bot chat)');
    console.log('   npm run api    (REST API)');
    console.log('');
    console.log('Jika sudah yakin tidak dibutuhkan, folder *.bak-* boleh dihapus.');
}

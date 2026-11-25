// Script sederhana untuk membuat file pengiriman pesan ke 089509844606
// Jalankan: node kirim-pesan-simple.js

const fs = require('fs');
const path = require('path');

const projectDir = __dirname;
const sourcePath = path.join(projectDir, 'send-direct.js');
const targetPath = path.join(projectDir, 'send-to-089509844606.js');

console.log('📤 CARA MENGIRIM PESAN KE 089509844606:\n');
console.log('Karena bot sudah aktif, gunakan salah satu cara berikut:\n');

console.log('🔵 CARA 1: Gunakan Perintah Bot');
console.log('   Kirim pesan WhatsApp ke nomor bot Anda:');
console.log('   !send 6289509844606 Halo, ini pesan test!\n');

console.log('🔵 CARA 2: Via Kode (bot harus restart)');
console.log('   1. Stop bot yang sedang berjalan');
console.log('   2. Edit file send-direct.js');
console.log('   3. Ganti nomor ke: 6289509844606@c.us');
console.log('   4. Jalankan: node send-direct.js\n');

console.log('📋 FORMAT NOMOR: 089509844606 → 6289509844606@c.us\n');

console.log('💡 TIPS:');
console.log('   - Nomor harus terdaftar di WhatsApp');
console.log('   - Format: 62 + nomor tanpa 0 + @c.us');
console.log('   - Contoh: 6289509844606@c.us\n');

if (!fs.existsSync(sourcePath)) {
    console.error(`❌ File sumber tidak ditemukan: ${sourcePath}`);
    process.exit(1);
}

let content = fs.readFileSync(sourcePath, 'utf8');

// Ganti nomor default dengan nomor baru
const withNumber = content.replace(
    /const nomorTujuan = '.*?@c\.us'/,
    "const nomorTujuan = '6289509844606@c.us'"
);

// Ganti pesan default
const withMessage = withNumber.replace(
    /await client\.sendMessage\(nomorTujuan, '.*?'\);/s,
    "await client.sendMessage(nomorTujuan, '👋 Halo! Ini pesan test dari bot WhatsApp.\\n\\n✅ Bot berhasil kirim pesan langsung!');"
);

if (withNumber === content || withMessage === withNumber) {
    console.warn('⚠️  Sebagian pola tidak ditemukan di send-direct.js, file tetap dibuat.');
}

fs.writeFileSync(targetPath, withMessage);

console.log(`✅ File ${path.basename(targetPath)} telah dibuat!`);
console.log('📝 Untuk mengirim pesan otomatis:');
console.log('   1. Pastikan tidak ada bot lain yang running');
console.log('   2. Jalankan: node send-to-089509844606.js\n');

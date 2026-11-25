'use strict';

const DEFAULT_COUNTRY_CODE = '62';

/**
 * Mengubah input nomor apa pun menjadi chat id WhatsApp.
 *
 * Contoh:
 *   toChatId('089509844606')          -> '6289509844606@c.us'
 *   toChatId('+62 895-0984-4606')     -> '6289509844606@c.us'
 *   toChatId('6289509844606@c.us')    -> '6289509844606@c.us'
 *   toChatId('1234567890@g.us')       -> '1234567890@g.us'
 *
 * @param {string|number} input Nomor telepon atau chat id yang sudah jadi
 * @param {string} countryCode Kode negara default (tanpa tanda +)
 * @returns {string} chat id siap dipakai client.sendMessage()
 */
function toChatId(input, countryCode = DEFAULT_COUNTRY_CODE) {
    if (input === null || input === undefined) {
        throw new Error('Nomor tidak boleh kosong');
    }

    const raw = String(input).trim();

    if (!raw) {
        throw new Error('Nomor tidak boleh kosong');
    }

    // Sudah berupa chat id (kontak, grup, atau lid) -> biarkan apa adanya
    if (/@(c\.us|g\.us|lid|broadcast)$/i.test(raw)) {
        return raw;
    }

    let digits = raw.replace(/\D/g, '');

    if (!digits) {
        throw new Error(`Nomor tidak valid: "${raw}"`);
    }

    // Nomor yang diawali "+" dianggap sudah memuat kode negara
    const hasExplicitCountryCode = raw.startsWith('+');

    if (digits.startsWith('0')) {
        // 0895... -> 62895...
        digits = countryCode + digits.slice(1);
    } else if (!hasExplicitCountryCode && !digits.startsWith(countryCode)) {
        // 895... -> 62895...
        digits = countryCode + digits;
    }

    // Panjang nomor E.164 adalah 8-15 digit
    if (digits.length < 8 || digits.length > 15) {
        throw new Error(`Nomor tidak valid: "${raw}"`);
    }

    return `${digits}@c.us`;
}

/**
 * Memastikan sebuah group id tidak kosong.
 * Group id WhatsApp berakhiran "@g.us" (didapat dari GET /groups).
 *
 * @param {string} input
 * @returns {string}
 */
function toGroupId(input) {
    if (input === null || input === undefined) {
        throw new Error('group_id tidak boleh kosong');
    }

    const raw = String(input).trim();

    if (!raw) {
        throw new Error('group_id tidak boleh kosong');
    }

    return raw;
}

module.exports = {
    DEFAULT_COUNTRY_CODE,
    toChatId,
    toGroupId
};

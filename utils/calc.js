'use strict';

/**
 * Evaluator aritmatika sederhana yang aman (tanpa eval / Function).
 *
 * Mendukung: + - * / % ( ), bilangan desimal, dan tanda minus di depan.
 *
 * @param {string} expression contoh: "10 + 5 * 2"
 * @returns {number}
 */
function evaluateExpression(expression) {
    if (expression === null || expression === undefined) {
        throw new Error('Ekspresi kosong');
    }

    const src = String(expression).replace(/\s+/g, '');

    if (!src) {
        throw new Error('Ekspresi kosong');
    }

    if (!/^[0-9+\-*/().%]+$/.test(src)) {
        throw new Error('Ekspresi mengandung karakter tidak valid');
    }

    let pos = 0;

    function eat(char) {
        if (src[pos] === char) {
            pos++;
            return true;
        }
        return false;
    }

    function parseExpression() {
        let value = parseTerm();

        while (true) {
            if (eat('+')) {
                value += parseTerm();
            } else if (eat('-')) {
                value -= parseTerm();
            } else {
                return value;
            }
        }
    }

    function parseTerm() {
        let value = parseFactor();

        while (true) {
            if (eat('*')) {
                value *= parseFactor();
            } else if (eat('/')) {
                const divisor = parseFactor();
                if (divisor === 0) {
                    throw new Error('Pembagian dengan nol tidak diperbolehkan');
                }
                value /= divisor;
            } else if (eat('%')) {
                const divisor = parseFactor();
                if (divisor === 0) {
                    throw new Error('Modulo dengan nol tidak diperbolehkan');
                }
                value %= divisor;
            } else {
                return value;
            }
        }
    }

    function parseFactor() {
        if (eat('+')) {
            return parseFactor();
        }

        if (eat('-')) {
            return -parseFactor();
        }

        if (eat('(')) {
            const value = parseExpression();
            if (!eat(')')) {
                throw new Error('Tanda kurung tutup tidak ditemukan');
            }
            return value;
        }

        return parseNumber();
    }

    function parseNumber() {
        const start = pos;

        while (pos < src.length && /[0-9.]/.test(src[pos])) {
            pos++;
        }

        if (start === pos) {
            throw new Error('Angka tidak ditemukan');
        }

        const text = src.slice(start, pos);

        if ((text.match(/\./g) || []).length > 1) {
            throw new Error('Format angka tidak valid');
        }

        return parseFloat(text);
    }

    const result = parseExpression();

    if (pos !== src.length) {
        throw new Error('Ekspresi tidak valid');
    }

    if (!Number.isFinite(result)) {
        throw new Error('Hasil perhitungan tidak valid');
    }

    return result;
}

module.exports = { evaluateExpression };

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { toChatId, toGroupId } = require('../utils/phone');
const { evaluateExpression } = require('../utils/calc');

test('toChatId: nomor lokal diawali 0', () => {
    assert.equal(toChatId('089509844606'), '6289509844606@c.us');
});

test('toChatId: nomor dengan +62, spasi, dan strip', () => {
    assert.equal(toChatId('+62 895-0984-4606'), '6289509844606@c.us');
});

test('toChatId: nomor tanpa kode negara', () => {
    assert.equal(toChatId('89509844606'), '6289509844606@c.us');
});

test('toChatId: input berupa angka (number)', () => {
    assert.equal(toChatId(6289509844606), '6289509844606@c.us');
});

test('toChatId: nomor internasional dengan + tidak ditambah 62', () => {
    assert.equal(toChatId('+1 415 555 2671'), '14155552671@c.us');
});

test('toChatId: chat id yang sudah jadi tidak diubah', () => {
    assert.equal(toChatId('6289509844606@c.us'), '6289509844606@c.us');
    assert.equal(toChatId('1234567890@g.us'), '1234567890@g.us');
});

test('toChatId: input tidak valid melempar error', () => {
    assert.throws(() => toChatId(''), /kosong/);
    assert.throws(() => toChatId(null), /kosong/);
    assert.throws(() => toChatId('abc'), /tidak valid/);
    assert.throws(() => toChatId('123'), /tidak valid/);
});

test('toGroupId: menolak nilai kosong', () => {
    assert.equal(toGroupId('1234567890@g.us'), '1234567890@g.us');
    assert.throws(() => toGroupId(''), /kosong/);
    assert.throws(() => toGroupId(undefined), /kosong/);
});

test('evaluateExpression: operator dan prioritas', () => {
    assert.equal(evaluateExpression('10 + 5 * 2'), 20);
    assert.equal(evaluateExpression('(2 + 3) * 4'), 20);
    assert.equal(evaluateExpression('-3 + 1'), -2);
    assert.equal(evaluateExpression('10 / 4'), 2.5);
    assert.equal(evaluateExpression('10 % 3'), 1);
    assert.equal(evaluateExpression(' 2.5 * 2 '), 5);
});

test('evaluateExpression: ekspresi tidak valid melempar error', () => {
    assert.throws(() => evaluateExpression(''), /kosong/);
    assert.throws(() => evaluateExpression('1 / 0'), /nol/);
    assert.throws(() => evaluateExpression('1 + * 2'), /tidak valid|Angka/);
    assert.throws(() => evaluateExpression('process.exit()'), /tidak valid/);
    assert.throws(() => evaluateExpression('(1 + 2'), /kurung/);
});

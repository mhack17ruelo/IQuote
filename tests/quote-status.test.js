import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuoteStatus, isQuoteExpired, normalizeQuoteStatuses } from '../src/quote-status.js';

const now = Date.parse('2026-10-24T12:00:00Z');

test('quotation expires only after more than 30 days', () => {
  assert.equal(isQuoteExpired({ createdAt: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString() }, now), false);
  assert.equal(isQuoteExpired({ createdAt: new Date(now - 30 * 24 * 60 * 60 * 1000 - 1).toISOString() }, now), true);
});

test('expired status overrides a manually selected status', () => {
  assert.equal(getQuoteStatus({ createdAt: '2026-09-01T12:00:00Z', status: 'Approved' }, now), 'Expired');
});

test('Expired cannot be manually assigned before the 30-day deadline', () => {
  assert.equal(getQuoteStatus({ createdAt: '2026-10-20T12:00:00Z', status: 'Expired' }, now), 'Pending');
});

test('missing status defaults to Pending and existing manual status is preserved', () => {
  const quotes = [
    { id: 'new', createdAt: '2026-10-20T12:00:00Z' },
    { id: 'approved', createdAt: '2026-10-20T12:00:00Z', status: 'Approved' }
  ];
  assert.deepEqual(normalizeQuoteStatuses(quotes, now).map(quote => quote.status), ['Pending', 'Approved']);
});

test('legacy quotations use their saved creation date for expiration', () => {
  assert.equal(getQuoteStatus({ created: '9/1/2026', status: 'Pending' }, now), 'Expired');
});

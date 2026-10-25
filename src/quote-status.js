export const QUOTATION_STATUSES = ['Pending', 'Approved', 'Declined', 'Expired'];
export const MANUAL_QUOTATION_STATUSES = ['Pending', 'Approved', 'Declined'];

const EXPIRATION_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export function isQuoteExpired(quote, now = Date.now()) {
  const createdAt = Date.parse(quote.createdAt || quote.created || '');
  return Number.isFinite(createdAt) && now - createdAt > EXPIRATION_AGE_MS;
}

export function getQuoteStatus(quote, now = Date.now()) {
  if (isQuoteExpired(quote, now)) return 'Expired';
  return MANUAL_QUOTATION_STATUSES.includes(quote.status) ? quote.status : 'Pending';
}

export function normalizeQuoteStatuses(quotes, now = Date.now()) {
  let changed = false;
  const normalized = quotes.map(quote => {
    const status = getQuoteStatus(quote, now);
    if (quote.status === status) return quote;
    changed = true;
    return { ...quote, status };
  });
  return changed ? normalized : quotes;
}

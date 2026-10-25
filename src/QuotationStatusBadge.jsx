import React from 'react';
import { getQuoteStatus } from './quote-status.js';

export default function QuotationStatusBadge({ quote }) {
  const status = getQuoteStatus(quote);
  return <span className={`quotation-status-badge status-${status.toLowerCase()}`}>{status}</span>;
}

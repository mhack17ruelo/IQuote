import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { getQuoteStatus, isQuoteExpired, MANUAL_QUOTATION_STATUSES, QUOTATION_STATUSES } from './quote-status.js';
import QuotationStatusBadge from './QuotationStatusBadge.jsx';
import './RecentQuotations.css';

const PAGE_SIZE = 10;

export default function RecentQuotations({ quotes, onOpen, onDelete, onStatusChange }) {
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(0);
  const query = search.trim().toLocaleLowerCase();
  const filteredQuotes = quotes
    .filter(quote => statusFilter === 'All statuses' || getQuoteStatus(quote) === statusFilter)
    .filter(quote => !query || [quote.number, quote.project, quote.client].some(value => String(value || '').toLocaleLowerCase().includes(query)))
    .sort((left, right) => {
      if (sortBy === 'project') return String(left.project || '').localeCompare(String(right.project || ''));
      if (sortBy === 'highest') return (+right.total || 0) - (+left.total || 0);
      if (sortBy === 'lowest') return (+left.total || 0) - (+right.total || 0);
      const leftDate = Date.parse(left.createdAt || left.created || '') || 0;
      const rightDate = Date.parse(right.createdAt || right.created || '') || 0;
      return sortBy === 'oldest' ? leftDate - rightDate : rightDate - leftDate;
    });
  const pageCount = Math.ceil(filteredQuotes.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const visibleQuotes = filteredQuotes.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  function updateSearch(value) {
    setSearch(value);
    setPage(0);
  }

  function updateStatusFilter(value) {
    setStatusFilter(value);
    setPage(0);
  }

  function updateSort(value) {
    setSortBy(value);
    setPage(0);
  }

  return <section className="panel">
    <div className="recent-quotes-heading">
      <div>
        <h2>Recent quotations</h2>
        <p className="recent-quotes-count">{filteredQuotes.length} of {quotes.length} quotations</p>
      </div>
    </div>
    {quotes.length > 0 && <>
      <div className="recent-quotation-toolbar">
        <label className="quote-search">Search quotations
          <input type="search" value={search} onChange={event => updateSearch(event.target.value)} placeholder="Quote number, project, or client" />
        </label>
        <label className="quote-status-filter">Status
          <select aria-label="Filter quotations by status" value={statusFilter} onChange={event => updateStatusFilter(event.target.value)}>
            <option>All statuses</option>
            {QUOTATION_STATUSES.map(status => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className="quote-sort">Sort by
          <select aria-label="Sort quotations" value={sortBy} onChange={event => updateSort(event.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="project">Project A–Z</option>
            <option value="highest">Highest total</option>
            <option value="lowest">Lowest total</option>
          </select>
        </label>
      </div>
      {visibleQuotes.length ? <>
        <div className="recent-quotes-table">
          <table><thead><tr><th>Quote</th><th>Project / Client</th><th>Date</th><th className="quote-total-cell">Total</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{visibleQuotes.map(quote => {
              const expired = isQuoteExpired(quote);
              const status = getQuoteStatus(quote);
              return <tr key={quote.id}>
                <td className="quote-number-cell">{quote.number}</td>
                <td className="quote-project-cell"><span>{quote.project}</span><small>{quote.client}</small></td>
                <td>{quote.created}</td>
                <td className="quote-total-cell">{money(quote.total)}</td>
                <td><label className={`quote-status-control status-${status.toLowerCase()}`} aria-label={`Status for quotation ${quote.number}`}>
                  <QuotationStatusBadge quote={quote} />
                  <select
                    className="quote-status-select"
                    aria-label={`Change status for quotation ${quote.number}`}
                    value={status}
                    disabled={expired}
                    onChange={event => onStatusChange(quote.id, event.target.value)}
                  >{(expired ? QUOTATION_STATUSES : MANUAL_QUOTATION_STATUSES).map(option => <option key={option}>{option}</option>)}</select>
                </label></td>
                <td className="quote-row-actions">
                  <button className="link" onClick={() => onOpen(quote)}>Open</button>
                  <button className="link destructive-link" title="Delete quotation" aria-label={`Delete quotation ${quote.number}`} onClick={() => {
                    if (window.confirm(`Delete quotation ${quote.number} for ${quote.project}? This cannot be undone.`)) onDelete(quote.id);
                  }}><Trash2 size={14}/> Delete</button>
                </td>
              </tr>;
            })}</tbody>
          </table>
        </div>
        {pageCount > 1 && <nav className="quote-pagination" aria-label="Quotation pages">
          <span>Page {currentPage + 1} of {pageCount}</span>
          <div>
            <button className="btn btn-outline" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</button>
            <button className="btn btn-outline" disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)}>Next</button>
          </div>
        </nav>}
      </> : <p className="muted">No quotations match these search and filter settings.</p>}
    </>}
    {!quotes.length && <p className="muted">Create a project quotation to begin.</p>}
  </section>;
}

function money(amount) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(+amount || 0);
}

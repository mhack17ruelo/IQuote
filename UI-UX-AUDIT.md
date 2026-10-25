# iQuote Quotation Studio UI/UX Audit

## Baseline checklist (before implementation)

| Area | Baseline finding |
|---|---|
| Authentication | Login, registration, password recovery, and reset screens exist. Browser interaction testing requires signing in; unauthenticated API requests return 401 as expected. |
| Dashboard / quotation list | Recent quotations support status filtering and row actions, but not search, sorting, or pagination. Monetary values are not right-aligned. |
| Quotation statuses | Pending, Approved, Declined, and Expired are supported. Status was only shown in the recent-quotation table; status controls allowed selecting Expired before the 30-day deadline. |
| Quotation creation | Project/client/location, cabinet dimensions, materials, pricing, discounts, taxes, validity, and terms are part of the existing form. Existing calculation logic must remain unchanged. |
| Quotation detail / customer proposal | A client proposal preview exists with HTML, PDF, print, and production actions. Internal quotation status should not be added to the customer-facing document. |
| Module library | Reusable cabinet templates, dimensions, categories, and archive/restore behavior are supported. |
| Catalogue / materials / inventory | Product and material catalogue, supplier data, image handling, stock, and inventory views are supported. |
| Production | Saved cut lists, manual overrides, recalculation, and production output are supported. |
| Shared controls | Input, select, and textarea styling is split across rules. Shared keyboard focus, disabled, and hover states are not consistently defined. |
| Tables / responsive behavior | Tables can scroll on narrow screens, but the quotation list has no search/sort/page controls; long rows rely on non-wrapping cells. |
| Print / exported documents | Customer HTML/PDF export and browser print exist. Preserve their current customer-facing structure and keep internal controls out of print. |
| Unsupported modules | No client-management page, notification center, theme switcher, quotation templates, or separate settings/profile area was found. These are not added by this audit. |

## Implementation and verification

### A. Pages reviewed

- PASS — Login, registration, and password-recovery UI inspected; interactive authentication was not exercised.
- PASS — Dashboard and recent-quotation list.
- PASS — New quotation form and optional drawer-count field.
- PASS — Module library.
- PASS — Product catalogue.
- PASS — Materials and pricing.
- PASS — Inventory; the page existed but had no sidebar entry, which has been corrected.
- PASS — Production quotation list.
- PASS — Quotation detail and customer proposal preview.

### B. Corrections made

- Added quotation search by quote number, project, and client; status filtering; sorting by date, project, and total; and 10-row pagination.
- Added reusable Pending, Approved, Declined, and Expired badges to the recent quotations list, production selection, and quotation detail header. Manual selection is limited to Pending, Approved, and Declined; Expired is automatic after more than 30 days.
- Kept internal status out of the printed customer proposal.
- Added shared design tokens and consistent focus, hover, disabled, field, select, status, and destructive-action styles. Retained the existing light/forest-green/gold brand palette.
- Added a labeled, keyboard-focusable mobile navigation toggle and exposed the existing Inventory page in the sidebar.
- Corrected missing React keys in dynamic dropdown options.
- Preserved quotation formulas, totals, API routes, authentication, and the customer-facing proposal layout.

### C. Color and design standards

- Existing light theme retained: canvas `#F5F6F2`, white surfaces, dark forest text/actions, muted gray text, subtle gray-green borders, and restrained gold accents.
- Statuses use consistent tinted badges: amber Pending, green Approved, red Declined, and gray Expired. Status text remains visible, so color is not the only indicator.
- No dark theme was introduced because the application did not previously support one.

### D. Quotation workflow testing

- PASS — `npm test`: 13 tests passed, including calculation, drawer, and status expiration coverage.
- PASS — Browser smoke tests used isolated sample data with API reads/writes intercepted. Search, status filtering, sorting, pagination, status changes, automatic expiration lock, detail status display, and navigation were exercised.
- PASS — No page exceptions or React warnings during the browser smoke test after dropdown key fixes.
- PASS — Local API health endpoint returned HTTP 200.
- PASS — `npm run build`.
- NOT TESTED — Submitting a real quotation, saving to the live workspace database, HTML/PDF downloads, and physical/browser print output. The browser test intentionally used mocked API data to avoid changing business records.

### E. Responsive testing

- PASS — Dashboard tested at 360, 390, 768, 1024, 1440, and 1920 px.
- PASS — Quotation form tested at 360, 390, and 768 px; mobile Inventory navigation was exercised.
- PASS — No document-level horizontal overflow was measured at the tested viewport sizes. Wide tables remain horizontally scrollable within their panels.
- NOT TESTED — Every individual page at every viewport size.

### F. Files changed

- `src/App.jsx`
- `src/main.jsx`
- `src/RecentQuotations.jsx`
- `src/RecentQuotations.css`
- `src/QuotationStatusBadge.jsx`
- `src/quote-status.js`
- `src/ui-system.css`
- `tests/quote-status.test.js`
- `UI-UX-AUDIT.md`

### G. Outstanding issues

- The application branding is iQuote.
- Authentication, live database persistence, quote submission, exports, and print pagination were not end-to-end tested.
- The build still reports an existing large JavaScript bundle warning (about 707 kB minified).
- No separate client-management, notifications, settings/profile, quotation-template, or theme-switching modules were found; these were not invented.
- The application remains a single-page React workspace with much of its page markup in `App.jsx`.

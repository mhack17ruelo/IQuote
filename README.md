# iQuote Quotation Studio

React/Vite cabinet quotation application with a local Node/SQLite API.

## Start

Use two terminals in the project directory:

1. `npm run server` starts the API on `127.0.0.1:3001`.
2. `npm run dev` starts the Vite client; open the displayed local address.

Visitors can explore the interactive demo without signing in. Public registration is disabled; users can request access at [the iQuote Facebook profile](https://web.facebook.com/profile.php?id=61593596356038). To provision an account after approval, run `npm run create-account -- user@example.com "Company Name"`. The command generates a one-time password and prints it once. Send it privately to the approved user. SQLite data is stored locally in `data/ruelo.sqlite`.

Email password recovery requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` environment variables. If they are unset, recovery reports that mail is not configured.

## Implemented

- Hashed-password login, HTTP-only session cookies, per-user SQLite workspace persistence, and operator-provisioned accounts.
- Public landing page with a temporary interactive demo; generating and exporting quotations requires an account.
- Reusable module templates with search, categories, duplicate, archive and restore.
- Grouped project quotations with custom cabinet dimensions, drawer configurations, mechanisms, supplier products and prices.
- Mechanism-specific drawer offsets, generated drawer components, editable custom components and machining notes.
- Editable quotation terms, client/project location, validity, margin, discount and tax.
- Material and supplier catalogs, stock counts and an inventory view.
- Configurable sheet dimensions, kerf and trim with a basic rectangle-packing sheet estimate.
- Editable saved cut lists with override markers, restore-to-formula, PDF quote/cut-list downloads, XLSX cut-list export and browser print.
- Workspace JSON backup and restore.

## Validation

Run `npm test` for calculation and sheet-packing checks; run `npm run build` for a production bundle.

## Important limits

The browser UI is a local workshop prototype, not a hosted multi-tenant service. The nesting routine is a basic row-packing estimate, not a production CNC optimizer. Component construction formulas are still narrower than a complete user-defined safe formula/rules editor; material stock is tracked but not automatically reserved or deducted. Supplier catalogs are entered manually. Configure SMTP for OTP recovery. Review workshop dimensions and supplier mechanism specifications before fabrication.

## Production start

Run `npm start` to build the React client and serve it with the API on port 3001. For email OTP recovery, set SMTP environment variables before starting. Provision accounts on the server with `npm run create-account -- user@example.com "Company Name"`. The development workflow uses separate API and Vite processes.

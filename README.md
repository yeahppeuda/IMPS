# IPManagementSystem

A clean, responsive multi-page web project built using HTML, Tailwind CSS via CDN, and vanilla JavaScript.

## Structure

- `index.html` — login page with split-screen design and redirect logic
- `pages/` — content pages with shared layout structure
- `components/` — reusable sidebar, header, and modal templates
- `assets/css/style.css` — minimal global styling
- `assets/js/app.js` — login redirect, modal helpers, navigation, and placeholders
- `assets/images/` — reserved for future assets

## Pages Included

- `pages/dashboard.html`
- `pages/copyright.html`
- `pages/patent.html`
- `pages/trademark.html`
- `pages/utility-model.html`
- `pages/industrial-design.html`
- `pages/event.html`

## Notes

- The project uses Tailwind CSS via CDN for layout and UI styling.
- `components/sidebar.html` and `components/header.html` are loaded dynamically into all pages through `assets/js/app.js`.
- `components/modal.html` supplies a reusable modal structure for future Add/View/Edit workflows.
- `index.html` uses a simple login function to redirect to `pages/dashboard.html`.

## How to use

Open `index.html` in your browser. Enter any email and security key, then click Authenticate to access the dashboard.

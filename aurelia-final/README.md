# Aurelia Jewels — Internship Project

A responsive frontend jewelry e-commerce website created from the internship requirements and reference layouts.

## Features

- Responsive header and navigation
- Search bar
- 3-slide hero carousel
- Discover Our Collections with circular category cards
- Trending Looks horizontal section
- Necklace Set product listing page
- Price filter
- Base Metal filters
- Polish filters
- Sort by Latest, Price and Popularity
- Product ratings, prices and discounts
- Add to Cart with localStorage
- Responsive mobile filter drawer
- Newsletter subscription
- Footer with policies and social links

## Run

No framework or build tool is required.

1. Extract the project.
2. Open `index.html` in a browser.

For the best development experience, use VS Code with the Live Server extension.

## Files

- `index.html` — Home page
- `products.html` — Necklace Set/product listing page
- `css/style.css` — Complete styling and responsive layout
- `js/script.js` — Carousel, filters, sorting, cart and interactions

## Customization

The demo uses online image URLs for the visual content. Replace the URLs in `index.html` and `js/script.js` with your own local images if your internship requires local assets.

## Project note

This is a frontend demonstration for an internship assignment. Product prices, contact information and branding are sample data and should be replaced with approved project content before production use.


## Full-Stack Backend

Aurelia now includes a dependency-free Node.js REST API backed by a persistent JSON database at `backend/data/aurelia.json`. This keeps the project runnable without installing MongoDB or third-party packages.

### Run

```bash
npm start
```

Open `http://localhost:5500/`.

### API

- `GET /api/health`
- `GET /api/products` and `GET /api/products/:id`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/PUT /api/auth/me`
- `GET/POST/DELETE /api/addresses`
- `GET/PUT /api/cart`
- `GET/PUT /api/wishlist`
- `POST /api/coupons/validate`
- `GET/POST /api/orders` and `GET /api/orders/:id`
- `GET/POST /api/products/:id/reviews`
- Admin product, order, customer and coupon endpoints

### Demo accounts

Customer: `priya@example.com` / `demo123`

Admin: `admin@aurelia.local` / `admin123`

Admin portal: `http://localhost:5500/admin/`

Passwords are stored server-side as scrypt hashes. Authentication uses signed bearer tokens. The database is intended for this internship/demo build; for production, replace the JSON store with PostgreSQL/MongoDB, use a managed secret, HTTPS, rate limiting, real payment provider and server-side validation/auditing.

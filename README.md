# PureHarvest Marketplace

A full-stack organic grocery marketplace built with React + Vite on the frontend and Express on the backend.

## Features
- Organic storefront with rotating daily deal banner
- Category pages for rice, fruits, pulses, oils, dairy, and vegetables
- Product cards with pricing and cart flow
- Checkout page with payment options
- Buyer, seller, and admin login flow
- Seller dashboard to add products and view stock
- Admin dashboard for store overview and inventory insights
- Demo backend mode with fallback product catalog when MongoDB is not configured

## Tech stack
- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Styling: custom CSS and responsive storefront layout

## Local setup

### 1. Install dependencies

Backend:
1. cd server
2. npm install

Frontend:
1. cd client
2. npm install

### 2. Run the app

Backend:
1. cd server
2. npm start

Frontend:
1. cd client
2. npm run dev

The app will run at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Demo login shortcuts
- Admin email: admin@pureharvest.com
- Admin password: admin123
- Seller email: seller@pureharvest.com
- Seller password: seller123

## Project structure
- client/src/pages: storefront, auth, seller, dashboard, category, checkout pages
- client/src/components: reusable storefront and UI components
- server/routes: Express routes for products and auth
- server/controllers: request handling logic
- server/models: MongoDB schema definitions

## Notes
- The backend runs in demo mode if MONGO_URI is not configured.
- Buyer and seller login send a one-time OTP by email after the password is accepted. Seller login also requires a GST number. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` in `server/.env` for real delivery. Without SMTP, development mode returns the OTP in the API response for local testing only.
- This project is currently focused on storefront polish and marketplace UX before deeper production-grade features are added.

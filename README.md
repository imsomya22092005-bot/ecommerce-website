ShopSphere 🛍️

A modern full-stack E-Commerce Website built as an academic team project. ShopSphere provides a clean, responsive shopping experience with product discovery, authentication, cart management, wishlist support, checkout flow, order tracking, product reviews/ratings, and coupon-based discounts.

Project status: Frontend is actively developed and deployed on Vercel. Backend APIs are developed separately and are being connected to the live frontend.

✨ Highlights

Responsive e-commerce interface for desktop, tablet, and mobile

Clean editorial-inspired ShopSphere design system

Product browsing, search, category navigation, and product details

User registration and login with role support (user / admin)

Shopping cart with quantity controls and item removal

Wishlist functionality

Checkout and order-success flow

Order history and order tracking

Per-product ratings and reviews

Frontend coupon system with percentage and flat discounts

English / Hindi language support

Reusable React components and routed pages

Lucide icons for the navigation/category UI

Local storage persistence for frontend shopping state

🎯 Project Objective

The goal of ShopSphere is to build a practical, user-friendly e-commerce application that demonstrates how a React frontend communicates with a backend API and manages common online-shopping workflows.

The project follows a separate frontend/backend architecture, allowing both parts to be developed and deployed independently.

🧩 Core Features

👤 Authentication

User registration

User login

JWT-based authentication support

Profile retrieval

User role support:

user

admin

Personalized user greeting after login

🛒 Shopping

Browse available products

Product detail pages

Product category navigation

Search support

Add to cart

Increase/decrease quantity

Remove products from cart

Persistent cart using localStorage

❤️ Wishlist

Add/remove products from wishlist

Persistent wishlist state on the frontend

⭐ Reviews & Ratings

Reviews are designed per product, rather than as one common review page.

Each product can have:

Star rating

Written review

Reviewer name

Review date

Average product rating

Total review count

The current frontend version stores product reviews locally using product-specific localStorage keys. Backend persistence can be connected later.

🎟️ Coupons

The cart includes a coupon system supporting both percentage and flat discounts.

Current demo coupons:

Coupon

Discount

SHOP10

10% off

WELCOME15

15% off

FLAT200

₹200 off

SAVE20

20% off

The discount is calculated automatically with shipping and reflected in the final cart total.

Coupon validation is currently frontend-side for demonstration. Production-ready validation should be performed by the backend.

📦 Orders

Checkout flow

Order success page

Order history

Order tracking

Order status timeline

🌐 Language Support

The interface supports:

English

Hindi

Text changes dynamically through the shared language context.

🛠️ Technology Stack

Frontend

Technology

Purpose

React

UI development

Vite

Frontend tooling and development server

React Router DOM

Client-side routing

JavaScript (ES6+)

Application logic

CSS3

Styling and responsive design

Lucide React

UI icons

Fetch API

Backend API communication

LocalStorage

Cart, wishlist, reviews and UI state persistence

Backend

Technology

Purpose

Node.js

Server runtime

Express.js

REST API development

MongoDB

Database

Mongoose

MongoDB object modeling

JWT

Authentication

bcrypt

Password security

📁 Project Structure

shopSphere/
│
├── frontend/
│   ├── public/
│   │   └── favicon.png
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   └── about-visual.png
│   │   │
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Help.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NewArrivals.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── TrackOrder.jsx
│   │   │   └── Wishlist.jsx
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── LanguageContext.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
└── backend/
    ├── src/
    │   ├── routes/
    │   ├── models/
    │   ├── controllers/
    │   ├── middleware/
    │   └── ...
    ├── .env
    ├── server.js
    ├── package.json
    └── ...

Backend file names can vary as backend implementation evolves. The frontend structure above reflects the current application organization.

🧭 Application Routes

Public / Shopping Routes

Route

Page

/

Home

/products

Products

/product/:id

Product Details

/new-arrivals

New Arrivals

/about

About

/contact

Contact

/help

Help

/cart

Cart

/wishlist

Wishlist

/checkout

Checkout

/orders

Orders

/track-order

Track Order

/order-success

Order Success

/login

Login / Register

🔌 Backend API Endpoints

The backend currently provides product and authentication APIs used by the frontend.

Products

GET /api/products
GET /api/products?search=phone
GET /api/products?category=smartphones
GET /api/products?sort=price_asc
GET /api/products?sort=price_desc
GET /api/products?page=2&limit=12
GET /api/products?search=phone&sort=price_asc&page=1&limit=5

Authentication

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile

Authentication requests use JWT access tokens. Never commit .env files, MongoDB credentials, JWT secrets, or other private credentials to GitHub.

🚀 Getting Started

Prerequisites

Make sure the following are installed:

Node.js

npm

MongoDB or a MongoDB Atlas database

Git

1. Clone the repository

git clone https://github.com/imsomya22092005-bot/ecommerce-website.git
cd ecommerce-website

2. Start the frontend

cd frontend
npm install
npm run dev

The Vite development server will provide the local frontend URL in the terminal, typically:

http://localhost:5173

3. Start the backend

Open another terminal:

cd backend
npm install
npm run dev

The backend is configured to run on port 3000 in the current development setup.

4. Environment variables

Create a backend .env file containing your own private values:

MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_private_jwt_secret

Do not copy real credentials into this README or into source control.

🔄 User Flow

Home
  ↓
Browse Products
  ↓
Product Details
  ↓
Add to Cart / Wishlist
  ↓
Cart
  ↓
Apply Coupon
  ↓
Checkout
  ↓
Order Success
  ↓
Orders / Track Order

Authentication flow:

Login / Register
      ↓
Authentication API
      ↓
JWT Token
      ↓
Profile API
      ↓
Personalized User Session

🎨 Design System

ShopSphere uses a warm, premium visual direction instead of a typical purple e-commerce theme.

Main Colors

Cream       #F6F1E9
Beige       #E8DED0
Dark        #211E1B
Brown       #8A6245
Off-white   #FFFDF9
Coral       #C96F5B
Mustard     #D4A24C
Sage        #7D9473

Typography

Playfair Display — headings and editorial-style titles

DM Sans — body text and interface elements

📱 Responsive Design

The frontend is designed for:

Desktop screens

Tablets

Mobile phones

Responsive layouts are handled through CSS media queries, flexible grids, mobile navigation, and adaptive spacing.

☁️ Deployment

Frontend

The frontend is deployed using Vercel.

Production URL:

https://ecommerce-website-jade-two-81.vercel.app/

The Vercel project uses the frontend directory as its project root and deploys from the frontend branch.

Backend


🌿 Git Branch Strategy

The project uses separate branches for team development.

main
 ├── frontend
 └── feature/backend-setup

Frontend branch

Used for:

React pages

Components

Styling

Responsive UI

Frontend state and local storage

API integration

Backend branch

Used for:

Express server

MongoDB / Mongoose

Authentication

API routes

Business logic

Backend validation

Changes are merged into the main project through Git/GitHub.

👥 Team Roles

Frontend

Somya Saloni

Responsible for:

React frontend

UI/UX implementation

Responsive layouts

Routing

Cart / wishlist UI

Reviews and ratings UI

Coupon UI and calculation

Frontend API integration

Vercel deployment

Backend

Team Backend Developer

Responsible for:

Node.js / Express backend

MongoDB database

Authentication APIs

Product APIs

JWT authentication

Backend business logic

Backend deployment

🧪 Testing Checklist

Before final submission, verify:

Home page loads correctly

Navigation works on desktop and mobile

Products load from backend

Product details open correctly

Login works

Registration works

User role is sent during registration

Cart quantity updates correctly

Items can be removed from cart

Wishlist works

Coupon codes calculate discounts correctly

Checkout flow works

Order success page works

Order history works

Track order works

Product-specific reviews and ratings work

English / Hindi switching works

Frontend works on the deployed Vercel URL

Frontend points to the live backend API before final demo

🔐 Security Notes

Keep .env files private.

Never commit MongoDB connection strings.

Never commit JWT secrets.

Production coupon validation should happen on the backend.

Authentication and authorization should be enforced by backend middleware.

Client-side values such as prices, coupons, roles, and totals should not be trusted as authoritative data in a production environment.

🚧 Future Enhancements

Potential improvements for the next version:

Admin dashboard

Backend-persisted reviews and ratings

Backend coupon management

Coupon expiry dates and usage limits

Product stock management

Advanced filters and sorting

Pagination UI

Product image galleries

Payment gateway integration

Order status management from admin panel

Toast notifications

Search suggestions

User profile editing

📚 Academic Context

This project was developed as a team-based e-commerce web application to demonstrate practical skills in frontend development, backend API integration, authentication, database interaction, responsive design, and deployment.

It combines:

React + Vite
      ↓
Responsive UI
      ↓
REST APIs
      ↓
Express / Node.js
      ↓
MongoDB

📄 License

This repository is an academic/student project. No open-source license has been specified yet.

🙌 Acknowledgement

Built as a collaborative learning project with a focus on practical full-stack web development and modern e-commerce UI design.

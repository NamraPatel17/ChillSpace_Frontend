# 🏖️ ChillSpace — Vacation Rental Platform

<div align="center">

![ChillSpace Banner](https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=400&fit=crop&crop=center)

**A full-stack vacation rental platform connecting guests with unique stays worldwide.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-chillspace--frontend.vercel.app-6366f1?style=for-the-badge)](https://chillspace-frontend.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️_Backend_API-chillspace--backend.onrender.com-22c55e?style=for-the-badge)](https://chillspace-backend.onrender.com)

</div>

---

## 🔗 Live Links

| Service | URL |
|---------|-----|
| 🌐 **Frontend (Vercel)** | [https://chillspace-frontend.vercel.app](https://chillspace-frontend.vercel.app) |
| ⚙️ **Backend API (Render)** | [https://chillspace-backend.onrender.com](https://chillspace-backend.onrender.com) |
| 🗄️ **Database (MongoDB Atlas)** | MongoDB Atlas — Cloud Hosted |

> ⚠️ **Note:** The backend is hosted on Render's free tier. It may take 20–30 seconds to wake up after a period of inactivity.

---

## 📌 About the Project

ChillSpace is a full-stack vacation rental web application built as part of an 8th semester internship project. It enables guests to search, book and review unique properties, hosts to manage their listings and earnings, and admins to oversee the entire platform.

---

## 🚀 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **React Router v7** | Client-side Routing |
| **Tailwind CSS v4** | Styling |
| **Axios** | HTTP Client |
| **Lucide React** | Icons |
| **React Toastify** | Notifications |
| **Razorpay JS SDK** | Payment Integration |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime |
| **Express.js v5** | Web Framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication |
| **Bcrypt** | Password Hashing |
| **Cloudinary** | Image Upload & Storage |
| **Nodemailer** | Email Notifications |
| **Razorpay** | Payment Gateway |
| **Multer** | File Upload Middleware |

---

## ✨ Features

### 👤 Guest Features
- 🏠 Browse and search properties with filters (location, price, type, amenities)
- 📄 View detailed property pages with image gallery, amenities and reviews
- 📅 Real-time availability calendar before booking
- 💳 Secure payment via **Razorpay**
- 📋 View and manage personal bookings
- ⭐ Submit property reviews after checkout
- 💬 In-app messaging with hosts
- 👤 Profile management with photo upload
- 🔐 Forgot password & email-based reset

### 🏡 Host Features
- 📊 Host dashboard with earnings, bookings and analytics
- 🏘️ Add, edit and delete property listings with image upload (Cloudinary)
- 📅 Manage property availability calendar (block dates)
- 📋 View and manage all bookings (confirm / cancel)
- 💰 Earnings breakdown by period (last 15 days, month, 3 months)
- ⭐ Rate guests after completed stays
- 💬 In-app messaging with guests
- ⚙️ Account settings management

### 🛡️ Admin Features
- 📊 Admin dashboard with platform-wide stats
- 👥 Manage all users (promote, ban, delete)
- 🏠 Manage all property listings
- 📋 View and manage all bookings
- ⭐ Moderate and delete reviews
- 💰 View all payments
- ✅ Handle host verification requests
- ⚖️ Manage and resolve guest/host disputes

### 🔐 Auth & Security
- JWT-based authentication with role-based access control (Guest / Host / Admin)
- Protected routes on both frontend and backend
- Bcrypt password hashing
- CORS configured for production

---

## 📁 Project Structure

```
Projects/
├── Backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── controllers/        # Route logic
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express routers
│   │   ├── middlewares/        # Auth, Role, Upload middleware
│   │   └── utils/              # DB connection, Mail, Cloudinary
│   ├── app.js                  # Express app entry point
│   └── package.json
│
└── Frontend/chillspace/        # React + Vite app
    ├── src/
    │   ├── components/
    │   │   ├── admin/          # Admin panel pages
    │   │   ├── host/           # Host dashboard pages
    │   │   ├── guest/          # Guest-facing pages
    │   │   ├── ui/             # Reusable UI components
    │   │   └── footer/         # Footer pages
    │   ├── router/
    │   │   └── AppRouter.jsx   # All routes defined here
    │   └── App.jsx
    └── package.json
```

---



## 🛠️ Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account

### 1. Clone the repos
```bash
# Backend
git clone https://github.com/YOUR_USERNAME/chillspace-backend.git
cd chillspace-backend
npm install

# Frontend
git clone https://github.com/YOUR_USERNAME/chillspace-frontend.git
cd chillspace-frontend
npm install
```

### 2. Configure environment files
Create `.env` files in both folders using the variables listed above.

### 3. Run locally
```bash
# Backend (runs on http://localhost:3000)
npm run dev

# Frontend (runs on http://localhost:5173)
npm run dev
```

---

## 🌍 Deployment

| Part | Platform | Config |
|------|----------|--------|
| **Frontend** | Vercel | Auto-deploy from GitHub |
| **Backend** | Render | `npm start` → `node app.js` |
| **Database** | MongoDB Atlas | Free 512MB cluster |
| **Images** | Cloudinary | Free tier |

---

## 📡 API Routes Overview

| Group | Base Path | Description |
|-------|-----------|-------------|
| Users | `/users` | Register, Login, Profile, Password Reset |
| Properties | `/properties` | CRUD for listings |
| Bookings | `/bookings` | Create, view, cancel bookings |
| Reviews | `/reviews` | Property & guest reviews |
| Host | `/hosts` | Analytics, Earnings, Properties, Bookings |
| Disputes | `/disputes` | Raise and manage disputes |
| Payments | `/payments` | Razorpay order & verification |
| Admin | `/admin` | Platform-wide management |
| Messages | `/messages` | In-app messaging |
| Verifications | `/verifications` | Host identity verification |

---

## 👩‍💻 Developed By

**Namra Patel**
---

## 📄 License

This project is built for academic/internship purposes.

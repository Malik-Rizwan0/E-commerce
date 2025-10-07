# 🛍️ Full-Stack E-Commerce Website

A complete **MERN Stack E-Commerce Website** built with **React, Redux Toolkit, Node.js, Express, and MongoDB**.  
This project demonstrates full-stack development, including authentication, product management, order processing, Stripe payment integration, and an admin dashboard.

---

## 🚀 Live Demo

🌐 **Frontend (React + Vite):** [https://rixi-store.netlify.app/](https://rixi-store.netlify.app/)  
🖥️ **Backend (Node + Express):** [https://e-commerce-ji7u.onrender.com/](https://e-commerce-ji7u.onrender.com/)

---

## 🧩 Project Overview

This E-commerce website allows users to browse products, add items to the cart, make secure payments via **Stripe**, and manage their profiles.  
Admin users can manage products, orders, and users through a dedicated dashboard.

---

## ✨ Features

### 👤 User Features
- 🔐 JWT-based authentication (Register / Login / Logout)
- 🛒 Add to cart & checkout process
- 💳 Stripe payment integration
- 📦 View and manage orders
- ⭐ Product reviews and ratings
- 👤 Update profile and password
- 🔔 Snackbar notifications using Notistack

### 🛠️ Admin Features
- 📊 Dashboard with statistics (Chart.js)
- 🧾 Manage products (CRUD)
- 📦 Manage orders (update status)
- 👥 Manage users
- 📈 Data visualization with charts

### 💡 Additional Features
- Responsive UI with **Material UI** + **Tailwind CSS**
- Cloud image uploads via **Cloudinary**
- Input validation using  **Mongoose**
- Proper error handling middleware
- Organized MVC folder structure in backend

---

## 🧠 Tech Stack

### 🖥️ Frontend
- React 19
- Redux Toolkit
- React Router DOM v7
- Material UI (MUI)
- Tailwind CSS
- Axios
- React Slick (carousel)
- Chart.js
- Notistack

### ⚙️ Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT Authentication
- Stripe API
- Cloudinary
- Multer + Multer-Storage-Cloudinary
- Nodemailer
- CORS, Cookie-parser, Body-parser
- Validator.js

---

## 📁 Folder Structure

### Backend
```
Backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── config/
├── server.js
└── .env
```

### Frontend
```
Frontend/
├── src/
│   ├── Components/
│   ├── features/   (Redux slices)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Malik-Rizwan0/E-commerce.git
cd E-commerce
```

### 2️⃣ Setup Backend
```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
COOKIE_EXPIRE=5
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Run the backend:
```bash
npm run dev
```

---

### 3️⃣ Setup Frontend
```bash
cd ../Frontend
npm install
npm run dev
```

Open the app in your browser at:  
👉 `http://localhost:5173`

---

## 🧾 Available Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build frontend for production |
| `npm start` | Start Node.js backend |


---

## 🔐 Environment Variables

| Variable | Description |
|-----------|-------------|
| `MONGO_URI` | MongoDB Connection String |
| `JWT_SECRET` | JWT Secret for Authentication |
| `STRIPE_SECRET_KEY` | Stripe Secret Key |
| `CLOUDINARY_*` | Cloudinary credentials |
| `COOKIE_EXPIRE` | Cookie expiry time 14 days |


---

## 🧑‍💻 Author

**Malik Muhammad Rizwan**  
🌍 Lahore, Pakistan  
📧 [malikrizwan1076@gmail.com](mailto:malikrizwan1076@gmail.com)  
💼 [GitHub](https://github.com/Malik-Rizwan0)

---

## 📝 License

This project is licensed under the **MIT License** © 2025 Malik Muhammad Rizwan

---

### 💬 Feedback

If you have any feedback, suggestions, or issues — feel free to open an issue or contact me.

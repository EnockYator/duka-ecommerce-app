
# 🛒 Duka - Monolithic MERN Stack Ecommerce App  

A full-featured **Ecommerce platform** built with the **MERN stack (MongoDB, Express, React, Node.js)**.  
Includes authentication, product management, shopping cart, orders, payment integration, and mailing service.  

🔗 **[Live Demo](https://duka12.com)**  

**NOTE**: This application is still on active development and testing stages, it will be live soon, stay updated.

---

## ✨ Features  

- 🔐 **Authentication & Authorization** (JWT, role-based: admin & customer)  
- 👤 **User Management** (register, login, profile, order history)  
- 🛍️ **Product Management** (CRUD for products, categories, inventory)  
- 🛒 **Shopping Cart & Checkout**  
- 💳 **Payment Integration** (Stripe, PayPal, or M-Pesa – configurable)  
- 📦 **Order Management** (create, track, update order status)  
- 📱 **Responsive UI** (mobile & desktop friendly)  
- 🌐 **RESTful API** with secure routes  
- 📊 **Admin Dashboard** for managing products, users & system performance  

---

## 🛠 Tech Stack  

**Frontend**  
- React (Redux, hooks, state management)  
- React Router  
- Axios  
- Shadcn for consistent UI  

**Backend**  
- Node.js + Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- REST APIs  

**Other Tools**  
- Cloudinary / AWS S3 (image uploads)  
- Multer  
- Stripe, PayPal, M-Pesa SDK  
- bcryptjs (password hashing)  
- dotenv (environment variables)  
- ESLint, Prettier, TailwindCSS  

---

## 📂 Project Structure  
```bash
ecommerce-app/
├── api
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── auth/
│   │       └── auth-controller.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth-route.js
│   ├── schemas/
│   │   └── UserSchema.js
│   ├── services/
│   │   ├── authService.js
│   │   └── tokenService.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── client
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── store/
│   ├── App.jsx
│   ├── index.html
│   ├── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```
---

## ⚙️ Installation & Setup

```bash
# 1️. Clone the Repo  
git clone https://github.com/EnockYator/duka-ecommerce-app.git
cd duka-ecommerce-app

# 2️. Install Dependencies  

# Backend
cd api
npm install  

# Frontend
cd ../client
npm install  

# 3️. Configure Environment Variables  
# Inside /api/.env

PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
STRIPE_SECRET_KEY=your_stripe_key 
PAYPAL_CLIENT_ID=your_paypal_id   

# 4️. Run the App  

# Run backend
cd api
npm run dev  

# Run frontend
cd client
npm start  
```

App will be available at:

    🌍 Frontend → http://localhost:5173

    🔗 Backend API → http://localhost:5000/api

---

## 📸 Snapshots

    ![Home page](home.png)

    ![Products](listing.png)

---

## 📡 API Endpoints

The following are some of the api endpoints.

**NOTE**: The app contains so many endpoints, each with a specific funtion.

|Method	| Endpoint           | Description                 |
|:------|:------------------:|:----------------------------|
|POST	| /api/auth/register | Register new user           | 
|POST	| /api/auth/login	 | Login user & get token      |
|GET	| /api/products	     | Get all products            |
|POST	| /api/products	     | Add new product (Admin)     |
|GET	| /api/orders/:id	 | Get order by ID             |

---

## 🚀 Deployment

    Frontend: Netlify

    Backend: AWS

    Database: MongoDB Atlas

---

## 👨‍💻 Author

Enock Yator
🔗 [GitHub](https://github.com/EnockYator)

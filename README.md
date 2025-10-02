# Duka - MERN Stack Ecommerce App  

A full-featured **Ecommerce platform** built with the **MERN stack (MongoDB, Express, React, Node.js)**.  
This app includes authentication, product management, shopping cart, orders, and payment integration and mailing service.  

View [live]
[live]: https://duka.com
---

## Features  

- 🔐 **Authentication & Authorization** (JWT, role-based: admin & customer)  
- 👤 **User Management** (register, login, profile, order history)  
- 🛍️ **Product Management** (CRUD for products, categories, inventory)  
- 🛒 **Shopping Cart & Checkout**  
- 💳 **Payment Integration** (Stripe, Paypal or M-Pesa – specify which you use)  
- 📦 **Order Management** (create, track, update order status)  
- 📱 **Responsive UI** (mobile & desktop friendly)  
- 🌐 **RESTful API** with secure routes  
- 📊 **Admin Dashboard** for managing products, users, and overal system perfomance and statistics  

---

## Tech Stack  

**Frontend**  
- React (Redux, state management, react hooks)  
- React Router  
- Axios  
- Shadcn for consistent UI

**Backend**  
- Node.js + Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- APIs

**Other Tools**  
- Cloudinary / AWS S3 for image uploads
- Multer  
- Stripe, Paypal, Mpesa SDK 
- bcryptjs for password hashing  
- dotenv for environment variables  
- etc,.

---

## Project Structure  

ecommerce-app/
├── api
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   └── auth
│   │       └── auth-conroller.js
│   ├── models
│   │   └── User.js
│   ├── package.json
│   ├── package-lock.json
│   ├── routes
│   │   └── auth-route.js
│   ├── schemas
│   │   └── UserSchema.js
│   ├── server.js
│   └── services
│       ├── authService.js
│       └── tokenService.js
├── client
│   ├── axios.js
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.app.json
│   ├── jsconfig.json
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   └── vite.svg
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── admin-view
│   │   │   ├── auth
│   │   │   ├── common
│   │   │   ├── guest-view
│   │   │   ├── shopping-view
│   │   │   └── ui
│   │   ├── config
│   │   │   └── index.js
│   │   ├── index.css
│   │   ├── lib
│   │   │   └── utils.js
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── admin-view
│   │   │   ├── auth
│   │   │   ├── guest-view
│   │   │   ├── not-found
│   │   │   └── shopping-view
│   │   └── store
│   │       ├── auth-slice
│   │       ├── authThunk.js
│   │       └── store.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md

---

## ⚙️ Installation & Setup  

```bash
### 1️. Clone the Repo  
git clone https://github.com/EnockYator/duka-ecommerce-app.git
cd duka-ecommerce-app

### 2️. Install Dependencies

#### Install backend deps
cd server
npm install

#### Install frontend deps
cd ../client
npm install

### 3️. Configure Environment Variables

Create a .env file inside /api with:

PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_tokken_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
STRIPE_SECRET_KEY=your_stripe_key 
PAYPAL_CLIENT_ID=your_paypal_id   

### 4️ Run the App

#### Run backend
cd server
npm run dev

#### Run frontend
cd client
npm start

The app will be available at:

    Frontend → http://localhost:5173

    Backend API → http://localhost:5000/api
```
---

## Snapshots

![Home page](home-page.png)
![Products page](listing.png)

---

## API Endpoints 
|Method|	|Endpoint|	|Description|
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user & get token
GET	/api/products	Get all products
POST	/api/products	Add new product (Admin)
GET	/api/orders/:id	Get order by ID

---

## Deployment

    Frontend: [Netlify]

    Backend: [AWS]

    Database: MongoDB Atlas

---

## Author
    Enock Yator
    [GitHub](https://www.github.com/EnockYator)

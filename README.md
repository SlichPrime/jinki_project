# Jinki

A full-stack eCommerce marketplace built with Next.js that focuses on selling factory-rejected, overstock, and imperfect goods at affordable prices while reducing waste through sustainable shopping.

---

## Overview

Jinki is a modern marketplace platform where sellers can list products and customers can browse, purchase, and manage orders in a seamless shopping experience. The platform includes authentication, product management, cart functionality, wishlist features, checkout flow, and seller order management.

The project was built using a full-stack Next.js architecture with MongoDB as the database.

---

## Features

### Customer Features

* User authentication and authorization
* Browse all products
* Product detail pages
* Add to cart functionality
* Wishlist system
* Place orders
* Track order status
* Responsive UI/UX
* Search and filtering system

### Seller Features

* Seller dashboard
* Add new products
* Edit and delete products
* Manage incoming orders
* Update order status
* View product listings

### General Features

* JWT-based authentication
* REST API routes using Next.js
* MongoDB database integration
* Session handling
* Protected routes
* Toast notifications
* Loading states and error handling

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* ShadCN/UI

### Backend

* Next.js API Routes
* Node.js
* JWT Authentication

### Database

* MongoDB
* Mongoose

---

## Project Structure

```bash
jinki/
├── src/
│   ├── app/
│   │   ├── api/              # Backend API routes
│   │   ├── products/         # Product pages
│   │   ├── cart/             # Cart pages
│   │   ├── wishlist/         # Wishlist pages
│   │   ├── orders/           # Order pages
│   │   └── dashboard/        # Seller dashboard
│   │
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Database and helper functions
│   ├── models/               # MongoDB models
│   ├── hooks/                # Custom React hooks
│   └── middleware/           # Middleware logic
│
├── public/                   # Static assets
├── package.json
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/SlichPrime/jinki_project.git
```

### 2. Navigate into the project folder

```bash
cd jinki_project
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create environment variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5. Run the development server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## API Features

The backend API is handled through Next.js API routes.

### Example API Endpoints

```bash
/api/auth/login
/api/auth/register
/api/products
/api/cart
/api/orders
/api/wishlist
```

### API Capabilities

* Create products
* Fetch products
* Update products
* Delete products
* Create orders
* Manage cart data
* User authentication

---

## Authentication Flow

Jinki uses JWT authentication.

### Login Process

1. User logs in
2. Server validates credentials
3. JWT token is generated
4. Token is stored on the client
5. Protected routes verify the token

---

## Database Models

### User

* Username
* Email
* Password
* Role

### Product

* Product name
* Description
* Price
* Image
* Stock
* Seller

### Order

* User
* Product items
* Total price
* Status

### Wishlist

* User reference
* Product reference

---

## Screenshots

Add your screenshots here:

```md
![Home Page](./screenshots/home.png)
![Product Page](./screenshots/product.png)
![Dashboard](./screenshots/dashboard.png)
```

---

## Challenges Faced

* Managing state between cart, wishlist, and orders
* Building role-based seller features
* Handling JWT authentication securely
* Designing responsive layouts for all devices
* Structuring scalable API routes in Next.js

---

## What I Learned

Through this project, I learned:

* Full-stack development with Next.js
* REST API architecture
* MongoDB schema design
* Authentication and authorization
* Frontend and backend integration
* State management and session handling
* Building scalable eCommerce systems

---

## Future Improvements

* Payment gateway integration
* Real-time notifications
* Product reviews and ratings
* Admin dashboard
* Image upload optimization
* Recommendation system
* Deployment and CI/CD pipeline

---

## Contributors

* Orlean Wesley
* Team Jinki

---

## License

This project is for educational and portfolio purposes.

---

## Repository

GitHub Repository:
https://github.com/SlichPrime/jinki_project



## Account
# customer account:
user:owakrusdi@gmail.com
pw:selipanmahal

# seller account:
user:akujamed@gmail.com
pw:kaloiribilangboss

user:mulyono@gmail.com
pw:hidupjokowi



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# 🛍️ ShopEase – E-Commerce Web Application

ShopEase is a responsive e-commerce web application developed using React.js. It provides users with a simple and user-friendly shopping experience, including product browsing, category filtering, sorting, cart management, wishlist management, and user authentication.

## 🚀 Features

### 👤 User Authentication
- User registration and login.
- User logout functionality.
- User-specific shopping experience.
- Cart and wishlist reset on logout.

### 🛒 Product Management
- Display products dynamically.
- View product details.
- Browse products by category.
- Filter products by category.
- Sort products based on price and other options.

### 🛍️ Shopping Cart
- Add products to cart.
- Remove products from cart.
- Update product quantities.
- Calculate total cart price.
- Persist cart data using LocalStorage.

### ❤️ Wishlist
- Add products to wishlist.
- Remove products from wishlist.
- Manage wishlist items.
- User-specific wishlist functionality.

### 🔎 Additional Features
- Responsive user interface.
- Search and filtering functionality.
- React Router navigation.
- API integration using Axios.
- Server-state management using TanStack Query.
- Toast notifications for user feedback.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Development environment and build tool |
| JavaScript | Application functionality |
| HTML5 | Page structure |
| CSS3 | Styling and responsive design |
| Axios | API integration |
| React Router DOM | Navigation and routing |
| TanStack Query | Server-state management |
| LocalStorage | Client-side data persistence |
| React Hot Toast | Notifications |

## 📁 Project Structure

```text
ShopEase/
│
├── public/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ShopEase.git
```

### 2. Navigate to the Project Folder

```bash
cd ShopEase
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open in Browser

Visit:

```text
http://localhost:5173
```

## 📸 Screenshots

Add your project screenshots here to showcase the application.

```markdown
![ShopEase Home Page](screenshots/home.png)

![ShopEase Products Page](screenshots/products.png)

![ShopEase Cart Page](screenshots/cart.png)
```

## 🎯 Project Objective

The main objective of ShopEase is to develop a modern and responsive e-commerce frontend application while gaining practical experience in React.js, API integration, state management, routing, and browser storage.

## 👨‍💻 Developer

**Harish Ragavendra**

- GitHub: https://github.com/harishragavendra2k03

## 📄 License

This project is developed for educational and portfolio purposes.

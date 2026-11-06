import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext.jsx";
import { CartProvider } from "./context/Cartcontext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import "./theme.css";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";


const myClient= new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
    <QueryClientProvider client={myClient}>
    <BrowserRouter>
    <SearchProvider>
    <CartProvider>
    <AuthProvider>
    <WishlistProvider>
    <App />
    </WishlistProvider>
    </AuthProvider>
    </CartProvider>
    </SearchProvider>
    </BrowserRouter>
    </QueryClientProvider>
    </AppErrorBoundary>
  </StrictMode>,
)

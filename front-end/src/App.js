import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import {AuthProvider, useAuth} from "./context/AuthContext";
import Navbar from "./components/Navbar";
import {ThemeProvider} from "@mui/material";
import theme from './theme';
import UserListPage from "./pages/UserListPage";
import ProductListPage from "./pages/ProductListPage";
import OrderListPage from "./pages/OrderListPage";
import ReportListPage from "./pages/ReportListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import axios from "axios";
import UserDetailsPage from "./pages/UserDetailsPage";
import {CartProvider} from "./context/CartContext";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";

axios.defaults.baseURL = 'http://localhost:8080';


function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <ThemeProvider theme={theme}>
                        <Navbar />
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/main" element={<ProtectedRoute component={MainPage} />} />
                            <Route path="/users" element={<ProtectedRoute component={UserListPage} />} />
                            <Route path="/user-details/:userId" element={<ProtectedRoute component={UserDetailsPage} />} />
                            <Route path="/products" element={<ProtectedRoute component={ProductListPage} />} />
                            <Route path="/orders" element={<ProtectedRoute component={OrderListPage} />} />
                            <Route path="/products/:productId" element={<ProtectedRoute component={ProductDetailsPage} />} />
                            <Route path="/reports" element={<ProtectedRoute component={ReportListPage} />} />
                            <Route path="/cart" element={<ProtectedRoute component={CartPage}/>} />
                            <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
                            <Route path="/" element={<Navigate to="/login" replace />} />
                        </Routes>

                    </ThemeProvider>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

function ProtectedRoute({component: Component}) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
}

export default App;
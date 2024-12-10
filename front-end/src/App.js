import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import {AuthProvider, useAuth} from "./context/AuthContext";
import Navbar from "./components/Navbar";
import {ThemeProvider} from "@mui/material";
import theme from './theme';
import axios from "axios";
import {CartProvider} from "./context/CartContext";
import routeConfig from "./config/routeConfig";
import Unauthorized from "./components/Unauthorized";

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
                            {routeConfig.map(({ path, component, roles }) => (
                                <Route
                                    key={path}
                                    path={path}
                                    element={<ProtectedRoute component={component} roles={roles} />}
                                />
                            ))}
                            <Route path="/" element={<Navigate to="/main" replace />} />
                            <Route path="/unauthorized" element={<Unauthorized/>} />
                            <Route path="/main" element={<ProtectedRoute component={MainPage} />} />
                            <Route path="/users" element={<ProtectedRoute component={UserListPage} />} />
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

function ProtectedRoute({ component: Component, roles: allowedRoles }) {
    const { isAuthenticated, roles, loading } = useAuth();

    if (loading) {
        return <div>Kraunama...</div>;
    }

    const hasAccess = !allowedRoles || allowedRoles.some(role => roles.includes(role));

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return hasAccess ? <Component /> : <Navigate to="/unauthorized" replace />;
}

export default App;
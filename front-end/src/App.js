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
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/main" element={<ProtectedRoute component={MainPage} />} />
                        <Route path={"/users"} element={<ProtectedRoute component={UserListPage} />} />
                        <Route path={"/products"} element={<ProtectedRoute component={ProductListPage} />} />
                        <Route path={"/orders"} element={<ProtectedRoute component={OrderListPage} />} />
                        <Route path={"/reports"} element={<ProtectedRoute component={ReportListPage} />} />
                        <Route path="/" element={<Navigate to="/login" replace />} />
                    </Routes>
                </ThemeProvider>
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
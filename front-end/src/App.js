import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import {AuthProvider, useAuth} from "./context/AuthContext";
import Navbar from "./components/Navbar";
import {ThemeProvider} from "@mui/material";
import theme from './theme';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider theme={theme}>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/main" element={<ProtectedRoute component={MainPage} />} />
                        <Route path="/" element={<Navigate to="/login" replace />} />
                    </Routes>
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}

function ProtectedRoute({component: Component}) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
}

export default App;
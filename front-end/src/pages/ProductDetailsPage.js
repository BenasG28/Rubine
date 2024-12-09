import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import ProductDetail from "../components/ProductDetail"; // Import the new component
import { Box, CircularProgress, Typography } from '@mui/material';
import BackButton from "../components/BackButton";

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token') || '';
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!token) {
            console.warn("No token found. Cannot fetch product details.");
            setLoading(false);
            setError("Unauthorized");
            return;
        }

        axios
            .get(`/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching product details:", err);
                setError("Failed to load product details.");
                setLoading(false);
            });
    }, [productId, token]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <BackButton to="/main" />
            <ProductDetail product={product} />
        </Box>
    );};

export default ProductDetailsPage;
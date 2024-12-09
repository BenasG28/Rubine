import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const MainPage = () => {
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem('token') || ''; // Retrieve token or fallback to empty string
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!token) {
            console.warn("No token found. Skipping product fetch.");
            return;
        }


        axios.get("/products/all", {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => setProducts(response.data))
            .catch(error => {
                if (error.response) {
                    console.error("Server error:", error.response.status, error.response.data);
                } else if (error.request) {
                    console.error("Network error:", error.request);
                } else {
                    console.error("Unexpected error:", error.message);
                }
            });
    }, [token]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                    <div key={product.id} style={{ margin: 10 }}>
                        <ProductCard product={product} />
                    </div>
                ))
            ) : (
                <p style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#000',
                    textAlign: 'center',
                    fontFamily: 'Arial'
                }}>
                    Rubinė tuščia (╥﹏╥)
                </p>
            )}
        </div>
    );

};

export default MainPage;
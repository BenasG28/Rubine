import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { IconButton, InputAdornment, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import TextField from "@mui/material/TextField";

const MainPage = () => {
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem('token') || '';
    const { isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    useEffect(() => {
        if (!token) {
            console.warn("No token found. Skipping product fetch.");
            return;
        }

        if (!debouncedQuery) {
            axios.get("/products/all", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => setProducts(response.data))
                .catch(error => handleError(error));
        } else {
            axios.get(`/products/search?query=${debouncedQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => setProducts(response.data))
                .catch(error => handleError(error));
        }
    }, [debouncedQuery, token]);

    const handleError = (error) => {
        if (error.response) {
            console.error("Serverio problema:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("Interneto problema:", error.request);
        } else {
            console.error("Netikėta problema:", error.message);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 800);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                placeholder="Ieškoti..."
                sx={{
                    width: '30%',
                    borderRadius: '50px',
                    marginBottom: 3,
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                        '&.Mui-focused fieldset': {
                            borderColor: 'black',
                        },
                    },
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton size="small">
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {products.length ? (
                    products.map((product) => (
                        <div key={product.id} style={{ margin: 10 }}>
                            <ProductCard product={product} />
                        </div>
                    ))
                ) : (
                    <Typography sx={{ fontSize: '30px', fontFamily: 'roboto', fontWeight: '400' }}>
                        Rezultatų pagal paiešką nerasta.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default MainPage;
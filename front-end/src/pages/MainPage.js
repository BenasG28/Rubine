import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Box, IconButton, InputAdornment, Popover, MenuItem, Typography } from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const MainPage = () => {
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem('token') || '';
    const { isAuthenticated } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [color, setColor] = useState('');
    const [productType, setProductType] = useState('');
    const [filterAnchor, setFilterAnchor] = useState(null);

    const handleFetchProducts = useCallback((url) => {
        axios.get(url, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => setProducts(response.data))
            .catch(error => handleError(error));
    }, [token]);

    useEffect(() => {
        if (!token) {
            console.warn("No token found. Skipping product fetch.");
            return;
        }

        if (!debouncedQuery) {
            handleFetchProducts("/products/all");
        } else {
            handleFetchProducts(`/products/search?query=${debouncedQuery}`);
        }
    }, [debouncedQuery, handleFetchProducts, token]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 800);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleFilter = () => {
        const filterParams = [];
        if (color) filterParams.push(`color=${color}`);
        if (productType) filterParams.push(`productType=${productType}`);
        const queryString = filterParams.join('&');
        handleFetchProducts(`/products/filter?${queryString}`);
    };

    const handleResetFilters = () => {
        setColor('');
        setProductType('');
        setSearchQuery('');
        setDebouncedQuery('');
        handleFetchProducts("/products/all");
    };

    const handleError = (error) => {
        if (error.response) {
            console.error("Serverio problema:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("Interneto problema:", error.request);
        } else {
            console.error("Netikėta problema:", error.message);
        }
    };

    const handleOpenFilter = (event) => {
        setFilterAnchor(event.currentTarget);
    };

    const handleCloseFilter = () => {
        setFilterAnchor(null);
    };

    const isFilterOpen = Boolean(filterAnchor);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', mb: 3 }}>
                <TextField
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    placeholder="Ieškoti..."
                    fullWidth
                    sx={{
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
                            )
                        }
                    }}
                />
                <IconButton
                    sx={{ ml: 1 }}
                    onClick={handleOpenFilter}
                >
                    <FilterList />
                </IconButton>
                <Popover
                    open={isFilterOpen}
                    anchorEl={filterAnchor}
                    onClose={handleCloseFilter}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Box sx={{ p: 2, width: 250 }}>
                        <TextField
                            select
                            label="Spalva"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="">Visos spalvos</MenuItem>
                            <MenuItem value="Raudona">Raudona</MenuItem>
                            <MenuItem value="Mėlyna">Mėlyna</MenuItem>
                            <MenuItem value="Balta">Balta</MenuItem>
                            <MenuItem value="Juoda">Juoda</MenuItem>
                            <MenuItem value="Spalvota">Spalvota</MenuItem>
                            <MenuItem value="Geltona">Geltona</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Produkto tipas"
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
                            fullWidth
                            variant="outlined"
                        >
                            <MenuItem value="">Visi tipai</MenuItem>
                            <MenuItem value="UPPERBODY">Viršutinis drabužis</MenuItem>
                            <MenuItem value="LOWERBODY">Apatinis drabužis</MenuItem>
                        </TextField>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                handleFilter();
                                handleCloseFilter();
                            }}
                            fullWidth
                            sx={{ mt: 2, mb: 1}}
                        >
                            Filtruoti
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleResetFilters}
                            fullWidth
                        >
                            Išvalyti
                        </Button>
                    </Box>
                </Popover>
            </Box>

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
import React, { useState } from 'react';
import { Typography, Box, CardMedia, Button, FormHelperText } from '@mui/material';
import { useCart } from "../context/CartContext";

const availableSizes = ['S', 'M', 'L'];  // The available sizes in the system (enum or predefined list)

const ProductDetail = ({ product }) => {
    const { addItemToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('');
    const [error, setError] = useState(false);

    if (!product) return null; // Handle cases where product data is not yet available

    // Fallback for missing stock information
    const stock = product.productStocks || []; // Default to empty array if no productStocks

    // Create a mapping of sizes to their stock quantity
    const sizeStock = stock.reduce((acc, item) => {
        acc[item.size] = item.quantity;
        return acc;
    }, {});

    const handleSizeClick = (size) => {
        const quantity = sizeStock[size] || 0;  // Get the stock for the selected size
        if (quantity > 0) {
            setSelectedSize(size);  // Set the selected size
            setError(false);  // Reset error
        } else {
            setError(true);  // Show error if size is out of stock
        }
    };

    const handleAddToCart = () => {
        if (selectedSize) {
            addItemToCart(product.id, 1, selectedSize); // Add item to cart with selected size
        } else {
            setError(true); // Show error if no size is selected
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }, // Stacks on small screens, side-by-side on larger screens
                maxWidth: 1200,
                margin: '0 auto',
                gap: 4,
                padding: 2,
            }}
        >
            {/* Product Image */}
            <CardMedia
                component="img"
                image={product.imageUrl}
                alt={product.description}
                sx={{
                    maxWidth: 500
                }}
            />

            {/* Product Details */}
            <Box
                sx={{
                    flex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 2,
                }}
            >
                {/* Product Name */}
                <Typography sx={{ fontSize: '45px', fontFamily: 'roboto', fontWeight: '300', marginBottom: 3 }}>
                    {product.description}
                </Typography>

                {/* Price */}
                <Typography sx={{ fontSize: '30px', fontFamily: 'roboto', fontWeight: '450', marginBottom: 3 }}>
                    {product.price} eur
                </Typography>

                {/* Product Attributes (Color) */}
                <Typography sx={{ fontSize: '20px', fontFamily: 'roboto', fontWeight: 400, marginBottom: 1 }}>
                    Spalva: <span style={{ fontSize: '20px', fontFamily: 'roboto', fontWeight: 300 }}>{product.color}</span>
                </Typography>

                {/* Brand */}
                <Typography sx={{ fontSize: '20px', fontFamily: 'roboto', fontWeight: 400, marginBottom: 1 }}>
                    Prekės ženklas: <span style={{ fontSize: '20px', fontFamily: 'roboto', fontWeight: 300 }}>{product.brand}</span>
                </Typography>

                {/* Description */}
                <Typography sx={{ fontSize: '20px', fontFamily: 'roboto', fontWeight: 400 }}>
                    Aprašymas: <span style={{ fontSize: '20px', fontFamily: 'roboto', fontWeight: 300 }}>{product.description}</span>
                </Typography>

                {/* Sizes as buttons */}
                <Box sx={{ marginTop: 2 }}>
                    <Typography sx={{ fontSize: '20px', fontFamily: 'roboto', fontWeight: 400, marginBottom: 2 }}>
                        Pasirinkite dydį:
                    </Typography>
                    {availableSizes.map((size) => (
                        <Button
                            key={size}
                            onClick={() => handleSizeClick(size)}
                            sx={{
                                marginRight: 2,
                                marginBottom: 2,
                                backgroundColor:
                                    size === selectedSize
                                        ? '#888'  // Highlight the selected size
                                        : sizeStock[size] > 0
                                            ? '#000'  // Regular available size
                                            : '#b60000',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor:
                                        size === selectedSize
                                            ? '#666'  // Darker grey for selected size on hover
                                            : sizeStock[size] > 0
                                                ? '#555'  // Regular hover for available size
                                                : '#B0B0B0',
                                },
                                pointerEvents: sizeStock[size] > 0 ? 'auto' : 'none', // Disable click if out of stock
                                opacity: size === selectedSize ? 0.7 : 1, // Greys out the selected size a bit
                            }}
                            disabled={sizeStock[size] === 0} // Disable button if no stock
                        >
                            {size}
                        </Button>
                    ))}
                </Box>

                {/* Error if no size selected */}
                {error && <FormHelperText error>Pasirinkite dydį!</FormHelperText>}

                {/* Add to Cart Button */}
                <Button
                    variant="contained"
                    onClick={handleAddToCart}
                    sx={{
                        marginTop: 3,
                        marginBottom: 3,
                        fontFamily: 'roboto',
                        fontSize: '16px',
                        fontWeight: 300,
                        letterSpacing: '0.5px',
                        textTransform: 'none',
                        padding: '8px 16px', // Smaller padding for a more compact size
                        borderRadius: '8px',
                        width: '120px', // Set a smaller width
                        backgroundColor: '#000', // Greyish color
                        color: '#fff', // Ensure text color contrasts with background
                        boxShadow: 'none', // Remove extra shadow for simplicity
                        transition: 'background-color 0.3s ease, transform 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#555', // Dark grey on hover
                            transform: 'scale(1.02)', // Slightly larger on hover
                        },
                        '&:active': {
                            backgroundColor: '#777', // Lighter grey when active
                            transform: 'scale(1)', // Normal scale when active
                        },
                        '&:focus': {
                            outline: 'none',
                        },
                    }}
                >
                    Į KREPŠELĮ
                </Button>
            </Box>
        </Box>
    );
};

export default ProductDetail;
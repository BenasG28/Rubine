import React from 'react';
import { Typography, Box, CardMedia } from '@mui/material';
import {useCart} from "../context/CartContext";
import Button from "@mui/material/Button";

const ProductDetail = ({ product }) => {
    const { addItemToCart } = useCart();

    if (!product) return null; // Handle cases where product data is not yet available

    const handleAddToCart = () => {
        addItemToCart(product.id, 1);
    }

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
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CardMedia
                    component="img"
                    image={product.imageUrl}
                    alt={product.description}
                    sx={{
                        maxWidth: 1200
                    }}
                />
            </Box>

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
                <Typography variant="h4" gutterBottom>
                    {product.description}
                </Typography>

                {/* Price */}
                <Typography variant="h5" gutterBottom>
                    €{product.price}
                </Typography>

                {/* Product Attributes */}
                <Typography variant="body1" gutterBottom>
                    <strong>Spalva</strong> {product.color}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Prekės ženklas</strong> {product.brand}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Tipas</strong> {product.productType}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddToCart}
                    sx={{ marginTop: 2 }}
                >
                    Add to Cart
                </Button>
            </Box>
        </Box>
    );
};

export default ProductDetail;
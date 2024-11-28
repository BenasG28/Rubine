import React from 'react';
import { Typography, Box, CardMedia } from '@mui/material';

const ProductDetail = ({ product }) => {
    if (!product) return null; // Handle cases where product data is not yet available

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
            </Box>
        </Box>
    );
};

export default ProductDetail;
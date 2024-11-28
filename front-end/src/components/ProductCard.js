import React from 'react';
import { CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
    const { token } = useAuth();

    return (
        <CardActionArea component={Link} to={`/products/${product.id}`} sx={{ textDecoration: 'none', padding: 2 }}>
            {token && (
                <>
            {/* Image */}
            <CardMedia
                component="img"
                height="400"  // Increase the height for a larger image
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: 'cover', borderTopLeftRadius: 2, borderTopRightRadius: 2 }}  // Rounded corners for the image
            />

            {/* Text Content */}
            <CardContent sx={{ padding: 2 }}>
                {/* Product Description */}
                <Typography variant="body2" sx={{ fontSize: '14px', lineHeight: '1.4' }}>
                    {product.description.length > 100 ? `${product.description.slice(0, 100)}...` : product.description}
                </Typography>

                {/* Price */}
                <Typography variant="body2">
                    {`€${product.price}`}
                </Typography>
            </CardContent>
                </>
            )}
        </CardActionArea>
    );
};

export default ProductCard;
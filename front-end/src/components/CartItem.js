import React from 'react';
import { IconButton, Card, CardContent, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = ({ item, onRemove }) => {
    return (
        <Card variant="outlined" sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Box sx={{ flex: 1, padding: 2 }}>
                <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100%', maxWidth: 200 }} />
            </Box>

            <Box sx={{ flex: 3, padding: 2 }}>
                <CardContent sx={{ padding: 0 }}>
                    <Typography variant="h6">{item.product.name}</Typography>
                    <Typography variant="body2">Kaina: €{item.product.price}</Typography>
                    <Typography variant="body2">Kiekis: {item.quantity}</Typography>
                    <Typography variant="body2">Dydis: {item.productSize}</Typography>
                    <Typography variant="body2">Bendra suma: €{item.quantity * item.product.price}</Typography>
                </CardContent>
            </Box>

            <Box sx={{ flex: 1, padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton color="black" onClick={() => onRemove(item.id)}>
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Card>
    );
};

export default CartItem;
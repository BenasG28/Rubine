import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Paper, Box } from '@mui/material';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const CartPage = () => {
    const { cart, removeItemFromCart, clearCart } = useCart();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (cart && cart.items) {
            const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            setTotalPrice(total);
        }
    }, [cart]);

    const handleRemoveItem = (itemId) => {
        removeItemFromCart(itemId);
    };

    const handleClearCart = () => {
        clearCart();
    };

    const handleMakeOrder = () => {
        console.log("Order is being made...");
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Krepšelis</Typography>
            <Paper sx={{ p: 3 }}>
                {cart && cart.items  && cart.items.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {cart.items.map(item => (
                            <CartItem key={item.id} item={item} onRemove={handleRemoveItem} />
                        ))}
                    </Box>
                ) : (
                    <Typography variant="h6">Jūsų krepšelis tuščias!</Typography>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Bendra suma: €{totalPrice.toFixed(2)}</Typography>
                    <Box>
                        <Button variant="contained" color="secondary" onClick={handleClearCart} sx={{ mr: 2 }}>
                            Išvalyti krepšelį
                        </Button>
                        <Button variant="contained" onClick={handleMakeOrder}>
                            Pateikti užsakymą
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CartPage;
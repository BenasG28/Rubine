import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    Typography,
    Paper,
    Box,
    Snackbar,
    CircularProgress,
    DialogActions,
    FormControlLabel, Radio, RadioGroup, DialogContent, DialogTitle, Dialog
} from '@mui/material';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import {useAuth} from "../context/AuthContext";
import { useFormik } from 'formik';
import paymentValidationSchema from "../validation/paymentValidationSchema";
import axios from "axios";
import TextField from "@mui/material/TextField";

const CartPage = () => {
    const { cart, removeItemFromCart, clearCart } = useCart();
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { user, token } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: '' });



    useEffect(() => {
        if (cart && cart.items) {
            const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            setTotalPrice(total);
        }
    }, [cart]);

    const formik = useFormik({
        initialValues: {
            paymentMethod: 'CASH',
            cardNumber: ''
        },
        validationSchema: paymentValidationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                if (cart.items.length === 0) {
                    setNotification({ open: true, message: 'Krepšelis yra tuščias!', severity: 'error' });
                    return;
                }

                await axios.post(`/orders/${user.id}/place`, {
                    paymentMethod: values.paymentMethod,
                    cardNumber: values.paymentMethod === 'CARD' ? values.cardNumber : null
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                setIsLoading(false);
                setOpenDialog(false);
                setNotification({ open: true, message: 'Užsakymas sėkmingai pateiktas!', severity: 'success' });
                clearCart();

            } catch (err) {
                console.error('Error placing order:', err.response ? err.response.data : err.message);
                setIsLoading(false);
                setNotification({ open: true, message: 'Įvyko klaida, bandykite dar kartą.', severity: 'error' });
            }
        }
    });


    const handleRemoveItem = (itemId) => {
        removeItemFromCart(itemId);
    };

    const handleClearCart = () => {
        clearCart();
    };

    const handlePlaceOrder = () => {
        formik.handleSubmit();
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
                        <Button variant="contained" onClick={() => setOpenDialog(true)}>
                            Pateikti užsakymą
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Pasirinkite apmokėjimo metodą</DialogTitle>
                <DialogContent>
                    <RadioGroup
                        name="paymentMethod"
                        value={formik.values.paymentMethod}
                        onChange={formik.handleChange}
                    >
                        <FormControlLabel value="CASH" control={<Radio />} label="Grynaisiais" />
                        <FormControlLabel value="CARD" control={<Radio />} label="Kortele" />
                    </RadioGroup>

                    {formik.values.paymentMethod === 'CARD' && (
                        <TextField
                            label="Kortelės numeris"
                            variant="outlined"
                            fullWidth
                            name="cardNumber"
                            value={formik.values.cardNumber}
                            onChange={formik.handleChange}
                            error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
                            helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                            sx={{ mt: 2 }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Atšaukti
                    </Button>
                    <Button
                        onClick={handlePlaceOrder}
                        color="primary"
                        disabled={isLoading || cart.items.length === 0}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Patvirtinti'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
                message={notification.message}
            />

        </Container>
    );
};

export default CartPage;
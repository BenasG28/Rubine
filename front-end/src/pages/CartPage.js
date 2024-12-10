import React, { useEffect, useState } from 'react';
import {
    Button,
    Container,
    Typography,
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
            <Typography
                sx={{
                    marginBottom: 3,
                    display: 'inline-block',
                    fontFamily: 'roboto',
                    fontSize: '32px',
                    fontWeight: 400,
                    height: '40px',
                    textTransform: 'none',
                    verticalAlign: 'middle',
                    WebkitFontSmoothing: 'antialiased',
                }}
            >
                Krepšelis
            </Typography>

                {cart?.items?.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {cart.items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onRemove={handleRemoveItem}
                            />
                        ))}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <Typography variant="h6">Bendra suma: €{totalPrice.toFixed(2)}</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleClearCart}
                                    sx={{
                                        fontFamily: 'roboto',
                                        fontSize: '16px',
                                        fontWeight: 300,
                                        letterSpacing: '0.5px',
                                        textTransform: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        backgroundColor: '#DC143C',
                                        color: '#fff',
                                        boxShadow: 'none',
                                        transition: 'background-color 0.3s ease, transform 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: '#f4103b',
                                            transform: 'scale(1.02)',
                                        },
                                        '&:active': {
                                            backgroundColor: '#777',
                                            transform: 'scale(1)',
                                        },
                                        '&:focus': {
                                            outline: 'none',
                                        },
                                    }}
                                >
                                    Išvalyti krepšelį
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setOpenDialog(true)}
                                    sx={{
                                        fontFamily: 'roboto',
                                        fontSize: '16px',
                                        fontWeight: 300,
                                        letterSpacing: '0.5px',
                                        textTransform: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        boxShadow: 'none',
                                        transition: 'background-color 0.3s ease, transform 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: '#555',
                                            transform: 'scale(1.02)',
                                        },
                                        '&:active': {
                                            backgroundColor: '#777',
                                            transform: 'scale(1)',
                                        },
                                        '&:focus': {
                                            outline: 'none',
                                        },
                                    }}
                                >
                                    Pateikti užsakymą
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="h6" align="center">
                        Jūsų krepšelis tuščias!
                    </Typography>
                )}


            {/* Dialog for payment method */}
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

            {/* Notification */}
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
import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Snackbar, Alert } from '@mui/material';


const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user, token, loading } = useAuth();
    const [cart, setCart] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: '' });

    const fetchCart = useCallback(async () => {
        if (!user || !token) {
            return;
        }
        try {
            const response = await axios.get(`/cart/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCart(response.data);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            setNotification({ open: true, message: 'Nepavyko užkrauti krepšelio.', severity: 'error' });
        }
    },[token, user]);

    useEffect(() => {
        if (loading) {
            return;
        }
        fetchCart();
    }, [user, token, loading, fetchCart]);

    const addItemToCart = async (productId, quantity) => {
        try {
            const response = await axios.post(`/cart/${user.id}/add`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { productId, quantity },
            });
            setCart(response.data);
            setNotification({ open: true, message: 'Prekė pridėta į krepšelį sėkmingai!', severity: 'success' });
        } catch (err) {
            setNotification({ open: true, message: 'Įvyko klaida pridėdant prekę į krepšelį', severity: 'error' });
            console.error("Failed to add item to cart:", err);
        }
    };

    const removeItemFromCart = async (productId) => {
        try {
            const response = await axios.delete(`/cart/${user.id}/remove`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { productId },
            });
            setCart(response.data);
            setNotification({ open: true, message: 'Prekė pašalinta iš krepšelio.', severity: 'success' });
        } catch (err) {
            console.error("Failed to remove item from cart:", err);
            setNotification({ open: true, message: 'Nepavyko pašalinti prekės iš krepšelio.', severity: 'error' });
        }
    };

    const clearCart = async () => {
        try {
            const response = await axios.delete(`/cart/${user.id}/clear`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCart(response.data);
            setNotification({ open: true, message: 'Krepšelis išvalytas sėkmingai!', severity: 'success' });
        } catch (error) {
            console.error("Error clearing cart:", error);
            setNotification({ open: true, message: 'Nepavyko išvalyti krepšelio.', severity: 'error' });
        }
    };

    const handleCloseNotification = () => {
        setNotification((prev) => ({ ...prev, open: false }));
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addItemToCart,
                removeItemFromCart,
                clearCart,
            }}
        >
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </CartContext.Provider>
    );
};
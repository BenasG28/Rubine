import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from 'axios';
import {
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    RadioGroup,
    FormControlLabel, Radio
} from '@mui/material';


const ProductListPage = () => {
    const { isAuthenticated } = useAuth();
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const token = localStorage.getItem('token');
    const [newProduct, setNewProduct] = useState({
        brand: '',
        color: '',
        description: '',
        imageUrl: '',
        price: '',
        productType: ''
    });


    useEffect(() => {
        axios.get("/products/all", {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error fetching products:", error));
    }, [token]);


    const handleCreateProduct = () => {
        axios.post('/products/create', newProduct, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                setProducts([...products, response.data]);  // Update products list
                setNewProduct({
                    brand: '',
                    color: '',
                    description: '',
                    imageUrl: '',
                    price: '',
                    productType: ''
                });
                handleClose();
            })
            .catch(error => console.error("Error creating product:", error));
    };

    const handleEditProduct = () => {
        if (editProduct && editProduct.id) {
            axios.put(`/products/update/${editProduct.id}`, editProduct, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then(response => {
                    // Merge updated product with existing products
                    setProducts(prevProducts =>
                        prevProducts.map(product =>
                            product.id === editProduct.id ? { ...product, ...response.data } : product
                        )
                    );
                    handleEditClose();
                })
                .catch(error => console.error("Error updating product:", error));
        }
    };

    const handleDeleteProduct = (id) => {
        axios.delete(`/products/delete/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(() => {
                setProducts(products.filter(product => product.id !== id));  // Remove deleted product
            })
            .catch(error => console.error("Error deleting product:", error));
    };

    //------------------------------[NEW]--------------------------------------------
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false);
        setNewProduct({
            brand: '',
            color: '',
            description: '',
            imageUrl: '',
            price: '',
            productType: ''
        });
    };
    //------------------------------[EDIT]--------------------------------------------
    const handleEditOpen = (product) => {
        setEditProduct(product);
        setEditOpen(true);
    };
    const handleEditClose = () => setEditOpen(false);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace />;
    }


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                minHeight: '100vh',
                padding: 2,
            }}
        >
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                    variant="h5"
                    sx={{
                        marginBottom: 3,
                        display: 'inline-block',
                        fontFamily: 'Montserrat, Arial, sans-serif',
                        fontSize: '32px',
                        fontWeight: 600,
                        height: '40px',
                        textTransform: 'none',
                        verticalAlign: 'middle',
                        WebkitFontSmoothing: 'antialiased', // To apply webkit smoothing
                    }}
                >
                    Produktų sąrašas
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    sx={{
                        marginBottom: 3,
                        fontFamily: 'Montserrat, Arial, sans-serif', // Match the font family
                        fontSize: '16px', // Adjust font size for readability
                        fontWeight: 300, // Semi-bold text for a stronger appearance
                        letterSpacing: '0.5px', // Slight spacing for better readability
                        textTransform: 'none', // Remove automatic uppercase
                        padding: '10px 20px', // Adjust padding for a larger, more clickable area
                        borderRadius: '8px', // Rounded corners for a modern look
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                        transition: 'background-color 0.3s ease, transform 0.3s ease', // Smooth transition for hover effect
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                            transform: 'scale(1.05)',
                        },
                        '&:active': {
                            backgroundColor: 'primary.main',
                            transform: 'scale(1)',
                        },
                        '&:focus': {
                            outline: 'none',
                        },
                    }}
                >
                    NAUJAS PRODUKTAS
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ width: '100%' }}>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Produkto prekinis ženklas</TableCell>
                            <TableCell>Spalva</TableCell>
                            <TableCell>Aprašymas</TableCell>
                            <TableCell>Nuotraukos URL</TableCell>
                            <TableCell>Kaina</TableCell>
                            <TableCell>Produkto tipas</TableCell>
                            <TableCell>Veiksmai</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.brand}</TableCell>
                                    <TableCell>{product.color}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>{product.imageUrl}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.productType}</TableCell>
                                    <TableCell>
                                        <Button size="small" onClick={() => handleEditOpen(product)}>Redaguoti</Button>
                                        <Button size="small" color="error" onClick={() => handleDeleteProduct(product.id)}>Trinti</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Nėra produktų sąraše
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for product creation */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Pridėti naują produktą</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Produkto prekinis ženklas"
                        type="text"
                        fullWidth
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Spalva"
                        type="text"
                        fullWidth
                        value={newProduct.color}
                        onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Aprašymas"
                        type="text"
                        fullWidth
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Nuotraukos URl"
                        type="text"
                        fullWidth
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Kaina"
                        type="number"
                        fullWidth
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <RadioGroup
                        row
                        value={newProduct.productType}
                        onChange={(e) => setNewProduct({ ...newProduct, productType: e.target.value })}
                    >
                        <FormControlLabel value="UPPERBODY" control={<Radio />} label="Viršutinė Kūno Dalis" />
                        <FormControlLabel value="LOWERBODY" control={<Radio />} label="Apatinė Kūno Dalis" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Atšaukti</Button>
                    <Button onClick={handleCreateProduct} color="primary">Sukurti</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for editing a product */}
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Redaguoti produktą</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Produkto prekinis ženklas"
                        type="text"
                        fullWidth
                        value={editProduct?.brand || ""}
                        onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Spalva"
                        type="text"
                        fullWidth
                        value={editProduct?.color}
                        onChange={(e) => setEditProduct({ ...editProduct, color: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Aprašymas"
                        type="text"
                        fullWidth
                        value={editProduct?.description || ""}
                        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Nuotraukos URL"
                        type="text"
                        fullWidth
                        value={editProduct?.imageUrl || ""}
                        onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Kaina"
                        type="number"
                        fullWidth
                        value={editProduct?.price || ""}
                        onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                    />
                    <RadioGroup
                        row
                        value={editProduct?.productType || ""}
                        onChange={(e) => setEditProduct({ ...editProduct, productType: e.target.value })}
                    >
                        <FormControlLabel value="UPPERBODY" control={<Radio />} label="Viršutinė Kūno Dalis" />
                        <FormControlLabel value="LOWERBODY" control={<Radio />} label="Apatinė Kūno Dalis" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="secondary">Atšaukti</Button>
                    <Button onClick={handleEditProduct} color="primary">Atnaujinti</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default ProductListPage;
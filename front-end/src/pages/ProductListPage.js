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
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    RadioGroup,
    FormControlLabel, Radio, IconButton, Stack
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';


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
        productType: '',
    });
    //-----[Sizes, Stock]-----
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editProductDetails, setEditProductDetails] = useState({
        size: '',
        stock: '',
    });


    useEffect(() => {
        axios.get("/products/all", {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response.data);
                setProducts(response.data)
            })
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
                    productType: '',
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
    //
    // const handleUpdateProductDetails = () => {
    //     if (!selectedProduct?.id) return;
    //
    //     const updatedProduct = {
    //         ...selectedProduct,
    //         size: editProductDetails.size,
    //         stock: editProductDetails.stock,
    //     };
    //
    //     axios.put(`/products/updateStock/${selectedProduct.id}?size=${updatedProduct.size}&quantity=${updatedProduct.stock}`, updatedProduct, {
    //         headers: { 'Authorization': `Bearer ${token}` },
    //     })
    //         .then((response) => {
    //             // Merge updated product with the existing products list
    //             setProducts((prevProducts) =>
    //                 prevProducts.map((product) =>
    //                     product.id === selectedProduct.id ? { ...product, ...response.data } : product
    //                 )
    //             );
    //             handleDetailsClose(); // Close the modal
    //         })
    //         .catch((error) => {
    //             console.error("Error updating product details:", error);
    //             if (error.response) {
    //                 console.error("Response error:", error.response.data);
    //             }
    //         });
    // };
    const handleUpdateProductDetails = () => {
        if (!selectedProduct?.id) return;

        const updatedProductStock = {
            size: editProductDetails.size,
            quantity: editProductDetails.stock,
        };

        axios.put(`/products/updateStock/${selectedProduct.id}`, updatedProductStock, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then((response) => {
                // Optionally, re-fetch the product list
                axios.get('/products/all', {
                    headers: { 'Authorization': `Bearer ${token}` },
                })
                    .then((fetchResponse) => {
                        setProducts(fetchResponse.data); // Update state with the latest products from the server
                    })
                    .catch((fetchError) => {
                        console.error("Error fetching product list:", fetchError);
                    });

                handleDetailsClose(); // Close the modal
            })
            .catch((error) => {
                console.error("Error updating product details:", error);
                if (error.response) {
                    console.error("Response error:", error.response.data);
                }
            });
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
            productType: '',
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

    //------------------------------[STOCK, SIZE]--------------------------------------------
    const handleDetailsOpen = (product) => {
        setSelectedProduct(product);
        setEditProductDetails({
            size: product.size || "",
            stock: product.stock || "",
        });
        setOpenDetails(true);
    };
    const handleDetailsClose = () => {
        setOpenDetails(false);
        setSelectedProduct(null);
    };

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
                    sx={{
                        marginBottom: 3,
                        display: 'inline-block',
                        fontFamily: 'roboto',
                        fontSize: '32px',
                        fontWeight: 400,
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
                    onClick={handleClickOpen}
                    sx={{
                        marginBottom: 3,
                        fontFamily: 'roboto',
                        fontSize: '16px',
                        fontWeight: 300,
                        letterSpacing: '0.5px',
                        textTransform: 'none',
                        padding: '8px 16px', // Smaller padding for a more compact size
                        borderRadius: '8px',
                        backgroundColor: '#000',
                        color: '#fff',
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
                    NAUJAS PRODUKTAS
                </Button>
            </Box>
                <Table sx={{ width: '100%', tableLayout: 'auto', overflowX: 'auto', display: 'block' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Produkto prekinis ženklas</TableCell>
                            <TableCell>Spalva</TableCell>
                            <TableCell>Aprašymas</TableCell>
                            <TableCell>Nuotraukos URL</TableCell>
                            <TableCell>Kaina</TableCell>
                            <TableCell>Produkto tipas</TableCell>
                            <TableCell>Sandėlio kiekis ir Dydis</TableCell> {/* New column for stock and size */}
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
                                    <TableCell
                                        sx={{
                                            wordBreak: 'break-word',   // Allow word wrapping for long text (URLs)
                                            overflow: 'hidden',        // Hide any overflow
                                            textOverflow: 'ellipsis',  // Optionally add ellipsis for overflowed text
                                            whiteSpace: 'normal',      // Allow text to wrap
                                            padding: '8px',            // Adjust padding for a compact look
                                        }}
                                    >
                                        {product.imageUrl}
                                    </TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.productType}</TableCell>
                                    <TableCell>
                                        {product.productStocks.map(stock => (
                                            <Typography key={stock.id}>
                                                {`Dydis: ${stock.size}, Kiekis: ${stock.quantity}`}
                                            </Typography>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" alignItems="flex-start">
                                            <IconButton onClick={() => handleEditOpen(product)} sx={{ color: '#000', fontWeight: '300' }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteProduct(product.id)} sx={{ color: '#DC143C' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDetailsOpen(product)} sx={{ color: '#000' }}>
                                                <InfoIcon /> {/* Add InfoIcon to indicate it's for details */}
                                            </IconButton>
                                        </Stack>
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


            {/* Dialog for viewing product details */}
            <Dialog open={openDetails} onClose={handleDetailsClose}>
                <DialogTitle>Produkto Detalės</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">Produkto prekinis ženklas: {selectedProduct?.brand}</Typography>
                    <Typography variant="body1">Spalva: {selectedProduct?.color}</Typography>
                    <Typography variant="body1">Aprašymas: {selectedProduct?.description}</Typography>
                    <Typography variant="body1">Kaina: {selectedProduct?.price} EUR</Typography>
                    <Typography variant="body1">Produkto tipas: {selectedProduct?.productType}</Typography>

                    {/* Editable size field */}
                    <TextField
                        label="Dydis"
                        fullWidth
                        value={editProductDetails.size}
                        onChange={(e) => setEditProductDetails({ ...editProductDetails, size: e.target.value })}
                        sx={{ marginBottom: 2 }}
                    />

                    {/* Editable stock field */}
                    <TextField
                        label="Kiekis sandėlyje"
                        type="number"
                        fullWidth
                        value={editProductDetails.stock}
                        onChange={(e) => setEditProductDetails({ ...editProductDetails, stock: e.target.value })}
                        sx={{ marginBottom: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailsClose} sx={{ color: '#DC143C' }}>Uždaryti</Button>
                    <Button onClick={handleUpdateProductDetails} sx={{ color: '#000' }}>Išsaugoti</Button>
                </DialogActions>
            </Dialog>


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
                    <Button onClick={handleClose} sx={{ color: '#DC143C'}}>Atšaukti</Button>
                    <Button onClick={handleCreateProduct} sx={{ color: '#000'}}>Sukurti</Button>
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
                    <Button
                        onClick={handleEditClose}
                        sx={{
                                fontFamily: 'roboto',
                                color: '#DC143C',
                            }}

                    >Atšaukti</Button>
                    <Button
                        onClick={handleEditProduct}  sx={{
                        fontFamily: 'roboto',
                        color: '#000',
                    }}
                    >Atnaujinti</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default ProductListPage;
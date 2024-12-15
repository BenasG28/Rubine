import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from 'axios';
import {
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
    FormControlLabel, Radio, IconButton, Stack, FormControl, InputLabel, Select, MenuItem, Container
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import DeclineButton from "../components/Buttons/DeclineButton";
import AcceptButton from "../components/Buttons/AcceptButton";
import AddButton from "../components/Buttons/AddButton";
import ListHeading from "../components/ListHeading";
import ReportDownloadDialog from "../components/ReportDownloadDialog";
import TableBox from "../components/TableBox";

const ProductListPage = () => {
    const { isAuthenticated } = useAuth();
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const token = localStorage.getItem('token');
    // report dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [allData, setAllData] = useState(false);
    const [productType, setProductType] = useState("");
    const sizes = ['s', 'm', 'l'];
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

    const handleReportOpenDialog = () => setDialogOpen(true);
    const handleReportCloseDialog = () => setDialogOpen(false);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <ListHeading>Produktų sąrašas</ListHeading>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <AddButton onClick={handleReportOpenDialog}>ATSISIŲSKIT ATASKAITĄ</AddButton>
                    <AddButton onClick={handleClickOpen}>NAUJAS PRODUKTAS</AddButton>
                </Box>
            </Box>

            <TableBox>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produkto prekinis ženklas</TableCell>
                            <TableCell>Spalva</TableCell>
                            <TableCell>Aprašymas</TableCell>
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
                                    <TableCell>{product.brand}</TableCell>
                                    <TableCell>{product.color}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.productType}</TableCell>
                                    <TableCell>
                                        {product.productStocks.map(stock => (
                                            <Typography key={stock.id} sx={{    fontSize: '15px',
                                                fontFamily: 'Roboto',
                                                fontWeight: 300,}}>
                                                {`Dydis: ${stock.size} Kiekis: ${stock.quantity}`}
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
                                <TableCell colSpan={7} align="center">
                                    Nėra produktų sąraše
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableBox>


            {/* Dialog for viewing product details */}
            <Dialog open={openDetails} onClose={handleDetailsClose}>
                <DialogTitle>Produkto Detalės</DialogTitle>
                <DialogContent>
                    {/* Editable size field */}
                    {/*<TextField*/}
                    {/*    label="Dydis"*/}
                    {/*    fullWidth*/}
                    {/*    value={editProductDetails.size}*/}
                    {/*    onChange={(e) => setEditProductDetails({ ...editProductDetails, size: e.target.value })}*/}
                    {/*    sx={{ marginBottom: 2 }}*/}
                    {/*/>*/}
                    {/* Dydžio pasirinkimas */}
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>Dydis</InputLabel>
                        <Select
                            value={editProductDetails.size}
                            onChange={(e) => setEditProductDetails({ ...editProductDetails, size: e.target.value })}
                            label="Dydis"
                        >
                            {sizes.map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size.toUpperCase()} {/* Rodo dydį didžiosiomis raidėmis */}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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
                    <DeclineButton onClick={handleDetailsClose}></DeclineButton>
                    <AcceptButton onClick={handleUpdateProductDetails}>Išsaugoti</AcceptButton>
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
                    <DeclineButton onClick={handleClose}></DeclineButton>
                    <AcceptButton onClick={handleCreateProduct}>Sukurti</AcceptButton>
                </DialogActions>
            </Dialog>

            {/* Dialog for report */}
            <ReportDownloadDialog
                open={dialogOpen}
                onClose={handleReportCloseDialog}
                reportType="product"
                startDate={startDate}
                endDate={endDate}
                allData={allData}
                productType={productType}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setProductType={setProductType}
                setAllData={setAllData}
            />

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
                    <DeclineButton onClick={handleEditClose}></DeclineButton>
                    <AcceptButton onClick={handleEditProduct}>Atnaujinti</AcceptButton>
                </DialogActions>
            </Dialog>
</Container>
    );
};
export default ProductListPage;
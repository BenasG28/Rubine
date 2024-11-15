import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import axios from "axios";

const ReportListPage = () => {
    const [open, setOpen] = useState(false);
    const [reportType, setReportType] = useState("user"); // Default to "user"
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [allData, setAllData] = useState(false);
    const [productType, setProductType] = useState(""); // New state for product type

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setReportType("user");
        setStartDate("");
        setEndDate("");
        setProductType(""); // Reset productType
        setAllData(false);
    };

    const handleDownload = async () => {
        try {
            const endpoint = `/reports/${reportType}`;
            let params = {};

            if (!allData) {
                if (reportType === "user") {
                    params = { startDate, endDate };
                } else if (reportType === "product") {
                    params = { productType }; // Use productType for filtering
                } else if (reportType === "order") {
                    params = { startDate, endDate };
                }
            }

            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                responseType: "blob",
                params,
            });

            // Create a temporary download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${reportType}_report.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading the report", error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Ataskaitos
            </Typography>

            {/* Button to open the dialog */}
            <Box sx={{ marginBottom: 2 }}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Ataskaitos siuntimas
                </Button>
            </Box>

            {/* Dialog for report options */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Report Options</DialogTitle>
                <DialogContent>
                    {/* Dropdown for selecting report type */}
                    <FormControl fullWidth margin="dense" sx={{ marginBottom: 2 }}>
                        <InputLabel id="report-type-label">Ataskaitos tipas</InputLabel>
                        <Select
                            labelId="report-type-label"
                            value={reportType}
                            onChange={(e) => {
                                setReportType(e.target.value);
                                setAllData(false);
                                setStartDate("");
                                setEndDate("");
                                setProductType("");
                            }}
                        >
                            <MenuItem value="user">Vartotojai</MenuItem>
                            <MenuItem value="product">Produktai</MenuItem>
                            <MenuItem value="order">Užsakymai</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Checkbox for "Download All" */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={allData}
                                onChange={(e) => setAllData(e.target.checked)}
                            />
                        }
                        label="Visos informacijos siuntimas"
                    />

                    {/* Dynamic fields based on report type */}
                    {reportType === "user" && !allData && (
                        <>
                            <TextField
                                fullWidth
                                label="Gimimo datos pradžia"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                margin="dense"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth
                                label="Gimimo datos pabaiga"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                margin="dense"
                                InputLabelProps={{ shrink: true }}
                            />
                        </>
                    )}
                    {reportType === "product" && !allData && (
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="product-type-label">Drabužio tipas</InputLabel>
                            <Select
                                labelId="product-type-label"
                                value={productType}
                                onChange={(e) => setProductType(e.target.value)}
                            >
                                <MenuItem value="UPPERBODY">Viršutinė kūno dalis</MenuItem>
                                <MenuItem value="LOWERBODY">Apatinė kūno dalis</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    {reportType === "order" && !allData && (
                        <>
                            <TextField
                                fullWidth
                                label="Užsakymo datos pradžia"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                margin="dense"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth
                                label="Užsakymo datos pabaiga"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                margin="dense"
                                InputLabelProps={{ shrink: true }}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleDownload();
                            handleClose();
                        }}
                        color="primary"
                    >
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReportListPage;

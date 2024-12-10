import { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";
import axios from "axios";
import DeclineButton from "./Buttons/DeclineButton";

const ReportDownloadDialog = ({
                                  open,
                                  onClose,
                                  reportType,
                                  startDate,
                                  endDate,
                                  allData,
                                  productType,
                                  setStartDate,
                                  setEndDate,
                                  setProductType,
                                  setAllData,
                              }) => {

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

    useEffect(() => {
        // Reset fields on opening the dialog
        if (open) {
            setStartDate("");
            setEndDate("");
            setProductType("");
            setAllData(false);
        }
    }, [open, setStartDate, setEndDate, setProductType, setAllData]);

    const reportTitles = {
        user: "Naudotojo ataskaita",
        product: "Produktų ataskaita",
        order: "Užsakymų ataskaita",
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{reportTitles[reportType] || "Ataskaita"}</DialogTitle>
            <DialogContent>
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
                <DeclineButton onClick={onClose}></DeclineButton>
                <Button onClick={handleDownload} color="primary">
                    Parsisiųsti
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReportDownloadDialog;
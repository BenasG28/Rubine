import { useAuth } from "../context/AuthContext";
import {Navigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Alert,
    Box, Container, IconButton,
    Snackbar, Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import AddButton from "../components/Buttons/AddButton";
import ListHeading from "../components/ListHeading";
import ReportDownloadDialog from "../components/ReportDownloadDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableBox from "../components/TableBox";
import UserDetailsDialog from "../components/Dialogs/UserDetailsDialog";

const UserListPage = () => {
    // const navigate = useNavigate();
    const { isAuthenticated, roles } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    // report dialog
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [allData, setAllData] = useState(false);
    const [productType, setProductType] = useState("");
    const [userIdToEdit, setUserIdToEdit] = useState(null); // For editing or creating user

    useEffect(() => {
        if (isAuthenticated && (roles.includes('SYS_ADMIN') || roles.includes('ADMIN'))) {
                axios.get('/users/all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                })
                    .then((res) => setUsers(res.data))
                    .catch((err) => {
                        setError('Error fetching users');
                        setOpenSnackbar(true);
                        console.error('Error fetching users', err);
                    }).finally(() => {
                    setLoading(false);
                });
        }
    }, [isAuthenticated, roles]);


    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace />
    }

    if (!roles.includes('SYS_ADMIN') && !roles.includes('ADMIN')) {
        return <Navigate to={"/"} replace />;
    }

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            setError('Error deleting user');
            setOpenSnackbar(true);
        }
    }

    // Handle Create User
    const handleCreateUser = () => {
        setUserIdToEdit('new');
        setUserDialogOpen(true); // Open dialog for creating new user
    };

    // Handle Edit User
    const handleEditUser = (userId) => {
        setUserIdToEdit(userId);
        setUserDialogOpen(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleReportOpenDialog = () => setReportDialogOpen(true);
    const handleReportCloseDialog = () => setReportDialogOpen(false);

    const handleSaveUser = (newUser) => {
        setUsers((prevUsers) => {
            const userExists = prevUsers.some((user) => user.id === newUser.id);

            if (!userExists) {
                // Add the new user if it doesn't already exist
                return [...prevUsers, newUser];
            } else {
                // Update the existing user
                return prevUsers.map((user) =>
                    user.id === newUser.id ? newUser : user
                );
            }
        });
        setUserDialogOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <ListHeading>Vartotojai</ListHeading>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <AddButton onClick={handleReportOpenDialog}>ATSISIŲSKIT ATASKAITĄ</AddButton>
                    <AddButton onClick={() => handleCreateUser('new')}>NAUJAS VARTOTOJĄ</AddButton>
                </Box>
            </Box>

            <TableBox>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Vardas</TableCell>
                            <TableCell>Pavardė</TableCell>
                            <TableCell>El. paštas</TableCell>
                            <TableCell>Tel. nr.</TableCell>
                            <TableCell>Veiksmai</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} sx={{ cursor: 'pointer' }}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.surname}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <IconButton onClick={() => handleEditUser(user.id)} sx={{ color: '#000' }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteUser(user.id)} sx={{ color: '#DC143C' }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableBox>

            <ReportDownloadDialog
                open={reportDialogOpen}
                onClose={handleReportCloseDialog}
                reportType="user"
                startDate={startDate}
                endDate={endDate}
                allData={allData}
                productType={productType}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setProductType={setProductType}
                setAllData={setAllData}
            />

            <UserDetailsDialog
                open={userDialogOpen}
                onClose={() => setUserDialogOpen(false)}
                userId={userIdToEdit}
                onSave={handleSaveUser}
            />

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UserListPage;
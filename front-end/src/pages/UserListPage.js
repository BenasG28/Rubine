import { useAuth } from "../context/AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import {
    Alert,
    Box,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

const UserListPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, roles } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

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

    const handleCreateUser = () => {
        navigate(`/user-details/new`, { state: { isEditMode: true } });
    };

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

    const handleEditUser = (userId) => {
        navigate(`/user-details/${userId}`, { state: { isEditMode: true } });
    }

    const handleRowClick = (userId) => {
        navigate(`/user-details/${userId}`, { state: { isEditMode: false } });
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    if (loading) {
        return <div>Loading...</div>;
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
                <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
                    Vartotojai
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateUser}
                    sx={{ marginBottom: 2 }}
                >
                    Sukurti vartotoją
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ width: '100%' }}>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow sx={{ display: 'flex', width: '100%' }}>
                            <TableCell sx={{ flex: 1 }}>Vardas</TableCell>
                            <TableCell sx={{ flex: 1 }}>Pavardė</TableCell>
                            <TableCell sx={{ flex: 1 }}>El. paštas</TableCell>
                            <TableCell sx={{ flex: 1 }}>Tel. nr.</TableCell>
                            <TableCell sx={{ flex: 1 }}>Veiksmai</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}
                                      sx={{ display: 'flex', cursor: 'pointer' }}
                                      onClick={() => handleRowClick(user.id)}
                            >
                                <TableCell sx={{ flex: 1 }}>{user.name}</TableCell>
                                <TableCell sx={{ flex: 1 }}>{user.surname}</TableCell>
                                <TableCell sx={{ flex: 1 }}>{user.email}</TableCell>
                                <TableCell sx={{ flex: 1 }}>{user.phoneNumber}</TableCell>
                                {/* TODO Make buttons more flexible on smaller screens */}
                                <TableCell sx={{ flex: 1 }}>
                                    <Button variant="outlined"
                                            sx={{ marginRight: 1 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditUser(user.id);
                                            }}
                                    >
                                        Redaguoti
                                    </Button>
                                    <Button variant="outlined"
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteUser(user.id);
                                            }}
                                    >
                                        Ištrinti
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UserListPage;
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import userValidationSchema from "../validation/userValidationSchema";

const ProfilePage = () => {
    const { user } = useAuth(); // Assuming useAuth provides logged-in user info
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(userValidationSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            phoneNumber: '',
            gender: '',
            birthDate: '',
            region: '',  // Add region field
        },
    });

    useEffect(() => {
        if (user) {
            axios.get(`/users/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((res) => reset(res.data))
                .catch((err) => console.error("Error fetching profile data:", err));
        }
    }, [user, reset]);

    const toggleEditMode = () => {
        setIsEditMode((prev) => !prev);
    };

    const handleSave = async (data) => {
        try {
            await axios.put(`/users/${user.id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setIsEditMode(false);
        } catch (error) {
            console.error("Error updating profile", error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5">Profile</Typography>
            <form onSubmit={handleSubmit(handleSave)}>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Vardas"
                            fullWidth
                            margin="normal"
                            disabled={!isEditMode}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    )}
                />
                <Controller
                    name="surname"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Pavardė"
                            fullWidth
                            margin="normal"
                            disabled={!isEditMode}
                            error={!!errors.surname}
                            helperText={errors.surname?.message}
                        />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="El. paštas"
                            fullWidth
                            margin="normal"
                            disabled={!isEditMode}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    )}
                />
                <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Telefono numeris"
                            fullWidth
                            margin="normal"
                            disabled={!isEditMode}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message}
                        />
                    )}
                />
                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Lytis"
                            fullWidth
                            margin="normal"
                            disabled={!isEditMode}
                            error={!!errors.gender}
                            helperText={errors.gender?.message}
                        >
                            <MenuItem value="MALE">Vyras</MenuItem>
                            <MenuItem value="FEMALE">Moteris</MenuItem>
                            <MenuItem value="OTHER">Kita</MenuItem>
                        </TextField>
                    )}
                />
                <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Gimimo data"
                            fullWidth
                            margin="normal"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={!isEditMode}
                            error={!!errors.birthDate}
                            helperText={errors.birthDate?.message}
                        />
                    )}
                />
                <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Regionas"
                            fullWidth
                            margin="normal"
                            disabled={!isEditMode}
                            error={!!errors.region}
                            helperText={errors.region?.message}
                        >
                            <MenuItem value="UK">Jungtinė Karalystė</MenuItem>
                            <MenuItem value="US">Jungtinės Amerikos Valstijos</MenuItem>
                            <MenuItem value="EU">Europos Sąjunga</MenuItem>
                        </TextField>
                    )}
                />

                {/* Buttons for toggling edit mode */}
                {isEditMode ? (
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button variant="outlined" onClick={toggleEditMode}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">Save</Button>
                    </Box>
                ) : (
                    <Button sx={{ mt: 2 }} variant="outlined" onClick={toggleEditMode}>
                        Edit Profile
                    </Button>
                )}
            </form>
        </Box>
    );
};

export default ProfilePage;

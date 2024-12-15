import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    TextField,
    MenuItem,
    Container,
    Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import userValidationSchema from "../validation/userValidationSchema";
import ListHeading from "../components/ListHeading";
import AddButton from "../components/Buttons/AddButton";
import DeclineButton from "../components/Buttons/DeclineButton";
import AcceptButton from "../components/Buttons/AcceptButton";
import Button from "@mui/material/Button";

const ProfilePage = () => {
    const { user } = useAuth();
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
            selectedRegion: '',
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

    const toggleEditMode = () => setIsEditMode((prev) => !prev);

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
        <Container maxWidth="sm" sx={{ mt: 4 }}>
                <ListHeading gutterBottom>
                    Profilio informacija
                </ListHeading>

                <Divider sx={{ mb: 3 }} />
                <form onSubmit={handleSubmit(handleSave)}>
                    {[
                        { name: "name", label: "Vardas" },
                        { name: "surname", label: "Pavardė" },
                        { name: "email", label: "El. paštas", type: "email" },
                        { name: "phoneNumber", label: "Telefono numeris", type: "tel" },
                    ].map(({ name, label, type = "text" }) => (
                        <Controller
                            key={name}
                            name={name}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={label}
                                    type={type}
                                    fullWidth
                                    margin="normal"
                                    disabled={!isEditMode}
                                    error={!!errors[name]}
                                    helperText={errors[name]?.message}
                                />
                            )}
                        />
                    ))}
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
                                InputLabelProps={{ shrink: true }}
                                disabled={!isEditMode}
                                error={!!errors.birthDate}
                                helperText={errors.birthDate?.message}
                            />
                        )}
                    />
                    <Controller
                        name="selectedRegion"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Regionas"
                                fullWidth
                                margin="normal"
                                disabled={!isEditMode}
                                error={!!errors.selectedRegion}
                                helperText={errors.selectedRegion?.message}
                            >
                                <MenuItem value="UK">Jungtinė Karalystė</MenuItem>
                                <MenuItem value="US">Jungtinės Amerikos Valstijos</MenuItem>
                                <MenuItem value="EU">Europos Sąjunga</MenuItem>
                            </TextField>
                        )}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                        {isEditMode ? (
                            <>
                                <DeclineButton onClick={toggleEditMode}></DeclineButton>
                                <Button type="submit">Išsaugoti</Button>
                            </>
                        ) : (
                            <AddButton onClick={toggleEditMode}>
                                Redaguoti profilį
                            </AddButton>
                        )}
                    </Box>
                </form>
        </Container>
    );
};

export default ProfilePage;
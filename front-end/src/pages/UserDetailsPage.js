import {useState, useEffect, useCallback} from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Button,
    TextField,
    Typography,
    Box,
    MenuItem,
    Checkbox,
    FormControlLabel,
    FormGroup,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import userValidationSchema from '../validation/userValidationSchema';
import BackButton from "../components/BackButton";

const UserDetailsPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const roles = ["ADMIN", "SYS_ADMIN", "USER"];
    const [user, setUser] = useState(null);
    const [originalUser, setOriginalUser] = useState(null);
    const [isEditMode, setIsEditMode] = useState(location.state?.isEditMode || false);

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(userValidationSchema),
        defaultValues: {
            name: '',
            surname: '',
            email: '',
            phoneNumber: '',
            gender: '',
            birthDate: '',
            selectedRegion: '',
            roles: []
        },
        context: { userId }
    });

    const fetchUserDetails = useCallback(async () => {
        try {
            const response = await axios.get(`/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const fetchedUser = {
                ...response.data,
                roles: response.data.roles.map(role => role.name) || [],
                selectedRegion: response.data.selectedRegion || '',
                gender: response.data.gender || '',
                birthDate: response.data.birthDate || '',
            };
            reset(fetchedUser);
            setUser(fetchedUser);
            setOriginalUser(fetchedUser);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }, [userId, reset]);

    useEffect(() => {
        if (userId !== 'new') {
            fetchUserDetails();
        } else {
            const newUser = {
                name: '',
                surname: '',
                password: '',
                email: '',
                phoneNumber: '',
                gender: '',
                birthDate: '',
                selectedRegion: '',
                roles: [],
            };
            reset(newUser);
            setUser(newUser);
            setOriginalUser(newUser);
        }
    }, [userId, reset, fetchUserDetails]);

    const toggleEditMode = () => {
        setIsEditMode((prev) => !prev);
        if (isEditMode) {
            reset(originalUser);
        }
    };

    const handleSave = async (data) => {
        const updatedValues = { ...data,
            roles: data.roles.map(role => role.name || role),
            birthDate: data.birthDate,
        };
        try {
            if (userId === 'new') {
                const response = await axios.post(`/users/create`, updatedValues, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setOriginalUser(response.data);
                setIsEditMode(false);
            } else {
                const response = await axios.put(`/users/${userId}`, updatedValues, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setIsEditMode(false);
                setUser(response.data);
            }
        } catch (error) {
            console.error("Error saving user details", error);
        }
    };

    function handleCancel() {
        if (userId === 'new') {
            navigate('/users');
        } else {
            toggleEditMode();
        }
    }

    return (
        <Box sx={{ padding: 2 }}>
            <BackButton to="/users" />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                    {userId === 'new' ? "Sukurti vartotoją" : isEditMode ? "Redaguoti vartotoją" : "Vartotojo informacija"}
                </Typography>
                {!isEditMode && (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={toggleEditMode}
                        sx={{ marginLeft: 'auto' }}
                    >
                        Redaguoti
                    </Button>
                )}
            </Box>
            {user && (
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
                    {userId === 'new' && (
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Slaptažodis"
                                    type={"password"}
                                    fullWidth
                                    margin="normal"
                                    disabled={!isEditMode}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                />
                            )}
                        />
                    )}
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
                                variant="outlined"
                                disabled={!isEditMode}
                                fullWidth
                                margin="normal"
                                helperText={errors.gender?.message}
                                error={!!errors.gender}
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
                                type="date"
                                fullWidth
                                margin="normal"
                                disabled={!isEditMode}
                                error={!!errors.birthDate}
                                helperText={errors.birthDate?.message}
                                // TODO fix this deprecated shit
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="selectedRegion"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Regionas"
                                select
                                variant="outlined"
                                disabled={!isEditMode}
                                fullWidth
                                margin="normal"
                                helperText={errors.selectedRegion?.message}
                                error={!!errors.selectedRegion}
                            >
                                <MenuItem value="UK">Jungtinė Karalystė</MenuItem>
                                <MenuItem value="US">Jungtinės Amerikos Valstijos</MenuItem>
                                <MenuItem value="EU">Europos Sąjunga</MenuItem>
                            </TextField>
                        )}
                    />

                    <FormGroup>
                        {roles.map((role) => (
                            <FormControlLabel
                                key={role}
                                control={
                                    <Controller
                                        name="roles"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                value={role}
                                                checked={field.value.includes(role)}
                                                disabled={!isEditMode}
                                                onChange={(e) => {
                                                    const updatedRoles = e.target.checked
                                                        ? [...field.value, role]
                                                        : field.value.filter((r) => r !== role);
                                                    field.onChange(updatedRoles);
                                                }}
                                            />
                                        )}
                                    />
                                }
                                label={role === "USER" ? "Klientas" : role === "SYS_ADMIN" ? "Sistemos administratorius" : "Administratorius"}
                                sx={{
                                    color: !isEditMode ? 'text.disabled' : 'inherit',
                                    '& .MuiTypography-root': {
                                        color: !isEditMode ? 'text.disabled' : 'inherit',
                                    }
                                }}
                            />
                        ))}
                    </FormGroup>

                    {errors.roles && (
                        <Typography color="error" variant="body2">
                            {errors.roles.message}
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2, gap: 1 }}>
                        {isEditMode && (
                            <>
                                <Button variant="outlined" onClick={handleCancel}>Atšaukti</Button>
                                <Button type="submit" variant="contained" color="primary">Išsaugoti</Button>
                            </>
                        )}
                    </Box>
                </form>
            )}
        </Box>
    );
};

export default UserDetailsPage;
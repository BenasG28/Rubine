import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import userValidationSchema from '../../validation/userValidationSchema';
import DeclineButton from "../Buttons/DeclineButton";
import AcceptButton from "../Buttons/AcceptButton";

const roles = ["ADMIN", "SYS_ADMIN", "USER"];

const UserDetailsDialog = ({ open, onClose, userId, onSave }) => {
    const [user, setUser] = useState(null);
    const [originalUser, setOriginalUser] = useState(null);
    const [isEditMode] = useState(userId !== 'new');

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
    });

    const fetchUserDetails = useCallback(async () => {
        if (userId !== null) {
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
                console.error('Error fetching user details:', error);
            }
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

    const handleSave = async (data) => {
        const updatedValues = {
            ...data,
                roles: data.roles.map(role => (typeof role === 'string' ? role : role.name)),
        };
        try {
            if (userId === 'new') {
                const response = await axios.post(`/users/create`, updatedValues, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                console.log('New user created:', response.data);
                onSave(response.data);
            } else {
                const response = await axios.put(`/users/${userId}`, updatedValues, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                onSave(response.data);
            }
            onClose(); // Close the dialog after saving
        } catch (error) {
            console.error('Error saving user details', error);
        }
    };

    const handleCancel = () => {
        if (userId === 'new') {
            onClose();
        } else {
            reset(originalUser);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{userId === 'new' ? "Sukurti vartotoją" : isEditMode ? "Redaguoti vartotoją" : "Vartotojo informacija"}</DialogTitle>
            <DialogContent>
                {user && (
                    <form onSubmit={handleSubmit(handleSave)}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Vardas" fullWidth margin="normal" disabled={!isEditMode} error={!!errors.name} helperText={errors.name?.message} />
                            )}
                        />
                        <Controller
                            name="surname"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Pavardė" fullWidth margin="normal" disabled={!isEditMode} error={!!errors.surname} helperText={errors.surname?.message} />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="El. paštas" fullWidth margin="normal" disabled={!isEditMode} error={!!errors.email} helperText={errors.email?.message} />
                            )}
                        />
                        {userId === 'new' && (
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Slaptažodis" type="password" fullWidth margin="normal" disabled={!isEditMode} error={!!errors.password} helperText={errors.password?.message} />
                                )}
                            />
                        )}
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Telefono numeris" fullWidth margin="normal" disabled={!isEditMode} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} />
                            )}
                        />
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} select label="Lytis" variant="outlined" disabled={!isEditMode} fullWidth margin="normal" helperText={errors.gender?.message} error={!!errors.gender}>
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
                                <TextField {...field} label="Gimimo data" type="date" fullWidth margin="normal" disabled={!isEditMode} error={!!errors.birthDate} helperText={errors.birthDate?.message} />
                            )}
                        />
                        <Controller
                            name="selectedRegion"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Regionas" select fullWidth margin="normal" disabled={!isEditMode} error={!!errors.selectedRegion} helperText={errors.selectedRegion?.message}>
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
                                                <Checkbox {...field} value={role} checked={field.value.includes(role)} disabled={!isEditMode} onChange={(e) => {
                                                    const updatedRoles = e.target.checked ? [...field.value, role] : field.value.filter((r) => r !== role);
                                                    field.onChange(updatedRoles);
                                                }} />
                                            )}
                                        />
                                    }
                                    label={role === "USER" ? "Klientas" : role === "SYS_ADMIN" ? "Sistemos administratorius" : "Administratorius"}
                                />
                            ))}
                        </FormGroup>
                        {errors.roles && <Typography color="error" variant="body2">{errors.roles.message}</Typography>}
                    </form>
                )}
            </DialogContent>
            <DialogActions>
                <DeclineButton onClick={handleCancel}>Atšaukti</DeclineButton>
                <AcceptButton onClick={handleSubmit(handleSave)}>Išsaugoti</AcceptButton>
            </DialogActions>
        </Dialog>
    );
};

export default UserDetailsDialog;
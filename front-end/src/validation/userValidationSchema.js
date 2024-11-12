import * as yup from "yup";

const userValidationSchema = yup.object({
    name: yup
        .string()
        .required("Vardas yra privalomas")
        .min(2, "Vardas turi būti bent 2 simboliai")
        .max(100, "Vardas negali būti ilgesnis nei 100 simbolių"),

    surname: yup
        .string()
        .required("Pavardė yra privaloma")
        .min(2, "Pavardė turi būti bent 2 simboliai")
        .max(100, "Pavardė negali būti ilgesnė nei 100 simbolių"),

    email: yup
        .string()
        .required("El. paštas yra privalomas")
        .email("El. pašto adresas yra neteisingas"),

    userId: yup
        .string(),

    password: yup
        .string()
        .when("$userId", {
            is: (userId) => userId === "new",
            then: () =>
                yup
                    .string()
                    .required("Slaptažodis yra privalomas")
                    .min(8, "Slaptažodis turi būti bent 8 simboliai")
                    .max(20, "Slaptažodis negali būti ilgesnis nei 20 simbolių"),
            otherwise: () => yup.string().notRequired(),
        }),

    phoneNumber: yup
        .string()
        .required("Telefono numeris yra privalomas")
        .matches(
            /^\+?(\d{1,3})?(\d{9,15})$/,
            "Telefono numeris yra neteisingas"
        ),

    gender: yup
        .string()
        .required("Lytis yra privaloma"),

    birthDate: yup
        .date()
        .transform((value, originalValue) => {
            return originalValue === "" ? null : value;
        })
        .nullable()
        .required("Gimimo data yra privaloma")
        .max(new Date(), "Gimimo data negali būti ateityje"),

    selectedRegion: yup
        .string()
        .required("Regionas yra privalomas"),

    roles: yup
        .array()
        .min(1, "Bent viena rolė turi būti priskirta")
        .required("Rolės yra privalomos")
});

export default userValidationSchema;
import * as yup from "yup";

const paymentValidationSchema = yup.object({
    paymentMethod: yup
        .string()
        .oneOf(["CASH", "CARD"], "Invalid payment method")
        .required("Pasirinkite apmokėjimo metodą"),

    cardNumber: yup
        .string()
        .when("paymentMethod", {
            is: (paymentMethod) => paymentMethod === "CARD",
            then: () => yup
                .string()
                .required("Kortelės numeris yra privalomas")
                .matches(
                    /^\d{16}$/,
                    "Kortelės numeris turi būti 16 skaitmenų"
                ),
            otherwise: () => yup.string().notRequired(),
        })
});

export default paymentValidationSchema;
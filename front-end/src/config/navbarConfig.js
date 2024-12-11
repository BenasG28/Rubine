const navbarConfig = [
    { path: "/users", label: "Vartotojai", roles: ["SYS_ADMIN", "ADMIN"] },
    { path: "/products", label: "Prekės", roles: ["SYS_ADMIN", "ADMIN"] },
    { path: "/orders", label: "Užsakymai", roles: null },
    { path: "/profile", label: "Profilis", roles: null},
    { path: "/cart", label: null, roles: null },
];

export default navbarConfig;
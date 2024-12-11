import MainPage from "../pages/MainPage";
import UserListPage from "../pages/UserListPage";
import ProductListPage from "../pages/ProductListPage";
import OrderListPage from "../pages/OrderListPage";
import CartPage from "../pages/CartPage";
import ProfilePage from "../pages/ProfilePage";
import ProductDetailsPage from "../pages/ProductDetailsPage";

const routeConfig = [
    { path: "/main", component: MainPage, roles: null },
    { path: "/users", component: UserListPage, roles: ["SYS_ADMIN", "ADMIN"] },
    { path: "/products", component: ProductListPage, roles: ["SYS_ADMIN", "ADMIN"] },
    { path: "/products/:productId", component: ProductDetailsPage, roles: null },
    { path: "/orders", component: OrderListPage, roles: null },
    { path: "/cart", component: CartPage, roles: null },
    { path: "/profile", component: ProfilePage, roles: null },
];
export default routeConfig;
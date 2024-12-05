import MainPage from "../pages/MainPage";
import UserListPage from "../pages/UserListPage";
import UserDetailsPage from "../pages/UserDetailsPage";
import ProductListPage from "../pages/ProductListPage";
import OrderListPage from "../pages/OrderListPage";
import ReportListPage from "../pages/ReportListPage";
import CartPage from "../pages/CartPage";
import ProfilePage from "../pages/ProfilePage";
import ProductDetailsPage from "../pages/ProductDetailsPage";

const routeConfig = [
    { path: "/main", component: MainPage, roles: null },
    { path: "/users", component: UserListPage, roles: ["SYS_ADMIN", "ADMIN"] },
    { path: "/user-details/:userId", component: UserDetailsPage, roles: ["SYS_ADMIN", "ADMIN"] },
    { path: "/products", component: ProductListPage, roles: ["SYS_ADMIN", "ADMIN"] },
    { path: "/products/:productId", component: ProductDetailsPage, roles: null },
    { path: "/orders", component: OrderListPage, roles: null },
    { path: "/reports", component: ReportListPage, roles: ["SYS_ADMIN", "ADMIN"] },
    { path: "/cart", component: CartPage, roles: null },
    { path: "/profile", component: ProfilePage, roles: null },
];
export default routeConfig;
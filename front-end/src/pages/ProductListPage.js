import {useAuth} from "../context/AuthContext";
import {Navigate} from "react-router-dom";


const ProductListPage = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace />
    }
}
export default ProductListPage;
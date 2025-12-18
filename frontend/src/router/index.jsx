import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Layout from "../components/Layout";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Wishlist from "../pages/Wishlist";
import NotFound from "../pages/NotFound";
import PaymentPage from "../pages/PaymentPage";
import Address from "../pages/Address";
import MyOrder from "../pages/MyOrder";
import OrderDetail from "../pages/OrderDetail";
import ReturnProduct from "../pages/ReturnProduct";
import AdminPanel from "../pages/AdminPanel";
import AdminRoute from "../components/ProtectedRoute/AdminRoute";
import UserRoute from "../components/ProtectedRoute/UserRoute";
import AdminDashboard from "../components/AdminComponents/AdminDashboard";
import Users from "../components/AdminComponents/Users";
import AdminProducts from "../components/AdminComponents/AdminProducts";
import AdminOrders from "../components/AdminComponents/AdminOrders";
import Categories from "../components/AdminComponents/Categories";
import PaymentHistory from "../components/AdminComponents/PaymentHistory";
import CouponList from "../components/AdminComponents/CouponList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },
      {
        path: "wishlist",
        element: (
          <UserRoute>
            <Wishlist />
          </UserRoute>
        ),
      },
      {
        path: "my-order",
        element: (
          <UserRoute>
            <MyOrder />
          </UserRoute>
        ),
      },
      {
        path: "orders/:id",
        element: (
          <UserRoute>
            <OrderDetail />
          </UserRoute>
        ),
      },
      {
        path: "return-product",
        element: (
          <UserRoute>
            <ReturnProduct />
          </UserRoute>
        ),
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/address",
    element: (
      <UserRoute>
        <Address />
      </UserRoute>
    ),
  },
  {
    path: "/payment",
    element: (
      <UserRoute>
        <PaymentPage />
      </UserRoute>
    ),
  },
  {
    path: "/admin/",
    element: (
      <AdminRoute>
        <AdminPanel />
      </AdminRoute>
    ),
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <Users /> },
      { path: "products", element: <AdminProducts /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "categories", element: <Categories /> },
      { path: "payments", element: <PaymentHistory /> },
      { path: "coupon", element: <CouponList /> },
    ],
  },
]);

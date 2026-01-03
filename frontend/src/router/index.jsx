import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
const Home = lazy(() => import("../pages/Home"));
const Signup = lazy(() => import("../pages/Signup"));
const Login = lazy(() => import("../pages/Login"));
const Layout = lazy(() => import("../components/Layout"));
const Products = lazy(() => import("../pages/Products"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const PaymentPage = lazy(() => import("../pages/PaymentPage"));
const Address = lazy(() => import("../pages/Address"));
const MyOrder = lazy(() => import("../pages/MyOrder"));
const OrderDetail = lazy(() => import("../pages/OrderDetail"));
const ReturnProduct = lazy(() => import("../pages/ReturnProduct"));
const AdminPanel = lazy(() => import("../pages/AdminPanel"));
const AdminRoute = lazy(() =>
  import("../components/ProtectedRoute/AdminRoute")
);
const UserRoute = lazy(() => import("../components/ProtectedRoute/UserRoute"));
const AdminDashboard = lazy(() =>
  import("../components/AdminComponents/AdminDashboard")
);
const Users = lazy(() => import("../components/AdminComponents/Users"));
const AdminProducts = lazy(() =>
  import("../components/AdminComponents/AdminProducts")
);
const AdminOrders = lazy(() =>
  import("../components/AdminComponents/AdminOrders")
);
const PaymentHistory = lazy(() =>
  import("../components/AdminComponents/PaymentHistory")
);
const CouponList = lazy(() =>
  import("../components/AdminComponents/CouponList")
);
const AddProductForm = lazy(() =>
  import("../components/AdminComponents/AddProductForm")
);
const ProductReview = lazy(() =>
  import("../components/AdminComponents/ProductReview")
);
const Inquiry = lazy(() => import("../components/AdminComponents/Inquiry"));
const Clients = lazy(() => import("../components/AdminComponents/Clients"));
const Banner = lazy(() => import("../components/AdminComponents/Banner"));
const CategoryManager = lazy(() =>
  import("../components/AdminComponents/CategoryManager")
);

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
      { path: "categories", element: <CategoryManager /> },
      { path: "payments", element: <PaymentHistory /> },
      { path: "coupon", element: <CouponList /> },
      { path: "productform", element: <AddProductForm /> },
      { path: "product-review", element: <ProductReview /> },
      { path: "inquiry", element: <Inquiry /> },
      { path: "clients", element: <Clients /> },
      { path: "banner", element: <Banner /> },
    ],
  },
]);

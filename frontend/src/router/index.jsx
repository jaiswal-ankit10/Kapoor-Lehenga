import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Layout from "../components/Layout";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Wishlist from "../pages/Wishlist";
import NotFound from "../pages/NotFound";

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
      { path: "wishlist", element: <Wishlist /> },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

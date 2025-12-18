export const breadcrumbRoutes = {
  home: { name: "Home", route: "/" },
  productPage: { name: "Product Page", route: "/products" },
  productDetails: (id) => ({
    name: "Product Details",
    route: `/products/${id}`,
  }),
  wishlist: { name: "WishList", route: "/wishlist" },
  myOrder: { name: "My Order", route: "/my-order" },
  orderDetail: { name: "Order Details", route: "/order-detal" },
  returnProduct: { name: "Return Product", route: "/return-product" },
};

export const breadcrumbAdmin = {
  home: { label: "Home", to: "/" },
  user: { label: "Users", to: "/admin/users" },
  dashboard: { label: "", to: "/admin/dashboard" },
  product: { label: "Product List", to: "/admin/products" },
  orders: { label: "Order List", to: "/admin/orders" },
  categories: { label: "Categories List", to: "/admin/categories" },
  payment: { label: "Payment History List", to: "/admin/payments" },
  coupon: { label: "Coupon List", to: "/admin/coupon" },
};

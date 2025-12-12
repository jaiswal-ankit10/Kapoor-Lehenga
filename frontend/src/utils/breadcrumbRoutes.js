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

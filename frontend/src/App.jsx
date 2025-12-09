import React from "react";
import "swiper/css";
import "swiper/css/navigation";

import { RouterProvider } from "react-router-dom";
import { router } from "./router";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

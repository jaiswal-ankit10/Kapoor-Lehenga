import { Suspense } from "react";

import "swiper/css";
import "swiper/css/navigation";

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { GoogleOAuthProvider } from "@react-oauth/google";

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">Loading...</div>
);

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </GoogleOAuthProvider>
  );
};

export default App;

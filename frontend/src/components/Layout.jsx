import React from "react";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import SidebarRouteWrapper from "./SidebarRouterWrapper";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const Layout = () => {
  const { pathname } = useLocation();

  const isLoginRoute = pathname === "/login";
  const isSignupRoute = pathname === "/signup";

  return (
    <>
      <Header />

      {/* Only hide Outlet when popup route */}
      {!isLoginRoute && !isSignupRoute && <Outlet />}

      {isLoginRoute && (
        <SidebarRouteWrapper>
          <Login />
        </SidebarRouteWrapper>
      )}

      {isSignupRoute && (
        <SidebarRouteWrapper>
          <Signup />
        </SidebarRouteWrapper>
      )}

      <Footer />
    </>
  );
};

export default Layout;

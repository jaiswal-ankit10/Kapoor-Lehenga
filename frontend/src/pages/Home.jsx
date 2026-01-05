import React, { useEffect, useState, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const CategorySlider = lazy(() => import("../components/CategorySlider"));
const BannerSlider = lazy(() => import("../components/BannerSlider"));
const NewArrival = lazy(() => import("../components/NewArrival"));
const TestimonialsSection = lazy(() =>
  import("../components/TestimonialSections")
);
const ServicesSection = lazy(() => import("../components/ServicesSection"));

import luxeImg from "../assets/images/luxe.png";
import newlyLaunchedBanner from "../assets/images/newly-launched.png";
import sareeBanner from "../assets/images/saree-banner.png";
import Subscribe from "../assets/images/subscribe.png";
import leftBanner from "../assets/images/festival-special/img1.png";
import rightTop from "../assets/images/festival-special/img2.png";
import bottomBanner1 from "../assets/images/festival-special/img3.png";
import bottomBanner2 from "../assets/images/festival-special/img4.png";
import mapImage from "../assets/images/cropped_map.png";
import Login from "./Login";
import Signup from "./Signup";
import axiosInstance from "../api/axiosInstance";

const Home = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [bannerImg, setBannerImg] = useState([]);

  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axiosInstance.get("/banners/active");

        if (res.data.success && res.data.data.length > 0) {
          setBannerImg(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBanner();
  }, []);
  return (
    <div>
      {/* Banner section */}

      <Suspense fallback={<div>Loading Banner...</div>}>
        <BannerSlider banners={bannerImg} />
      </Suspense>
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategorySlider />
      </Suspense>
      {/* Luxe Section */}
      <section className="bg-[#310914] w-full min-h-[40%] md:min-h-screen flex  md:flex-row md:justify-between px-4 md:px-8 lg:px-16 ">
        <img
          src={luxeImg}
          alt="luxe img"
          className="w-full"
          onClick={() => navigate("/products")}
        />
      </section>

      {/* newly launched banner */}
      <section className="max-w-[95vw] mx-auto my-10">
        <img
          src={newlyLaunchedBanner}
          alt="newlyLaunchedBanner"
          className="w-full object-cover"
        />
      </section>

      {/* newly arrival section */}
      <section className="container mx-auto text-center mb-10">
        <div className="text-2xl">New Arrival</div>
        <p className="mb-5">
          "Embrace the festival magic, let joy fill every moment."
        </p>
        <Suspense fallback={<div>Loading new arrival...</div>}>
          <NewArrival />
        </Suspense>
      </section>

      {/* Subscription */}
      <section className="h-auto w-full ">
        <img src={Subscribe} alt="subscription" className="w-full" />
      </section>

      {/* Festival Special Section */}
      <section className="container mx-auto px-4 py-12 flex flex-col gap-10 items-center">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Festival Special</h1>
          <p className="italic">
            "Embrace the festival magic, let joy fill every moment."
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT BIG IMAGE */}
          <div className="flex-1 md:col-span-1 h-auto md:h-[800px]">
            <img
              src={leftBanner}
              alt="Luxury Fabrics"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 col-span-1 md:col-span-2 grid grid-rows-2 gap-4">
            {/* TOP FULL WIDTH */}
            <div className="row-span-1 h-auto">
              <img
                src={rightTop}
                alt="Top Stylist Guide"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* BOTTOM TWO IMAGES */}
            <div className="row-span-1 grid grid-cols-2 gap-4">
              <div className="h-auto">
                <img
                  src={bottomBanner1}
                  alt="Stunning Look"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="h-auto">
                <img
                  src={bottomBanner2}
                  alt="Spring Collection"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* sarees  */}
      <section className="max-w-[95vw] mx-auto my-10 relative">
        <img
          src={sareeBanner}
          alt="sareeBanner"
          className="h-[200px]  w-full object-cover"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-3xl font-semibold">SAREES</h1>
          <p className="text-lg">UP TO 50% OFF</p>
        </div>
      </section>

      {/* Customer Service */}
      <Suspense fallback={<div>Loading Testimonial...</div>}>
        <TestimonialsSection />
      </Suspense>

      {/* services section */}
      <Suspense fallback={<div>Loading services...</div>}>
        <ServicesSection />
      </Suspense>

      {/* map section */}
      <section className="w-full h-[50vh] md:h-full bg-[#E3FCFF] flex items-center justify-center">
        <img src={mapImage} alt="map" className="bg-[#E3FCFF]" />
      </section>
      {isLogin && (
        <SidebarRouteWrapper>
          <Login />
        </SidebarRouteWrapper>
      )}

      {isSignup && (
        <SidebarRouteWrapper>
          <Signup />
        </SidebarRouteWrapper>
      )}
    </div>
  );
};

export default Home;

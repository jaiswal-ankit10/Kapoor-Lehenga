import React from "react";
import bannerImage from "../assets/images/banner.png";
import CategorySlider from "../components/CategorySlider";
import luxe1 from "../assets/images/luxe/img1.png";
import luxe2 from "../assets/images/luxe/img2.png";
import luxe3 from "../assets/images/luxe/img3.png";
import luxe4 from "../assets/images/luxe/img4.png";
import cardImage1 from "../assets/images/brown-card/img1.png";
import cardImage2 from "../assets/images/brown-card/img2.png";
import cardImage3 from "../assets/images/brown-card/img3.png";
import cardImage4 from "../assets/images/brown-card/img4.png";
import newlyLaunchedBanner from "../assets/images/newly-launched.png";
import sareeBanner from "../assets/images/saree-banner.png";
import NewArrival from "../components/NewArrival";
import bannerImg from "../assets/images/banner2.jpg";
import brandLogo from "../assets/images/brandLogo.jpg";
import leftBanner from "../assets/images/festival-special/img1.png";
import rightTop from "../assets/images/festival-special/img2.png";
import bottomBanner1 from "../assets/images/festival-special/img3.png";
import bottomBanner2 from "../assets/images/festival-special/img4.png";
import TestimonialsSection from "../components/TestimonialSections";
import ServicesSection from "../components/ServicesSection";
import mapImage from "../assets/images/cropped_map.png";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

const Home = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";
  return (
    <div>
      {/* Banner section */}
      <section>
        <img src={bannerImage} alt="" />
      </section>
      <CategorySlider />
      {/* Luxe Section */}
      <section className="bg-[#310914] w-full h-[90vh] flex justify-around ">
        {/* explore */}
        <div className="grid grid-cols-2 h-full gap-0">
          <img src={luxe1} alt="luxe1" className="w-full h-full object-cover" />
          <img src={luxe2} alt="luxe2" className="w-full h-full object-cover" />
          <img src={luxe3} alt="luxe3" className="w-full h-full object-cover" />
          <img src={luxe4} alt="luxe4" className="w-full h-full object-cover" />
        </div>

        {/* cards */}
        <div className="grid grid-cols-2 gap-8 py-20">
          <div className="w-[230px] text-white">
            <div className="relative w-full">
              <img
                src={cardImage1}
                alt="cardImage1"
                className="w-full h-full object-cover"
              />

              {/* Bottom blur gradient */}
              <div className="absolute bottom-0 left-0 w-full h-30 bg-linear-to-t from-[#2b0112] to-transparent pointer-events-none"></div>
            </div>

            <h2>Line Lehenga</h2>
          </div>
          <div className="w-[230px] text-white">
            <div className="relative w-full">
              <img
                src={cardImage2}
                alt="cardImage2"
                className="w-full h-full object-cover"
              />

              {/* Bottom blur gradient */}
              <div className="absolute bottom-0 left-0 w-full h-30 bg-linear-to-t from-[#2b0112] to-transparent pointer-events-none"></div>
            </div>
            <h2>Embroidered N </h2>
          </div>
          <div className="w-[230px] text-white">
            <div className="relative w-full">
              <img
                src={cardImage3}
                alt="cardImage3"
                className="w-full h-full object-cover"
              />

              {/* Bottom blur gradient */}
              <div className="absolute bottom-0 left-0 w-full h-30 bg-linear-to-t from-[#2b0112] to-transparent pointer-events-none"></div>
            </div>
            <h2>Maroon Net</h2>
          </div>
          <div className="w-[230px] text-white">
            <div className="relative w-full">
              <img
                src={cardImage4}
                alt="cardImage4"
                className="w-full h-full object-cover"
              />

              {/* Bottom blur gradient */}
              <div className="absolute bottom-0 left-0 w-full h-30 bg-linear-to-t from-[#2b0112] to-transparent pointer-events-none"></div>
            </div>
            <h2>Maroon Art Silk</h2>
          </div>
        </div>
      </section>

      {/* newly launched banner */}
      <section className="max-w-[85vw] mx-auto my-10">
        <img src={newlyLaunchedBanner} alt="newlyLaunchedBanner" />
      </section>

      {/* newly arrival section */}
      <section className="text-center mb-10">
        <div className="text-2xl">New Arrival</div>
        <p className="mb-5">
          "Embrace the festival magic, let joy fill every moment."
        </p>
        <NewArrival />
      </section>

      {/* Subscription */}
      <section
        className="h-[60vh] w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        {/* Blur Card */}
        <div className="bg-white/60 backdrop-blur-sm   px-10 py-8 rounded-xl border border-white shadow-lg max-w-2xl text-center relative">
          {/* Border Outline (double border effect) */}
          <div className="absolute inset-0 rounded-xl border border-white/60 pointer-events-none"></div>

          {/* Logo */}
          <img src={brandLogo} alt="logo" className="w-40 mx-auto mb-4" />

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-semibold italic text-gray-800">
            “Subscribe to our newsletter and get <br />
            <span className="font-bold">10% off your first purchase</span>”
          </h2>
        </div>
      </section>

      {/* Festival Special Section */}
      <section className="max-w-[85vw] mx-auto px-4 py-12 flex flex-col gap-10 items-center">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Festival Special</h1>
          <p className="italic">
            "Embrace the festival magic, let joy fill every moment."
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT BIG IMAGE */}
          <div className="col-span-1 h-[800px]">
            <img
              src={leftBanner}
              alt="Luxury Fabrics"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="col-span-1 md:col-span-2 grid grid-rows-2 gap-4">
            {/* TOP FULL WIDTH */}
            <div className="row-span-1 h-[385px]">
              <img
                src={rightTop}
                alt="Top Stylist Guide"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* BOTTOM TWO IMAGES */}
            <div className="row-span-1 grid grid-cols-2 gap-4">
              <div className="h-[385px]">
                <img
                  src={bottomBanner1}
                  alt="Stunning Look"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="h-[385px]">
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
      <section className="max-w-[85vw] mx-auto my-10 relative">
        <img
          src={sareeBanner}
          alt="sareeBanner"
          className="h-[200px] w-full object-cover"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-3xl font-semibold">SAREES</h1>
          <p className="text-lg">UP TO 50% OFF</p>
        </div>
      </section>

      {/* Customer Service */}
      <TestimonialsSection />

      {/* services section */}
      <ServicesSection />

      {/* map section */}
      <section className="w-full bg-[#E3FCFF] flex items-center justify-center">
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

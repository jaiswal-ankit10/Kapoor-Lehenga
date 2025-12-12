import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import logo from "../assets/images/logo-black.png";
import saree1 from "../assets/images/sarees/saree1.png";
import saree2 from "../assets/images/sarees/saree2.png";
import saree3 from "../assets/images/sarees/saree3.png";
import saree4 from "../assets/images/sarees/saree4.png";
import saree5 from "../assets/images/sarees/saree5.png";
import { useNavigate } from "react-router-dom";

const categories = [
  { title: "Crush(Pleated) Work", img: saree1 },
  { title: "Lehenga Saree", img: saree2 },
  { title: "Designer Saree", img: saree3 },
  { title: "Printed Embroidered", img: saree4 },
  { title: "Floral Saree", img: saree5 },
  { title: "Floral Saree", img: saree5 },
  { title: "Floral Saree", img: saree5 },
  { title: "Floral Saree", img: saree5 },
  { title: "Floral Saree", img: saree5 },
  { title: "Floral Saree", img: saree5 },
  { title: "Floral Saree", img: saree5 },
];

const CategorySlider = () => {
  const navigate = useNavigate();
  return (
    <div className=" my-6">
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={5}
        spaceBetween={5}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3.5 },
          1024: { slidesPerView: 4.5 },
          1280: { slidesPerView: 5 },
          1536: { slidesPerView: 8 },
        }}
        className="mySwiper"
      >
        {/* LEFT STATIC SHOP CARD
        <SwiperSlide>
          <div className="w-60 hidden md:flex h-[300px] bg-linear-to-br from-[#fbc67a] via-[#f57bd1] to-[#9253e8] text-white p-3">
            <div className="h-full bg-linear-to-br from-[#fbc67a] via-[#f57bd1] to-[#9253e8] p-5 border border-white flex flex-col items-center justify-between">
              <img src={logo} alt="logo" className="w-[87px] h-[86px] mb-3" />

              <h2 className="text-xl font-semibold text-center tracking-wide">
                Shop by Category
              </h2>

              <p className="text-sm mt-2 text-center opacity-95 leading-5">
                "Browse, explore, and indulge in endless possibilities by
                category."
              </p>
              <button
                className="mt-5 bg-black text-white px-5 py-2 w-full text-sm font-medium cursor-pointer"
                onClick={() => navigate("/products")}
              >
                SHOP HERE →
              </button>
            </div>
          </div>
        </SwiperSlide> */}
        {/* SLIDER IMAGES */}
        {categories.map((item, index) => (
          <SwiperSlide key={index} className="shrink-0">
            <div className="flex flex-col items-center relative">
              <img
                src={item.img}
                alt={item.title}
                className="h-[300px] w-[220px] object-cover "
              />
              <h3
                className="absolute bottom-3  text-center text-white drop-shadow-md"
                style={{
                  fontFamily: "Kaushan Script, cursive",
                  fontSize: "1.2rem",
                }}
              >
                {item.title}
              </h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategorySlider;

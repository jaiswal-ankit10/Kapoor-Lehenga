import React from "react";

import mobileImage from "../assets/images/mobile-banner.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const BannerSlider = ({ banners = [] }) => {
  return (
    <section className="max-w-100vh">
      {/* Desktop Slider */}
      <div className="hidden md:block">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop
          pagination={{ clickable: true }}
          // navigation
          className="banner-swiper"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <img src={banner.imageUrl} alt={banner.title || "banner"} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile Banner (single image or slider if you want later) */}
      <div className="block md:hidden">
        <img src={mobileImage} alt="mobile banner" className="w-full " />
      </div>
    </section>
  );
};

export default BannerSlider;

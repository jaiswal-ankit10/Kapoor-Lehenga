import React from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
const ProductDetailImages = ({ product }) => {
  return (
    <section className="w-full">
      <div className="block lg:hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop
          pagination={{ clickable: true }}
          // navigation
          className="productdetail-swiper"
        >
          {product.images.map((img) => (
            <SwiperSlide key={product.id}>
              <img src={img} alt={product.title || "img"} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductDetailImages;

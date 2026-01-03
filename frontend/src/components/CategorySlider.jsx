import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "swiper/css";
import "swiper/css/navigation";

const CategorySlider = () => {
  const navigate = useNavigate();
  const { products = [] } = useSelector((store) => store.products);

  const sarees = products.filter((item) =>
    item.subCategory?.category?.name?.toLowerCase().includes("saree")
  );

  if (!sarees.length) return null;

  return (
    <div className="my-6 px-2">
      <Swiper
        modules={[Navigation]}
        navigation={sarees.length > 1}
        watchOverflow={true}
        centeredSlides={sarees.length === 1}
        spaceBetween={10}
        className="category-swiper cursor-pointer"
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {sarees.map((item, index) => (
          <SwiperSlide key={item.id || index}>
            <div className="flex flex-col items-center relative">
              <img
                src={item.images?.[0]}
                alt={item.title}
                className="h-[260px] w-full max-w-[220px] object-fit cursor-pointer rounded"
                onClick={() =>
                  navigate(`/products?subcategory=${item.subCategory.name}`)
                }
              />

              <h3
                className="absolute bottom-3 text-white drop-shadow-md text-lg"
                style={{ fontFamily: "Kaushan Script, cursive" }}
              >
                {item.subCategory.name}
              </h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategorySlider;

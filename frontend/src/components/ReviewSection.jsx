import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { reviewsData } from "../utils/reviewsData";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";

const ReviewSection = () => {
  const { average, totalReviews, distribution, topReviews } = reviewsData;
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT — Rating Summary */}
      <div className=" p-6 ">
        <h2 className="text-xl font-semibold mb-4">Customer reviews</h2>

        <div className="flex gap-8 items-center shadow-sm rounded-lg py-2 px-4">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold">{average}</h1>
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.floor(average)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-1">{totalReviews} Reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="flex flex-col gap-1 w-full">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm w-4">{star}</span>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="h-full bg-green-500 rounded"
                    style={{ width: `${distribution[star]}%` }}
                  ></div>
                </div>
                <span className="text-sm">{distribution[star]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Top Reviews */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Top reviews from India</h2>

        {topReviews.map((review, i) => (
          <div key={i} className="mb-6">
            <div className="flex items-center gap-3">
              <img
                src={review.avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{review.user}</h4>
                <div className="flex items-center text-sm text-yellow-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar
                      key={index}
                      className={
                        index < review.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-2">{review.text}</p>

            {review.images.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="review-img"
                    className="w-[90px] h-[110px] object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        <hr className="mb-10 text-gray-300" />
        <p
          className="text-[#03A685] text-xl mb-5 flex items-center gap-6"
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          See more reviews
          {openDropdown ? (
            <MdOutlineKeyboardArrowUp />
          ) : (
            <MdOutlineKeyboardArrowDown />
          )}{" "}
        </p>
      </div>
    </div>
  );
};

export default ReviewSection;

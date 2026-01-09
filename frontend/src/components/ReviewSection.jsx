import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
// import { reviewsData } from "../utils/reviewsData";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchReviews } from "../services/reviewService";

const ReviewSection = ({ productId }) => {
  // const { average, totalReviews, distribution, topReviews } = reviewsData;
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.review);
  const [showAllReview, setShowAllReview] = useState(false);
  const visibleReviews = showAllReview ? reviews : reviews.slice(0, 3);

  const imageBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const resolveImage = (url) =>
    url?.startsWith("http") ? url : `${imageBaseUrl}${url}`;

  // console.log(reviews);
  useEffect(() => {
    const loadReviews = async () => {
      try {
        await dispatch(fetchReviews(productId)).unwrap();
      } catch (error) {
        console.error(error);
      }
    };

    if (productId) {
      loadReviews();
    }
  }, [dispatch, productId]);

  const totalReviews = reviews.length;
  const average =
    totalReviews === 0
      ? 0
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(
          1
        );
  const distribution = [1, 2, 3, 4, 5].reduce((acc, star) => {
    acc[star] =
      totalReviews === 0
        ? 0
        : Math.round(
            (reviews.filter((r) => r.rating === star).length / totalReviews) *
              100
          );
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-20 p-6 border-t border-gray-200">
      {/* LEFT — Rating Summary */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Customer reviews</h2>

        <div className="flex gap-8 items-center shadow-lg rounded-lg py-2 px-4">
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
            <p className="text-gray-500 text-sm mt-1">
              {totalReviews} {totalReviews > 1 ? "reviews" : "review"}
            </p>
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

        {loading && <p>Loading reviews...</p>}

        {!loading && reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet</p>
        )}
        {error && <p>{error}</p>}
        {reviews.map((review) => (
          <div key={review.id} className="mb-6">
            <div className="flex items-center gap-3">
              <img
                src={review.user?.avatar || "/avatar.png"}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{review.user?.fullName}</h4>

                <div className="flex gap-2">
                  <div className="flex text-yellow-500 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < review.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-xs text-gray-500">
                    | {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-3 ml-13 ">
              {review.comment}
            </p>

            {visibleReviews.images?.length > 0 && (
              <div className="flex gap-2 mt-3 ml-13">
                {review.images?.filter(Boolean).map((img, idx) => (
                  <img
                    key={idx}
                    src={resolveImage(img)}
                    className="w-24 h-28 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        <hr className="mb-10 text-gray-300" />
        <p
          className="text-[#03A685] text-xl mb-5 flex items-center gap-6 cursor-pointer"
          onClick={() => setShowAllReview(!showAllReview)}
        >
          {showAllReview ? "See less reviews" : "See more reviews"}
          {showAllReview ? (
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

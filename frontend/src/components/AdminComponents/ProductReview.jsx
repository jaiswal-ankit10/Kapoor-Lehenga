import React, { useEffect } from "react";
import dayjs from "dayjs";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import PageHeader from "./PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import { fetchAdminReviews } from "../../services/reviewService";
import { Star } from "lucide-react";

const StarRating = ({ rating }) => {
  return (
    <div className="flex justify-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );
};

const ProductReview = () => {
  const dispatch = useDispatch();
  const breadcrumbs = [breadcrumbAdmin.home, breadcrumbAdmin.productReview];
  const { reviews, loading, error } = useSelector((state) => state.review);

  useEffect(() => {
    const fetchAllreviews = async () => {
      try {
        await dispatch(fetchAdminReviews()).unwrap();
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllreviews();
  }, [dispatch]);

  const truncateWords = (text = "", maxWords = 5) => {
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  // console.log(reviews);

  return (
    <div>
      <PageHeader title={"Product Review List"} breadcrumbs={breadcrumbs} />
      <div className="bg-white p-4 rounded shadow-xl my-6">
        <div className="flex flex-wrap gap-4 items-center justify-between p-5 ">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600">
            <option>10 rows</option>
            <option>20 rows</option>
            <option>50 rows</option>
          </select>

          <div className="flex items-center gap-3">
            <div className="relative ">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="search"
                placeholder="Search"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-40 md:w-64"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading && <p>Loading reviews...</p>}

          {!loading && reviews.length === 0 && (
            <p className="text-gray-500 text-center">No reviews yet</p>
          )}
          {error && <p>{error}</p>}
          <table className="w-full text-sm table-auto">
            <thead className="bg-gray-50 text-gray-500 border-gray-300">
              <tr>
                <th className="px-10 py-3 text-left whitespace-nowrap min-w-max">
                  PRODUCT NAME
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  USER NAME
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  STAR
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  REVIEW DESCRIPTION
                </th>
                <th className="px-15 py-3 text-center whitespace-nowrap min-w-max">
                  UPDATEDATE
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {reviews?.map((review) => (
                <tr key={review.id} className="border-t border-gray-300">
                  <td className="py-2 px-10 text-left">
                    {review.product?.title}
                  </td>
                  <td className="py-2 px-5 text-center flex items-center gap-2">
                    <img src="/avatar.png" alt="avatar" className="w-6" />
                    {review.user?.fullName}
                  </td>
                  <td className="py-2 px-5 text-center uppercase">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="py-2 px-5 text-center">
                    {truncateWords(review.comment, 5)}
                  </td>
                  <td className="py-2 px-5 text-center">
                    {dayjs(review.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;

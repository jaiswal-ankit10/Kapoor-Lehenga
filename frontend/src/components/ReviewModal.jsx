import React, { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { resetReviewState } from "../redux/reviewSlice";
import { createReview } from "../services/reviewService";
import { toast } from "react-toastify";

export default function ReviewModal({ product, onClose }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  const { loading, error, success } = useSelector((state) => state.review);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files].slice(0, 5));
  };
  //   console.log(product.id);
  const handleSubmit = () => {
    if (!rating || !comment.trim()) {
      alert("Rating and review are required");
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    images.forEach((img) => formData.append("images", img));

    dispatch(createReview({ productId: product.id, formData }));
  };
  useEffect(() => {
    if (success) {
      onClose();
      toast.success("Review Created");
      dispatch(resetReviewState());
    }
  }, [success]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded shadow-lg relative overflow-auto scrollbar-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 bg-[#EAEAEA]">
          <h2 className="font-semibold">Write Review</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Product */}
        <div className="flex items-center gap-3 p-5">
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="w-20 h-24 object-cover rounded"
          />
          <p className="text-sm font-medium">{product.title}</p>
        </div>

        {/* Rating */}
        <div className="px-5">
          <p className="font-medium mb-2">How would you rate it?</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`w-7 h-7 cursor-pointer ${
                  (hover || rating) >= star
                    ? "fill-yellow-400"
                    : "fill-gray-300"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.286-3.967a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="px-5 mt-4">
          <p className="font-medium mb-2">Share a photo</p>
          <div className="flex gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                className="w-16 h-20 object-cover rounded"
              />
            ))}
            {images.length < 5 && (
              <label className="w-16 h-20 border border-dashed flex items-center justify-center cursor-pointer">
                <ImagePlus />
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Review */}
        <div className="px-5 mt-4">
          <p className="font-medium mb-2">Write your review</p>
          <textarea
            className="w-full border border-gray-200 p-2 text-sm resize-none h-24"
            placeholder="Please write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="px-5 py-4">
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-[#E9B159] text-white py-2 font-medium disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Submitting..." : "SUBMIT"}
          </button>
        </div>
      </div>
    </div>
  );
}

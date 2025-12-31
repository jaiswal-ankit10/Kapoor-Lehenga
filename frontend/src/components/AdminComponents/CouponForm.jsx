import { X, Save } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCoupon,
  fetchCoupons,
  updateCoupon,
} from "../../redux/couponSlice";
import { useEffect } from "react";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";

const CouponForm = ({ onClose, coupon }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.coupon);
  const [errors, setErrors] = useState({});
  const initialFormState = {
    code: "",
    title: "",
    discountType: "",
    discountValue: null,
    minPurchaseAmount: null,
    startDate: null,
    expiryDate: null,
    usageLimit: null,
    usagePerUser: null,
    forNewUser: false,
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Coupon name is required";
    }

    if (!formData.code?.trim()) {
      newErrors.code = "Coupon code is required";
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = "Discount value must be greater than 0";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "End date is required";
    }

    if (
      formData.startDate &&
      formData.expiryDate &&
      new Date(formData.startDate) > new Date(formData.expiryDate)
    ) {
      newErrors.expiryDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || "",
        title: coupon.title || "",
        discountType: coupon.discountType || "PERCENTAGE",
        discountValue: coupon.discountValue || null,
        minPurchaseAmount: coupon.minPurchaseAmount || "",
        startDate: coupon.startDate
          ? dayjs(coupon.startDate).format("YYYY-MM-DD")
          : "",
        expiryDate: coupon.expiryDate
          ? dayjs(coupon.expiryDate).format("YYYY-MM-DD")
          : "",
        usageLimit: coupon.usageLimit || "",
        usagePerUser: coupon.usagePerUser || "",
        forNewUser: coupon.forNewUser || false,
        isActive: coupon.isActive ?? true,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [coupon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (coupon) {
        await dispatch(
          updateCoupon({ id: coupon.id, couponData: formData })
        ).unwrap();
        toast.success("Coupon updated successfully");
      } else {
        await dispatch(createCoupon(formData)).unwrap();
        toast.success("Coupon created successfully");
      }

      dispatch(fetchCoupons());

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl relative max-h-[85vh] overflow-scroll">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-100">
          <h2 className="text-lg font-medium text-gray-700">
            {coupon ? "Edit Coupon" : "Create Coupon"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5"
          >
            {/* Coupon Name */}
            <div>
              <label className="text-sm text-gray-600">Coupon Name</label>
              <input
                type="text"
                placeholder="Coupon Name"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-emerald-800"
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Coupon Code */}
            <div>
              <label className="text-sm text-gray-600">Coupon Code</label>
              <input
                type="text"
                placeholder="Coupon Code"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-emerald-800"
              />
              {errors.code && (
                <p className="text-xs text-red-600 mt-1">{errors.code}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="text-sm text-gray-600">Type</label>
              <div className="mt-2 flex gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input
                    type="radio"
                    name="discountType"
                    value="PERCENTAGE"
                    checked={formData.discountType === "PERCENTAGE"}
                    onChange={(e) =>
                      handleChange("discountType", e.target.value)
                    }
                    defaultChecked
                    className="accent-emerald-900"
                  />
                  In Percentage
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input
                    type="radio"
                    name="discountType"
                    value="FLAT"
                    checked={formData.discountType === "FLAT"}
                    onChange={(e) =>
                      handleChange("discountType", e.target.value)
                    }
                    className="accent-emerald-900"
                  />
                  In Amount
                </label>
              </div>
            </div>

            {/* Value */}
            <div>
              <label className="text-sm text-gray-600">Value</label>
              <input
                type="number"
                placeholder="Value"
                value={formData.discountValue}
                onChange={(e) => handleChange("discountValue", e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-emerald-800"
              />
              {errors.discountValue && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.discountValue}
                </p>
              )}
            </div>

            {/* Minimum Purchase */}
            <div>
              <label className="text-sm text-gray-600">
                Minimum Purchase Amount
              </label>
              <input
                type="number"
                placeholder="Minimum Purchase Amount"
                value={formData.minPurchaseAmount}
                onChange={(e) =>
                  handleChange("minPurchaseAmount", e.target.value)
                }
                className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-emerald-800"
              />
            </div>

            {/* Max User*/}
            <div>
              <label className="text-sm text-gray-600">
                Maximum User Use Limit
              </label>
              <input
                type="number"
                placeholder="Use Limit (e.g. 1)"
                value={formData.usagePerUser}
                onChange={(e) => handleChange("usagePerUser", e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-emerald-800"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <div className="relative mt-1">
                <input
                  type="date"
                  placeholder="dd-mm-yyyy"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none"
                />
                {errors.startDate && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <div className="relative mt-1">
                <input
                  type="date"
                  placeholder="dd-mm-yyyy"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange("expiryDate", e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none"
                />
                {errors.expiryDate && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
            </div>

            {/* New Members */}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                className="accent-emerald-900"
                checked={formData.forNewUser}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    forNewUser: e.target.checked,
                  })
                }
              />
              <span className="text-sm text-gray-500">
                Only For New Members
              </span>
            </div>
            {coupon && (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  className="accent-emerald-900"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.checked,
                    })
                  }
                />
                <span className="text-sm text-gray-500">isActive</span>
              </div>
            )}

            {/* Usage Type */}
            <div>
              <label className="text-sm text-gray-600">Usage</label>
              <div className="mt-2 flex gap-6">
                <input
                  type="number"
                  name="usage"
                  placeholder="eg.1"
                  value={formData.usageLimit}
                  onChange={(e) => handleChange("usageLimit", e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none"
                />
              </div>
            </div>
            <div className="md:col-span-2 col-span-1 flex justify-end px-6 py-4 border-t border-gray-100 w-full">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 rounded-md flex items-center gap-2 text-sm font-medium
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#06402B] hover:bg-emerald-900 text-white"
    }`}
              >
                <Save />
                {loading
                  ? "Saving..."
                  : coupon
                  ? "Update Coupon"
                  : "Save Coupon"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CouponForm;

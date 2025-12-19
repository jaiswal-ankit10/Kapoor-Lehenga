import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import PageHeader from "./PageHeader";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import {
  DescriptionSection,
  ImagesSection,
  GeneralInfoSection,
  PricingSection,
} from "./FormComponents/FormSections";
import { Save, BookmarkX } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddProductForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: 0,
    stock: 0,
    category: "",
    brand: "",
    color: "",
  });

  // Pre-fill data
  const product = location.state?.product || null;
  useEffect(() => {
    if (!product) return;
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        discount: product.discount || "",
        stock: product.stock || "",
        category: product.category || "",
        brand: product.brand || "",
      });
    }
  }, [product?._id]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types
    const validFiles = files.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      setError(
        "Some files are not valid image types. Please select only images (jpeg, jpg, png, gif, webp)"
      );
      return;
    }

    // Validate file size (5MB max)
    const oversizedFiles = validFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setError("Some files are too large. Maximum file size is 5MB");
      return;
    }

    // Append to existing selections
    setSelectedImages((prev) => [...prev, ...validFiles]);

    // Create previews and append
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
    setError("");

    // allow picking the same file again
    e.target.value = "";
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke object URLs to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate that at least one image is selected
    if (selectedImages.length === 0) {
      setError("Please select at least one image");
      setLoading(false);
      return;
    }

    // Create FormData for multipart/form-data request
    const formDataToSend = new FormData();

    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    // Append image files
    selectedImages.forEach((image) => {
      formDataToSend.append("images", image);
    });
    try {
      const res = product
        ? await axiosInstance.put(
            `/admin/products/${product._id}`,
            formDataToSend
          )
        : await axiosInstance.post("/admin/products", formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

      if (res.data.success) {
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        navigate(-1);
      }
    } catch (err) {
      console.error("Error creating product:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create product";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    breadcrumbAdmin.home,
    breadcrumbAdmin.product,
    breadcrumbAdmin.productform,
  ];

  return (
    <div>
      <PageHeader title={"Product Form"} breadcrumbs={breadcrumbs} />
      <div className="p-4  my-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <GeneralInfoSection data={formData} updateField={handleChange} />
          <DescriptionSection data={formData} updateField={handleChange} />
          <ImagesSection
            handleImageChange={handleImageChange}
            fileInputRef={fileInputRef}
            selectedImages={selectedImages}
            imagePreviews={imagePreviews}
            removeImage={removeImage}
          />
          <PricingSection data={formData} updateField={handleChange} />

          <div className="bg-white rounded-xl shadow-sm p-6 flex justify-end">
            <div className="flex gap-5">
              <button
                className="bg-gray-400 text-white p-2 rounded"
                onClick={() => navigate(-1)}
              >
                <div className="flex gap-2 items-center">
                  <BookmarkX size={18} />
                  Close
                </div>
              </button>
              <button
                className="bg-[#E9B159] text-white p-2 rounded"
                disabled={loading}
                type="submit"
              >
                <div className="flex gap-2 items-center">
                  <Save size={18} />
                  {loading ? "Saving..." : "Save Product"}
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

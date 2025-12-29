import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import PageHeader from "./PageHeader";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import {
  DescriptionSection,
  ImagesSection,
  GeneralInfoSection,
  PricingSection,
  DetailsSection,
} from "./FormComponents/FormSections";
import { Save, BookmarkX } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddProductForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    price: "",
    discount: 0,
    stock: 0,
    category: "",
    brand: "",
    color: "",
    additionalDetails: [{ title: "", value: "" }],
  });

  const [existingImages, setExistingImages] = useState([]); // DB images
  const [selectedImages, setSelectedImages] = useState([]); // new files
  const [imagePreviews, setImagePreviews] = useState([]); // urls
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // PREFILL DATA ON EDIT
  useEffect(() => {
    if (!product) return;

    setFormData({
      title: product.title || "",
      description: product.description || "",
      longDescription: product.longDescription || "",
      price: product.price || "",
      discount: product.discount || 0,
      stock: product.stock || 0,
      category: product.category || "",
      brand: product.brand || "",
      color: product.color || "",
      additionalDetails: product.additionalDetails || [
        { title: "", value: "" },
      ],
    });

    if (product.images?.length) {
      setExistingImages(product.images);
      setImagePreviews(product.images.map((img) => img));
    }
  }, [product?._id]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ADD NEW IMAGES
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    for (let file of files) {
      if (!validTypes.includes(file.type)) {
        setError("Invalid image type");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be under 5MB");
        return;
      }
    }

    setSelectedImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);

    e.target.value = "";
    setError("");
  };

  // REMOVE IMAGE (existing OR new)
  const removeImage = (index) => {
    if (index < existingImages.length) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingImages.length;
      setSelectedImages((prev) => prev.filter((_, i) => i !== newIndex));
    }

    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // CLEANUP PREVIEWS
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (existingImages.length === 0 && selectedImages.length === 0) {
      setError("At least one image is required");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "additionalDetails") return;
      formDataToSend.append(key, value);
    });
    formDataToSend.append(
      "additionalDetails",
      JSON.stringify(formData.additionalDetails)
    );

    // keep remaining old images
    formDataToSend.append("existingImages", JSON.stringify(existingImages));

    // new images
    selectedImages.forEach((img) => {
      formDataToSend.append("images", img);
    });

    try {
      const res = product
        ? await axiosInstance.put(
            `/admin/products/${product._id}`,
            formDataToSend
          )
        : await axiosInstance.post("/admin/products", formDataToSend);

      if (res.data.success) navigate(-1);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={product ? "Edit Product" : "Add Product"}
        breadcrumbs={[
          breadcrumbAdmin.home,
          breadcrumbAdmin.product,
          breadcrumbAdmin.productform,
        ]}
      />

      <div className="p-4 my-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <GeneralInfoSection data={formData} updateField={handleChange} />
          <DescriptionSection data={formData} updateField={handleChange} />
          <DetailsSection data={formData} updateField={handleChange} />
          <ImagesSection
            handleImageChange={handleImageChange}
            fileInputRef={fileInputRef}
            imagePreviews={imagePreviews}
            removeImage={removeImage}
          />

          <PricingSection data={formData} updateField={handleChange} />

          <div className="bg-white rounded-xl shadow-sm p-6 flex justify-end gap-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            >
              <BookmarkX size={18} /> Close
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#E9B159] text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            >
              <Save size={18} />
              {loading
                ? "Saving..."
                : product
                ? "Update Product"
                : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

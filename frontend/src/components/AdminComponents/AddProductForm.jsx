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
    categoryId: "",
    subCategoryId: "",
    brand: "",
    color: "",
    additionalDetails: [{ title: "", value: "" }],
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  // Add a flag to track if we've loaded the data
  const [hasLoadedProduct, setHasLoadedProduct] = useState(false);

  useEffect(() => {
    axiosInstance.get("/categories").then((res) => {
      setCategories(res.data.categories || []);
    });
  }, []);

  useEffect(() => {
    if (!product?.id) {
      setHasLoadedProduct(true);
      return;
    }

    axiosInstance
      .get(`/admin/products/${product.id}`)
      .then((res) => {
        // console.log("API Response for edit product:", res.data);
        // console.log(
        //   "Additional details from API:",
        //   res.data.product?.additionalDetails
        // );
        setEditProduct(res.data.product);
        setHasLoadedProduct(true);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setEditProduct(null);
        setHasLoadedProduct(true);
      });
  }, [product?.id]);

  const [existingImages, setExistingImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // PREFILL DATA ON EDIT
  const currentProduct = editProduct || product;

  useEffect(() => {
    if (!currentProduct || !hasLoadedProduct) return;

    // console.log("========= LOADING PRODUCT DATA =========");
    // console.log("Current product:", currentProduct);
    // console.log(
    //   "Additional details from currentProduct:",
    //   currentProduct.additionalDetails
    // );
    // console.log(
    //   "Type of additionalDetails:",
    //   typeof currentProduct.additionalDetails
    // );
    // console.log("Is array?", Array.isArray(currentProduct.additionalDetails));

    // Process additional details correctly
    let processedAdditionalDetails = [{ title: "", value: "" }];

    if (currentProduct.additionalDetails) {
      if (Array.isArray(currentProduct.additionalDetails)) {
        if (currentProduct.additionalDetails.length > 0) {
          // Log each item to verify structure
          // currentProduct.additionalDetails.forEach((item, index) => {
          //   console.log(`Item ${index}:`, item);
          //   console.log(`Item ${index} has title?`, item.title);
          //   console.log(`Item ${index} has value?`, item.value);
          // });

          processedAdditionalDetails = currentProduct.additionalDetails
            .filter((item) => item && (item.title || item.value)) // Filter out empty items
            .map((item) => ({
              title: item.title || "",
              value: item.value || "",
            }));
        }
      } else if (
        typeof currentProduct.additionalDetails === "object" &&
        currentProduct.additionalDetails !== null
      ) {
        // If it's an object but not an array, convert to array
        processedAdditionalDetails = Object.entries(
          currentProduct.additionalDetails
        ).map(([key, value]) => ({
          title: key || "",
          value: String(value) || "",
        }));
      }
    }
    //
    console.log("Processed additional details:", processedAdditionalDetails);

    // If no valid additional details, use default
    if (processedAdditionalDetails.length === 0) {
      processedAdditionalDetails = [{ title: "", value: "" }];
    }

    setFormData({
      title: currentProduct.title || "",
      description: currentProduct.description || "",
      longDescription: currentProduct.longDescription || "",
      price: currentProduct.price || "",
      discount: currentProduct.discount || 0,
      stock: currentProduct.stock || 0,
      categoryId: currentProduct.subCategory?.category?.id || "",
      subCategoryId: currentProduct.subCategory?.id || "",
      brand: currentProduct.brand || "",
      color:
        typeof currentProduct.color === "string"
          ? currentProduct.color
          : Array.isArray(currentProduct.color)
          ? currentProduct.color.join(", ")
          : "",
      additionalDetails: processedAdditionalDetails,
    });

    // Log the formData that will be set
    console.log(
      "Setting formData with additionalDetails:",
      processedAdditionalDetails
    );

    setSelectedCategory(currentProduct.subCategory?.category || null);

    if (currentProduct.images?.length) {
      setExistingImages(currentProduct.images);
      setImagePreviews(currentProduct.images);
    }
  }, [currentProduct, hasLoadedProduct]);

  // Add this useEffect to debug formData changes
  useEffect(() => {
    console.log("formData updated:", formData);
    console.log("formData.additionalDetails:", formData.additionalDetails);
  }, [formData]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.subCategoryId) {
      setError("Please select a category and subcategory");
      setLoading(false);
      return;
    }

    if (existingImages.length === 0 && selectedImages.length === 0) {
      setError("At least one image is required");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("longDescription", formData.longDescription);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("discount", formData.discount);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("color", formData.color);
    formDataToSend.append("subCategoryId", formData.subCategoryId);
    formDataToSend.append(
      "additionalDetails",
      JSON.stringify(formData.additionalDetails)
    );
    formDataToSend.append("existingImages", JSON.stringify(existingImages));

    selectedImages.forEach((img) => {
      formDataToSend.append("images", img);
    });

    try {
      const res = product
        ? await axiosInstance.put(
            `/admin/products/${product.id}`,
            formDataToSend
          )
        : await axiosInstance.post("/admin/products", formDataToSend);

      if (res.data.success) {
        navigate(-1);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save product"
      );
    } finally {
      setLoading(false);
    }
  };

  // console.log("========= RENDER LOGS =========");
  // console.log("Current Product:", currentProduct);
  // console.log(
  //   "Current Product Additional Details:",
  //   currentProduct?.additionalDetails
  // );
  // console.log("Form Data Additional Details:", formData.additionalDetails);
  // console.log("Has loaded product?", hasLoadedProduct);

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
          <GeneralInfoSection
            data={formData}
            updateField={handleChange}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <DescriptionSection data={formData} updateField={handleChange} />

          {/* Add conditional rendering while data loads */}
          {hasLoadedProduct && (
            <DetailsSection
              key={`details-${currentProduct?.id}-${JSON.stringify(
                formData.additionalDetails
              )}`}
              data={formData}
              updateField={handleChange}
            />
          )}

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

import React, { useEffect, useRef, useState } from "react";
import PageHeader from "./PageHeader";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import { Plus, Save, Search, SquarePen, Trash } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import dayjs from "dayjs";

const Banner = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [banners, setBanners] = useState([]);
  const [showAddBannerForm, setShowAddBannerForm] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const initialState = {
    title: "",
    isActive: "true",
  };
  const [formData, setFormData] = useState(initialState);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (showAddBannerForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAddBannerForm]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Invalid image type");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!editBanner && !image) {
      setError("Banner image is required");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("isActive", formData.isActive);

    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      if (editBanner) {
        await axiosInstance.put(
          `/banners/update/${editBanner._id}`,
          formDataToSend
        );
      } else {
        await axiosInstance.post("/banners/create", formDataToSend);
      }

      setShowAddBannerForm(false);
      setEditBanner(null);
      setFormData(initialState);
      setImage(null);
      setPreviewImage("");
      fetchAllBanner();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save banner"
      );
    } finally {
      setLoading(false);
    }
  };

  const breadcrumb = [breadcrumbAdmin.home, breadcrumbAdmin.banner];

  const handleClick = () => {
    setShowAddBannerForm((prev) => !prev);
  };

  const fetchAllBanner = async () => {
    try {
      const res = await axiosInstance.get("/banners");
      if (res.data.success) setBanners(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditBanner = (banner) => {
    setEditBanner(banner);
    setFormData({
      title: banner.title,
      isActive: banner.isActive,
    });

    // show existing image preview
    setPreviewImage(banner.image?.url || "");

    // reset file input
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setShowAddBannerForm(true);
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      await axiosInstance.delete(`/banners/remove/${id}`);
      fetchAllBanner();
    } catch (err) {
      console.error(err);
    }
  };
  const handleRemoveImage = () => {
    setPreviewImage("");
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetchAllBanner();
  }, []);

  return (
    <div>
      <PageHeader
        title={"Product List"}
        breadcrumbs={breadcrumb}
        buttonText={"Add Banner"}
        Icon={Plus}
        handleClick={handleClick}
        buttonBg={"bg-[#E9B159]"}
        buttonTextColor={"text-white"}
      />

      <div className="bg-white p-4 rounded shadow">
        <div className="flex flex-wrap gap-4 items-center justify-between p-5 ">
          <div className="flex gap-4">
            <select className="border border-gray-300 rounded-md px-3  py-2 text-sm text-gray-600">
              <option>Action</option>
              <option>Active All</option>
              <option>Deactive All</option>
              <option>Delete All</option>
            </select>
            <select
              className="border border-gray-300 rounded-md px-3  py-2 text-sm text-gray-600 outline-none"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Search"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-40 md:w-64"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-50 text-gray-500">
              <tr className="text-sm text-gray-500">
                <th className="px-5 py-3 text-left whitespace-nowrap min-w-max">
                  ACTION
                </th>
                <th className="px-5 py-3 text-left whitespace-nowrap min-w-max">
                  IMAGE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  TITLE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  UPDATED AT
                </th>
              </tr>
            </thead>
            <tbody>
              {banners?.map((banner) => (
                <tr key={banner._id} className="border-t">
                  <td className="px-5 py-4 text-center flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center cursor-pointer"
                      onClick={() => handleEditBanner(banner)}
                    >
                      <SquarePen size={16} />
                    </div>
                    <div
                      className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center cursor-pointer"
                      onClick={() => handleDeleteBanner(banner._id)}
                    >
                      <Trash size={16} color="red" />
                    </div>
                  </td>

                  <td className="py-2 px-5 text-center">
                    <img
                      src={banner.image?.url}
                      alt={banner.title}
                      className="w-12 h-12 object-fit rounded"
                    />
                  </td>

                  <td className="py-2 px-5 text-center">{banner.title}</td>

                  <td className="py-2 px-5 text-center">
                    {dayjs(banner.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showAddBannerForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowAddBannerForm(false)}
          />

          <div className="relative bg-white w-[95%] max-w-2xl rounded-xl shadow-lg z-10 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-100 flex justify-between items-center px-5 py-3 ">
              <h1 className="text-xl font-semibold">
                {editBanner ? "Edit Banner" : "Add Banner"}
              </h1>

              <button
                onClick={() => setShowAddBannerForm(false)}
                className="text-gray-600 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Active Status
                </label>
                <input
                  type="text"
                  placeholder="true / false"
                  value={formData.isActive || ""}
                  onChange={(e) => handleChange("isActive", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm outline-none"
                />
              </div>

              {previewImage && (
                <div className="space-y-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-48 h-28 object-cover rounded border"
                  />

                  {editBanner && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 ">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#E9B159] text-white px-4 py-2 rounded"
                >
                  <Save size={18} />
                  {loading
                    ? "Saving..."
                    : editBanner
                    ? "Update Banner"
                    : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;

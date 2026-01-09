import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import PageHeader from "./PageHeader";
import { Plus, Save, Search, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const breadcrumb = [breadcrumbAdmin.home, breadcrumbAdmin.categories];

  /*  FETCH  */
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data.categories || []);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /*  SUBMIT  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");

    try {
      if (parentCategoryId) {
        // 👉 Create SubCategory
        await axiosInstance.post(
          `/categories/${parentCategoryId}/subcategories`,
          {
            name: name.trim().toLowerCase(),
          }
        );
      } else {
        // 👉 Create Category
        await axiosInstance.post("/categories", {
          name: name.trim().toLowerCase(),
        });
      }

      toast.success("Saved successfully");
      setName("");
      setParentCategoryId("");
      setOpenModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <div>
      <PageHeader
        title={"Categories List"}
        breadcrumbs={breadcrumb}
        buttonText={"Add Category"}
        Icon={Plus}
        handleClick={() => setOpenModal(true)}
        buttonBg={"bg-[#E9B159]"}
        buttonTextColor={"text-white"}
      />
      <ToastContainer />

      {/*  TABLE  */}
      <div className="bg-white rounded shadow overflow-x-auto p-2">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">SubCategories</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-gray-200">
                <td className="px-5 py-3 capitalize font-medium">{c.name}</td>
                <td className="px-5 py-3">
                  {c.subCategories.length ? (
                    <div className="flex flex-wrap gap-2">
                      {c.subCategories.map((sc) => (
                        <span
                          key={sc.id}
                          className="bg-gray-100 px-3 py-1 rounded text-xs capitalize"
                        >
                          {sc.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">
                      No subcategories
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  MODAL  */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 ">
              <h2 className="font-semibold">Add Category</h2>
              <button onClick={() => setOpenModal(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="text-sm">Parent Category (optional)</label>
                <select
                  value={parentCategoryId}
                  onChange={(e) => setParentCategoryId(e.target.value)}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                >
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Select parent to create a subcategory
                </p>
              </div>

              <div className="flex justify-end">
                <button className="bg-[#E9B159] text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer">
                  <Save />
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;

import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AddProductForm from "./AddProductForm";
import {
  deleteProductById,
  updateProductById,
} from "../../services/productService";
import { useDispatch } from "react-redux";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import PageHeader from "./PageHeader";
import { Edit, Plus, Search, Trash } from "lucide-react";
const Categories = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const dispatch = useDispatch();

  const fetchProducts = async () => {
    try {
      // fetch a larger page for admin (up to 200)
      const res = await axiosInstance.get(
        "/admin/products?limit=200&page=1&sort=newest"
      );
      if (res.data.success) setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (e, p) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    dispatch(deleteProductById(p._id));
  };

  useEffect(() => {
    fetchProducts();
  }, [handleDelete]);

  const handleSuccess = () => {
    fetchProducts();
  };
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setSelectedProduct(null);
    setIsEditOpen(false);
  };

  const breadcrumb = [breadcrumbAdmin.home, breadcrumbAdmin.categories];
  return (
    <div>
      <div>
        <PageHeader
          title={"Categories List"}
          breadcrumbs={breadcrumb}
          buttonText={"Add Categories"}
          Icon={Plus}
          handleClick={() => setShowAddForm(true)}
          buttonBg={"bg-[#E9B159]"}
          buttonTextColor={"text-white"}
        />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex flex-wrap gap-4 items-center justify-between p-5 ">
          <div className="flex gap-4">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600">
              <option>Action</option>
              <option>Active All</option>
              <option>Deactive All</option>
              <option>Delete All</option>
            </select>
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600">
              <option>10 rows</option>
              <option>20 rows</option>
              <option>50 rows</option>
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
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr className="text-sm text-gray-500">
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  ACTION
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  NAME
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  BRAND
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  DESCRIPTION
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  CATEGORY
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  PRODUCT THUMBNAIL IMAGE
                </th>
                <th className="px-5 py-3 text-center">UPDATED AT</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-gray-300">
                  <td className="px-5 py-4 flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                      onClick={() => openEditModal(p)}
                    >
                      <Edit size={16} className="text-green-950" />
                    </div>
                    <div
                      className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center"
                      onClick={handleDelete}
                    >
                      <Trash size={16} className="text-red-700" />
                    </div>
                  </td>
                  <td className="py-2 px-5 text-center">{p.title}</td>
                  <td className="py-2 px-5 text-center">{p.brand}</td>
                  <td className="py-2 px-5 text-center">
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: p.description }}
                    />
                  </td>
                  <td className="py-2 px-5 text-center">{p.category}</td>
                  <td className="py-2 px-5 text-center">
                    <div className="flex items-center justify-center ">
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-10 rounded"
                      />
                    </div>
                  </td>

                  <td className="py-2 px-5 text-center">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showAddForm && (
          <AddProductForm
            onClose={() => setShowAddForm(false)}
            onSuccess={handleSuccess}
          />
        )}
        {isEditOpen && selectedProduct && (
          <AddProductForm product={selectedProduct} onClose={closeEditModal} />
        )}
      </div>
    </div>
  );
};

export default Categories;

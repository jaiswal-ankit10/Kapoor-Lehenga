import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AddProductForm from "./AddProductForm";
import {
  deleteProductById,
  updateProductById,
} from "../../services/productService";
import { useDispatch } from "react-redux";
import EditProductForm from "./EditProductForm";

export default function AdminProducts() {
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

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Products</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-[#E9B159] text-white rounded hover:bg-[#d49d4a]"
        >
          + Add Product
        </button>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="py-2">Title</th>
              <th>Price</th>
              <th>Discounted Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="py-2">{p.title}</td>
                <td>₹{p.price}</td>
                <td>₹{p.discountedPrice || p.price}</td>
                <td>{p.stock}</td>
                <td>{p.category}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="flex items-center gap-4">
                  <button
                    onClick={() => openEditModal(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button onClick={(e) => handleDelete(e, p)}>Delete</button>
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
        <EditProductForm product={selectedProduct} onClose={closeEditModal} />
      )}
    </div>
  );
}

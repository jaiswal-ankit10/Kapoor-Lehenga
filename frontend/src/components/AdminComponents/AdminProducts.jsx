import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/admin/products");
        if (res.data.success) setProducts(res.data.products);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Products</h3>
      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="py-2">Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="py-2">{p.title}</td>
                <td>₹{p.discountedPrice}</td>
                <td>{p.category}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

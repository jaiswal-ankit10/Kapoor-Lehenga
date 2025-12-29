import { Package } from "lucide-react";
import CustomSelect from "./CustomSelect";
import { RichTextEditor } from "./RichTextEditor";
import { useState } from "react";

export function GeneralInfoSection({ data, updateField }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-10">
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT INFO */}
        <div className="col-span-12 md:col-span-3 flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <Package className="text-[#04441f]" size={22} />
          </div>

          <div>
            <h3 className="text-lg  text-gray-600">General Info</h3>
            <p className="text-sm text-gray-500">Add General info</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="col-span-12 md:col-span-9 space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Enter Product name"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Product Brand
              </label>
              <input
                type="text"
                placeholder="Enter Product name"
                value={data.brand || ""}
                onChange={(e) => updateField("brand", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm outline-none"
              />
            </div>

            <div>
              <CustomSelect
                label="Product Category"
                value={data.category}
                onChange={(val) => updateField("category", val)}
                options={[
                  "NEW ARRIVAL",
                  "HALF SAREE",
                  "FASHION SAREE",
                  "LEHENGA",
                  "GOWN",
                  "WEDDING",
                  "CELEBRITY OUTFITS",
                  "OCCASIONS",
                  "ENGAGEMENT",
                  "RECEPTION",
                ]}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Product Colors
            </label>
            <input
              type="text"
              placeholder="Enter Product colors"
              value={data.color || ""}
              onChange={(e) => updateField("color", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export function DescriptionSection({ data, updateField }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-10">
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT INFO */}
        <div className="col-span-12 md:col-span-3 flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <Package className="text-[#04441f]" size={22} />
          </div>

          <div>
            <h3 className="text-lg  text-gray-600">Description</h3>
            <p className="text-sm text-gray-500">Add Description</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="col-span-12 md:col-span-9 space-y-5">
          <label className="block text-sm text-gray-600 mb-1">
            Short Description
          </label>
          <RichTextEditor
            value={data.description}
            onChange={(val) => updateField("description", val)}
            placeholder="Enter description"
          />
          <label className="block text-sm text-gray-600 mb-1">
            Long Description
          </label>
          <RichTextEditor
            value={data.longDescription}
            onChange={(val) => updateField("longDescription", val)}
            placeholder="Enter description"
          />
        </div>
      </div>
    </div>
  );
}
export function DetailsSection({ data, updateField }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-10">
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Info */}
        <div className="col-span-12 md:col-span-3 flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <Package className="text-[#04441f]" size={22} />
          </div>

          <div>
            <h3 className="text-lg text-gray-600">Details</h3>
            <p className="text-sm text-gray-500">Add Details</p>
          </div>
        </div>
        {/* Right Form */}
        <div className="col-span-12 md:col-span-9 space-y-5">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Product Additional Details
          </h3>
          <ProductAdditionalDetails
            details={data.additionalDetails}
            setDetails={(val) => updateField("additionalDetails", val)}
          />
        </div>
      </div>
    </div>
  );
}

export function ImagesSection({
  handleImageChange,
  fileInputRef,
  imagePreviews,
  removeImage,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-10">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3 flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <Package className="text-[#04441f]" size={22} />
          </div>
          <div>
            <h3 className="text-lg text-gray-600">Images</h3>
            <p className="text-sm text-gray-500">Add / Edit product images</p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-9 space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-200 rounded"
          />

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {imagePreviews.map((img, index) => (
                <div key={index} className="relative  w-32 h-32">
                  <img
                    src={img}
                    alt="Preview"
                    className="w-full h-32 object-fit rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PricingSection({ data, updateField }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-10">
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* LEFT INFO */}
        <div className="col-span-12 md:col-span-3 flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <Package className="text-[#04441f]" size={22} />
          </div>

          <div>
            <h3 className="text-lg text-gray-600">Pricing</h3>
            <p className="text-sm text-gray-500">Add Pricing</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="col-span-12 md:col-span-9 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* MRP */}
            <InputWithPrefix
              label="MRP"
              prefix="₹"
              placeholder="Enter MRP"
              value={data.price}
              onChange={(val) => updateField("price", val)}
            />

            {/* Discount */}
            <InputWithPrefix
              label="Discount"
              prefix="%"
              placeholder="Enter Discount"
              value={data.discount}
              onChange={(val) => updateField("discount", val)}
            />
            <div className="max-w-sm">
              <label className="block text-sm text-gray-600 mb-1">
                Stock<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={data.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm   outline-none"
              />
            </div>
          </div>

          {/* Stock */}
        </div>
      </div>
    </div>
  );
}

function InputWithPrefix({ label, prefix, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {label}
        <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden outline-none">
        <span className="px-3 text-gray-500 text-sm border-r">{prefix}</span>
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder={placeholder}
          className="w-full px-3 py-2.5 text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

function ProductAdditionalDetails({ details, setDetails }) {
  const handleChange = (index, field, val) => {
    const updated = [...details];
    updated[index][field] = val;
    setDetails(updated);
  };

  const addRow = () => {
    setDetails([...details, { title: "", value: "" }]);
  };

  const removeRow = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="space-y-4">
        {details.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            {/* Title */}
            <div className="md:col-span-5">
              <label className="block text-sm text-gray-600 mb-1">Title</label>
              <input
                type="text"
                placeholder="Enter title"
                value={item.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm outline-none "
              />
            </div>

            {/* Value */}
            <div className="md:col-span-5">
              <label className="block text-sm text-gray-600 mb-1">Value</label>
              <input
                type="text"
                placeholder="Enter value"
                value={item.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-2 md:justify-end">
              {details.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="h-12 w-12 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 text-xl"
                >
                  –
                </button>
              )}

              {index === details.length - 1 && (
                <button
                  type="button"
                  onClick={addRow}
                  className="h-12 w-12 flex items-center justify-center rounded-md bg-[#E9B159] text-white text-xl cursor-pointer"
                >
                  +
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

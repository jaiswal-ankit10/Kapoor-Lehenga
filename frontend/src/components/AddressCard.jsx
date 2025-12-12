const AddressCard = ({ address }) => {
  return (
    <div className="rounded-md p-4 bg-[#F6F6F6] hover:shadow-md duration-300 w-full md:w-[320px] lg:w-[420px] ">
      <div className="flex gap-4">
        <h3 className="font-semibold">{address.name}</h3>
        {address.default && (
          <span className="border border-yellow-200 text-xs text-yellow-300 bg-white/40 px-2 py-1 rounded-full">
            DEFAULT
          </span>
        )}
      </div>
      <p className="text-sm mt-1">{address.address}</p>

      <div className="flex gap-3 mt-3">
        <button className="border border-gray-100 bg-white text-gray-400 px-3 py-1 text-sm rounded">
          Edit
        </button>
        <button className="border border-gray-100 bg-white text-gray-400 px-3 py-1 text-sm rounded">
          Delete
        </button>
        <button className="bg-black text-white px-3 py-1 text-sm rounded ">
          Deliver Here →
        </button>
      </div>
    </div>
  );
};

export default AddressCard;

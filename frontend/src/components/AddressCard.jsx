const AddressCard = ({ address }) => {
  return (
    <div className="rounded-md p-4 bg-[#F6F6F6] hover:shadow-md duration-300 w-[420px] h-[200px]">
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
        <button className="border px-3 py-1 text-sm rounded">Edit</button>
        <button className="border px-3 py-1 text-sm rounded">Delete</button>
        <button className="bg-black text-white px-3 py-1 text-sm rounded flex-1">
          Deliver Here →
        </button>
      </div>
    </div>
  );
};

export default AddressCard;

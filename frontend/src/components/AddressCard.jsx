import { useDispatch } from "react-redux";
import { selectAddress } from "../redux/addressSlice";

const AddressCard = ({ address }) => {
  const dispatch = useDispatch();

  const handleDeliverHere = () => {
    dispatch(selectAddress(address));
  };

  return (
    <div className="rounded-md p-4 bg-[#F6F6F6] hover:shadow-md duration-300">
      <div className="flex gap-3 items-center">
        <h3 className="font-semibold">{address.fullName}</h3>

        {address.isDefault && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            DEFAULT
          </span>
        )}
      </div>

      <p className="text-sm mt-1">
        {address.address}, {address.city}, {address.state} - {address.pincode}
      </p>

      <div className="flex gap-3 mt-3">
        <button className="border px-3 py-1 text-sm rounded">Edit</button>
        <button className="border px-3 py-1 text-sm rounded">Delete</button>
        <button
          className="bg-black text-white px-3 py-1 text-sm rounded"
          onClick={handleDeliverHere}
        >
          Deliver Here →
        </button>
      </div>
    </div>
  );
};

export default AddressCard;

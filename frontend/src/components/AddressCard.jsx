import { useDispatch } from "react-redux";
import { selectAddress } from "../redux/addressSlice";
import { removeAddress } from "../services/addressService";

const AddressCard = ({ address, isSelected }) => {
  const dispatch = useDispatch();

  const handleDeliverHere = () => {
    dispatch(selectAddress(address));
  };

  return (
    <div
      className={`rounded-md p-4 bg-[#F6F6F6] duration-300 border-2 transition-all
        ${
          isSelected
            ? "border-[#E9B159] shadow-md scale-[1.02]"
            : "border-transparent hover:shadow-md"
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <h3 className="font-semibold">{address.fullName}</h3>
          {address.isDefault && (
            <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded uppercase">
              Default
            </span>
          )}
        </div>

        {isSelected && (
          <span className="text-[10px] bg-[#E9B159] text-white px-2 py-0.5 rounded-full font-bold">
            SELECTED
          </span>
        )}
      </div>

      <p className="text-sm mt-2 text-gray-600 leading-relaxed">
        {address.address}, {address.city}, {address.state} - {address.pincode}
      </p>

      <div className="flex gap-3 mt-4">
        <button className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">
          EDIT
        </button>
        <button
          className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
          onClick={() => dispatch(removeAddress(address.id))}
        >
          DELETE
        </button>

        {!isSelected && (
          <button
            className="ml-auto bg-black text-white px-4 py-1.5 text-xs rounded-sm hover:bg-gray-800 transition-colors"
            onClick={handleDeliverHere}
          >
            DELIVER HERE
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;

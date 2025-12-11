const CartSummary = () => {
  const demoItems = [
    { title: "Pink Ethnic Lehenga", price: 5400, old: 10999, qty: 1 },
    { title: "Pink Ethnic Lehenga", price: 5400, old: 10999, qty: 1 },
  ];

  return (
    <div className="border rounded-md p-3 mb-3">
      <h3 className="font-semibold mb-3">Bag ({demoItems.length} items)</h3>

      {demoItems.map((item, index) => (
        <div key={index} className="flex justify-between mb-2">
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-gray-600 text-sm">Qty: {item.qty}</p>
          </div>
          <div className="text-right">
            <p className="text-green-600 font-bold">₹{item.price}</p>
            <p className="line-through text-gray-400 text-sm">₹{item.old}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartSummary;

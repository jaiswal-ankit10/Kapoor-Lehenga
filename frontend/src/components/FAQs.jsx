import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { faqs } from "../utils/faqs";

const FAQs = () => {
  const [openId, setOpenId] = useState(1); // first item open by default

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-10 ">
      <h2 className="text-xl font-bold mb-4">FAQS</h2>

      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="border border-gray-300 rounded-lg bg-white mb-3 overflow-hidden"
        >
          <div
            className="flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => toggle(faq.id)}
          >
            <p className="font-medium">{faq.question}</p>
            {openId === faq.id ? <FaMinus /> : <FaPlus />}
          </div>

          {/* Content */}
          {openId === faq.id && (
            <div className="px-4 pb-3 text-sm text-gray-600 border-t">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQs;

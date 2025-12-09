import test1 from "../assets/images/test-1.png";
import test2 from "../assets/images/test-2.png";
import test3 from "../assets/images/test-3.png";

const testimonials = [
  {
    img: test1,
    name: "Poornima Naik",
    content:
      "Beautiful Saree.. Quick Delivery And Well Cooperative Staff.. Personally Shared Details And Videos Of Product Before Delivery.. Loved It.. Thank You Anaya 😊",
  },
  {
    img: test2,
    name: "Rubina Bhati",
    content:
      "Loved the clothing. The fabric is breathable and comfortable. Look wise also it’s fine. The colour is a little dull but the embroidery is very good. The Dupatta is just amazing. Loved the combo. One minus point that the pearls or other beads are coming out in one wash. Rest is fine.",
  },
  {
    img: test3,
    name: "Muskan Sharma",
    content:
      "I placed an order for a red georgette online. The saree was delivered before the promised date and the quality was good. Also, a pair of ear rings were sent as a compliment. Their customer service needs a special mention. Would definitely recommend them.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-[#fcefd9] h-[728px] ">
      <h2 className="text-center text-2xl font-semibold mb-8 w-full bg-[#FFD37F]">
        Customer Stories
      </h2>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-10 pt-20">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className=" px-6 pb-6 pt-20 relative bg-white shadow-md w-full max-w-[370px] mx-auto"
          >
            {/* IMAGE */}
            <img
              src={item.img}
              alt={item.name}
              className="w-40 h-52 object-cover absolute -top-12 left-1/2 transform -translate-x-1/2 shadow-md"
            />

            {/* NAME */}
            <h3 className="text-red-600 text-center mt-25">{item.name}</h3>

            {/* CONTENT */}
            <p className="text-gray-700 text-sm leading-relaxed mt-2 text-center">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;

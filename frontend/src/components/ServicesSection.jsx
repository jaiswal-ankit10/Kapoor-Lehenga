import shipping from "../assets/icons/shipping.png";
import exchange from "../assets/icons/exchange.png";
import stiching from "../assets/icons/stiching.png";
import worldwide from "../assets/icons/world-wide.png";

const services = [
  {
    icon: shipping,
    title: "CASH ON DELIVERY",
    desc: "Pay on Delivery available in India upto 3000 INR",
  },
  {
    icon: exchange,
    title: "SIMPLE EXCHANGE",
    desc: "You can Easily exchange any products within 02 days.",
  },
  {
    icon: stiching,
    title: "STITCHING SERVICES",
    desc: "We provide Stitching Services for all Outfits.",
  },
  {
    icon: worldwide,
    title: "WORLDWIDE SHIPPING",
    desc: "We are Delivered Product to Worldwide.",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-12">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        {services.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <img src={item.icon} alt={item.title} className="w-12 h-12" />

            <h3 className="font-semibold text-sm tracking-wide">
              {item.title}
            </h3>

            <p className="text-gray-600 text-xs w-[80%] mx-auto">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;

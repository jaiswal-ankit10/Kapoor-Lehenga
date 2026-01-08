import shipping from "../assets/icons/shipping.png";
import exchange from "../assets/icons/exchange.png";
import stiching from "../assets/icons/stiching.png";
import worldwide from "../assets/icons/world-wide.png";

const services = [
  {
    icon: shipping,
    title: "CASH ON DELIVERY",
  },
  {
    icon: exchange,
    title: "SIMPLE EXCHANGE",
  },
  {
    icon: stiching,
    title: "STITCHING SERVICES",
  },
  {
    icon: worldwide,
    title: "WORLDWIDE SHIPPING",
  },
];

const ServicesSectionProduct = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {services.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 ">
            <img src={item.icon} alt={item.title} className="w-10 h-10" />

            <h3 className="font-medium text-sm tracking-wide">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSectionProduct;

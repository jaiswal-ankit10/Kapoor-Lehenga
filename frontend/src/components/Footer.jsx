import React from "react";
import playStore from "../assets/icons/googleplay.png";
import appStore from "../assets/icons/appstore.png";
import cards from "../assets/icons/cards.png";
import footerBg from "../assets/icons/footer-city.png";
import footerBgSide from "../assets/icons/footer-city-2.png";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black font-jost">
      {/* Top Dark Bar */}
      <div className="bg-[#333333] w-full text-white px-10 py-5 flex flex-wrap justify-around items-center">
        {/* Left - App Download */}
        <div className="flex flex-col items-center">
          <h3 className="uppercase text-md.">Download our app</h3>
          <div className="flex gap-3 mt-2">
            <img src={playStore} alt="Google Play" className="h-8" />
            <img src={appStore} alt="App Store" className="h-8" />
          </div>
        </div>

        {/* Right - Contact */}
        <div className="text-right">
          <h3 className="uppercase text-sm">
            For any help, you may call us at
          </h3>
          <p className="font-medium text-lg">1800-266-3333</p>
          <p className="text-xs">
            (Monday to Saturday: 10 am - 10 pm, Sunday: 10 am - 7 pm)
          </p>
        </div>
      </div>

      {/* Middle Content Section */}
      <div className="px-4 md:px-30 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Company */}
        <div>
          <h3 className="uppercase font-medium mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="uppercase font-medium mb-3">Information</h3>
          <ul className="space-y-2 text-sm">
            <li>Blog/Articles</li>
            <li>Subscribe to Newsletter</li>
            <li>Affiliate Program</li>
            <li>FAQ’s</li>
            <li>Franchise</li>
          </ul>
        </div>

        {/* My Account */}
        <div>
          <h3 className="uppercase font-medium mb-3">May Account</h3>
          <ul className="space-y-2 text-sm">
            <li>Login</li>
            <li>Shopping Bag</li>
            <li>Wishlist</li>
            <li>Order History</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="uppercase font-medium mb-3">Social</h3>
          <ul className="space-y-2 text-sm">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>Pinterest</li>
            <li>LinkedIn</li>
          </ul>
        </div>

        {/* Payment + Subscribe */}
        <div>
          <h3 className="uppercase font-medium mb-3">Safe & Secure Payment</h3>
          <div className="mb-5">
            <img src={cards} alt="visa" className="h-4" />
          </div>

          <h3 className="uppercase font-medium mb-2">Stay in touch</h3>

          <input
            type="email"
            placeholder="Type your email here"
            className="border w-full px-3 py-2 mb-2 outline-none"
          />
          <button className="bg-[#E9B159] px-4 py-2 text-white font-medium">
            Subscribe
          </button>
        </div>
      </div>

      {/* Footer Decorative Background Image */}
      <div className="flex w-full overflow-hidden">
        <img
          src={footerBg}
          alt="footer"
          className="w-[75vw] h-[40vh] object-cover"
        />
        <img
          src={footerBgSide}
          alt="footer"
          className="w-full h-[40vh] object-cover"
        />
      </div>
    </footer>
  );
};

export default Footer;

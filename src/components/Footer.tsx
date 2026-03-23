import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

import Cookie from "js-cookie";
import ToastContainerComponent from "./ToastContainerComponent";
import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

const Footer = ({ setLoginOpen }) => {
  const emailcookie = Cookie.get("finvest");

  const whatsappPhone = "919892204806";
  const whatsappLink = `https://wa.me/${whatsappPhone}`;

  const navigate = useNavigate();

  const serviceclicked = () => {
    if (!emailcookie) {
      toast("Please Register First");
      setLoginOpen(true);
      return;
    }

    navigate("/customerdashboard");
  };

  return (
    <footer className="bg-blue-900  text-white pt-16 pb-8">
      <ToastContainerComponent/>
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <a href="/" className="inline-block mb-6">
              <span className="font-playfair text-2xl font-semibold text-white">
                FinvestCorp<span className="text-finance-gold">.</span>
              </span>
            </a>
            <p className="text-white/70 mb-6">
              Providing expert financial advisory services and loan solutions
              since 2013. Your trusted partner for a secure financial future.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/70 hover:text-finance-gold transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-finance-gold transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-finance-gold transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-finance-gold transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/services"
                  className="text-white/70 hover:text-finance-gold transition-colors"
                >
                  Our Services
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white/70 hover:text-finance-gold transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-white/70 hover:text-finance-gold transition-colors"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-white/70 hover:text-finance-gold transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-6">Services</h4>
            <ul className="space-y-3">
              <li
                onClick={serviceclicked}
                className="text-white/70 cursor-pointer"
              >
                Loan
              </li>

              <li
                onClick={serviceclicked}
                className="text-white/70 cursor-pointer"
              >
                Insurance
              </li>
              <li
                onClick={serviceclicked}
                className="text-white/70 cursor-pointer"
              >
                Investment
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-6">Contact Us</h4>
            <ul className="space-y-3 text-base">
              <li className="text-white/70">
                Andheri West, Mumbai - 400058 <br />
              </li>
              <li>
                <a
                  href="mailto:officefinvestcorp@gmail.com"
                  className="text-white/70 hover:text-finance-gold transition-colors"
                >
                  officefinvestcorp@gmail.com
                </a>
              </li>
              <li className="flex gap-0">
                <a
                  className="text-white/70 hover:text-finance-gold transition-colors"
                  href="tel:+919324592709"
                >
                  +91&nbsp;9324592709&nbsp;/&nbsp;
                </a>
                <a
                  href="tel:+919892204806"
                  className="text-white/70 hover:text-finance-gold transition-colors"
                >
                  +91&nbsp;9892204806
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} FinvestCorp. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-white/70 hover:text-finance-gold transition-colors text-sm"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-white/70 hover:text-finance-gold transition-colors text-sm"
            >
              Cookies Policy
            </a>
          </div>
        </div>
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] hover:bg-[#1EBE5D] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/40 group-hover:ring-white/60" />
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
        <FaWhatsapp className="h-6 w-6" aria-hidden="true" />
      </a>
    </footer>
  );
};

export default Footer;

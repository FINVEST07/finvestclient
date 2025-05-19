import React, { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookie from "js-cookie";


const Navbar = ({ setLoginOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profiledropopen, setProfiledropopen] = useState(false);

  const emailcookie = Cookie.get("finvest");

  

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "py-3 bg-white/95 backdrop-blur-md shadow-md"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center">
            <span className="font-playfair text-xl md:text-2xl font-semibold text-blue-900">
              FinvestCorp<span className="text-blue-400">.</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#services" className="nav-link">
              Services
            </a>
           
            <a href="/customerdashboard" className="nav-link">
              Become a Partner
            </a>
            <a href="/loancalculator" target="_blank" className="nav-link">
              Loan Calculator
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4 ">
            {emailcookie ? (
              <div
                onClick={() => setProfiledropopen(!profiledropopen)}
                className="bg-blue-900 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer"
              >
                <span className="text-white text-xl font-semibold">
                  {emailcookie.slice(0, 1)}
                </span>
              </div>
            ) : (
              <Button
                className="bg-blue-900 hover:bg-blue-800 text-white flex items-center gap-1"
                onClick={() => {
                  setLoginOpen(true);
                }}
              >
                Get Started <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {profiledropopen && (
              <div className="bg-[#fff] flex flex-col gap-2 rounded-md py-2 px-3 absolute top-[12vh] right-6 text-sm border-2 border-[#F2EAD0] shadow-md shadow-[#F2EAD0]">
                <a
                  href="/customerdashboard"
                  className="cursor-pointer"
                  target="_blank"
                >
                  Dashboard
                </a>

                <span
                  onClick={() => {
                    Cookie.remove("finvest");
                    setIsOpen(false);
                     window.location.reload();
                  }}
                >
                  Log Out
                </span>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-finance-charcoal focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden  transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100 py-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className=" flex flex-col space-y-4  pb-3">
            <div className="absolute right-[4%] flex flex-col space-y-2 ml-auto">
              {emailcookie && (
                <div className="bg-[#000] rounded-full w-10 h-10 ml-au flex justify-center items-center">
                  <span className="text-white text-lg">
                    {emailcookie.slice(0, 1)}
                  </span>
                </div>
              )}
            </div>
            {emailcookie && (
              <a
                className="px-4  text-finance-charcoal hover:bg-finance-cream rounded-md"
                href="/customerdashboard"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Dashboard
              </a>
            )}
            <a
              href="#services"
              className="px-4  text-finance-charcoal hover:bg-finance-cream rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Services
            </a>
            <a
              href="#testimonials"
              className="px-4  text-finance-charcoal hover:bg-finance-cream rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Reviews
            </a>
            <a
              href="#about"
              className="px-4  text-finance-charcoal hover:bg-finance-cream rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>

            <a
              href="#contact"
              className="px-4  text-finance-charcoal hover:bg-finance-cream rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
          </div>

          {!emailcookie ? (
            <button
              onClick={() => {
                setLoginOpen(true);
                setIsOpen(false);
                
              }}
              className="w-full flex justify-center py-2 rounded-md text-[#fff] bg-blue-900"
            >
              Get Started
            </button>
          ) : (
            <button
              onClick={() => {
                Cookie.remove("email");
                setIsOpen(false);
                 window.location.reload();
              }}
              className="w-full flex justify-center py-2 rounded-md text-[#fff] bg-blue-900"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

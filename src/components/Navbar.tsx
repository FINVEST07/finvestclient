
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setLoginOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profiledropopen, setProfiledropopen] = useState(false);

  const navigate = useNavigate();

  const RupeeIcon = ({ width }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        viewBox="0 0 320 512"
        fill="#1e40af"
      >
        <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
      </svg>
    );
  };

  const emailcookie = Cookie.get("finvest");

  const handleBecomePartnerClick = (e) => {
    e.preventDefault();

    if (!emailcookie) {
      // No cookie present, open login modal
      setLoginOpen(true);
      return;
    }

    // Cookie present, navigate to dashboard
    window.location.href = "/customerdashboard";
  };

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
      className={`fixed top-0  w-full z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "py-3 bg-white/95 backdrop-blur-md shadow-md"
          : "py-2 bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img
              src="/fin_lo.png"
              alt="FinvestCorp Logo"
              className="h-20 w-24 mr-2"/>
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

            <a
              href="/customerdashboard"
              className="nav-link"
              onClick={handleBecomePartnerClick}
            >
              Become a Partner
            </a>
            <a href="/loancalculator" target="_blank" className="nav-link">
              Loan Calculator
            </a>
            <a href="#contact" className="nav-link flex items-center gap-2">
              Refer & Earn
              <div className="bg-blue-100 flex items-center p-2 rounded-xl">
                <RupeeIcon width={10} />
              </div>
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
                  {emailcookie.slice(0, 1).toUpperCase()}
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
              <div className="bg-[#fff] flex flex-col gap-2 rounded-md z-[999] py-2 px-3 absolute top-[12vh] right-6 text-sm border-2 border-[#F2EAD0] shadow-md shadow-[#F2EAD0]">
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
                  className="cursor-pointer"
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
                <div className="bg-blue-900 rounded-full w-10 h-10 ml-au flex justify-center items-center">
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
            <a href="#about" className="px-4" onClick={() => setIsOpen(false)}>
              About
            </a>
            <a
              href="#services"
              className="px-4  text-finance-charcoal hover:bg-finance-cream rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Services
            </a>

            <a
              href="/customerdashboard"
              className="px-4"
              onClick={(e) => {
                handleBecomePartnerClick(e);
                setIsOpen(false);
              }}
            >
              Become a Partner
            </a>

            <a href="/loancalculator" className="px-4">
              Loan Calculator
            </a>

            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="px-4 flex items-center gap-2"
            >
              Refer & Earn
              <div className="bg-blue-100 flex items-center p-1.5 rounded-xl">
                <RupeeIcon width={10} />
              </div>
            </a>

            <a
              href="#contact"
              className="px-4"
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
                Cookie.remove("finvest"); // Fixed: was "email", should be "finvest"
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

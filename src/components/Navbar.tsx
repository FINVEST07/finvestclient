
import { useRef, useState, useEffect } from "react";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookie from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StockTicker from "@/components/Stocknews";
import BusinessNews from "@/components/BusinessNews";

const Navbar = ({ setLoginOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profiledropopen, setProfiledropopen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [mobileCalculatorOpen, setMobileCalculatorOpen] = useState(false);
  const [investorZoneOpen, setInvestorZoneOpen] = useState(false);
  const [mobileInvestorZoneOpen, setMobileInvestorZoneOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);
  const [mobileCareerOpen, setMobileCareerOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const investorCloseTimeoutRef = useRef<number | null>(null);
  const careerCloseTimeoutRef = useRef<number | null>(null);
  const calculatorWrapperRef = useRef<HTMLDivElement | null>(null);
  const calculatorButtonRef = useRef<HTMLButtonElement | null>(null);
  const calculatorItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const investorZoneWrapperRef = useRef<HTMLDivElement | null>(null);
  const investorZoneButtonRef = useRef<HTMLButtonElement | null>(null);
  const investorZoneItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const careerWrapperRef = useRef<HTMLDivElement | null>(null);
  const careerButtonRef = useRef<HTMLButtonElement | null>(null);
  const careerItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const isCalculatorActive =
    location.pathname === "/loancalculator" ||
    location.pathname === "/loan-eligibility-calculator";

  const isInvestorZoneActive =
    location.pathname === "/investor-zone/auction-properties" ||
    location.pathname === "/investor-zone/alternate-investment" ||
    location.pathname === "/investor-zone/alternate-properties" ||
    location.pathname === "/investor-zone/distress-properties" ||
    location.pathname.startsWith("/investor-zone/");

  const isCareerActive =
    location.pathname === "/refer" ||
    location.pathname === "/become-partner" ||
    location.pathname === "/careers/jobs" ||
    location.pathname.startsWith("/careers/jobs/");

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

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setCalculatorOpen(false);
    }, 150);
  };

  const clearInvestorCloseTimeout = () => {
    if (investorCloseTimeoutRef.current) {
      window.clearTimeout(investorCloseTimeoutRef.current);
      investorCloseTimeoutRef.current = null;
    }
  };

  const scheduleInvestorClose = () => {
    clearInvestorCloseTimeout();
    investorCloseTimeoutRef.current = window.setTimeout(() => {
      setInvestorZoneOpen(false);
    }, 150);
  };

  const clearCareerCloseTimeout = () => {
    if (careerCloseTimeoutRef.current) {
      window.clearTimeout(careerCloseTimeoutRef.current);
      careerCloseTimeoutRef.current = null;
    }
  };

  const scheduleCareerClose = () => {
    clearCareerCloseTimeout();
    careerCloseTimeoutRef.current = window.setTimeout(() => {
      setCareerOpen(false);
    }, 150);
  };

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!calculatorOpen) return;
      const wrapper = calculatorWrapperRef.current;
      if (!wrapper) return;
      if (!wrapper.contains(e.target as Node)) {
        setCalculatorOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [calculatorOpen]);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!investorZoneOpen) return;
      const wrapper = investorZoneWrapperRef.current;
      if (!wrapper) return;
      if (!wrapper.contains(e.target as Node)) {
        setInvestorZoneOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [investorZoneOpen]);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!careerOpen) return;
      const wrapper = careerWrapperRef.current;
      if (!wrapper) return;
      if (!wrapper.contains(e.target as Node)) {
        setCareerOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [careerOpen]);

  const focusCalculatorItem = (index: number) => {
    const el = calculatorItemRefs.current[index];
    if (el) el.focus();
  };

  const onCalculatorButtonKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCalculatorOpen(true);
      window.setTimeout(() => focusCalculatorItem(0), 0);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setCalculatorOpen(false);
    }
  };

  const onCalculatorMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setCalculatorOpen(false);
      calculatorButtonRef.current?.focus();
      return;
    }

    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") {
      return;
    }

    e.preventDefault();
    const items = calculatorItemRefs.current;
    const activeIndex = items.findIndex((n) => n === document.activeElement);

    const lastIndex = items.length - 1;
    if (e.key === "Home") return focusCalculatorItem(0);
    if (e.key === "End") return focusCalculatorItem(lastIndex);

    if (activeIndex === -1) {
      return focusCalculatorItem(0);
    }

    if (e.key === "ArrowDown") {
      return focusCalculatorItem(activeIndex === lastIndex ? 0 : activeIndex + 1);
    }

    if (e.key === "ArrowUp") {
      return focusCalculatorItem(activeIndex === 0 ? lastIndex : activeIndex - 1);
    }
  };

  const focusInvestorZoneItem = (index: number) => {
    const el = investorZoneItemRefs.current[index];
    if (el) el.focus();
  };

  const onInvestorZoneButtonKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setInvestorZoneOpen(true);
      window.setTimeout(() => focusInvestorZoneItem(0), 0);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setInvestorZoneOpen(false);
    }
  };

  const onInvestorZoneMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setInvestorZoneOpen(false);
      investorZoneButtonRef.current?.focus();
      return;
    }

    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") {
      return;
    }

    e.preventDefault();
    const items = investorZoneItemRefs.current;
    const activeIndex = items.findIndex((n) => n === document.activeElement);

    const lastIndex = items.length - 1;
    if (e.key === "Home") return focusInvestorZoneItem(0);
    if (e.key === "End") return focusInvestorZoneItem(lastIndex);

    if (activeIndex === -1) {
      return focusInvestorZoneItem(0);
    }

    if (e.key === "ArrowDown") {
      return focusInvestorZoneItem(activeIndex === lastIndex ? 0 : activeIndex + 1);
    }

    if (e.key === "ArrowUp") {
      return focusInvestorZoneItem(activeIndex === 0 ? lastIndex : activeIndex - 1);
    }
  };

  const focusCareerItem = (index: number) => {
    const el = careerItemRefs.current[index];
    if (el) el.focus();
  };

  const onCareerButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCareerOpen(true);
      window.setTimeout(() => focusCareerItem(0), 0);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setCareerOpen(false);
    }
  };

  const onCareerMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setCareerOpen(false);
      careerButtonRef.current?.focus();
      return;
    }

    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") {
      return;
    }

    e.preventDefault();
    const items = careerItemRefs.current;
    const activeIndex = items.findIndex((n) => n === document.activeElement);

    const lastIndex = items.length - 1;
    if (e.key === "Home") return focusCareerItem(0);
    if (e.key === "End") return focusCareerItem(lastIndex);

    if (activeIndex === -1) {
      return focusCareerItem(0);
    }

    if (e.key === "ArrowDown") {
      return focusCareerItem(activeIndex === lastIndex ? 0 : activeIndex + 1);
    }

    if (e.key === "ArrowUp") {
      return focusCareerItem(activeIndex === 0 ? lastIndex : activeIndex - 1);
    }
  };

  return (
    <nav
      className={`fixed top-0  w-full z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "py-0 bg-white/95 backdrop-blur-md shadow-md"
          : "py-0 bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/fin_lo.png"
              alt="FinvestCorp Logo"
              className="h-20 w-24 mr-2"/>
            <span className="font-playfair text-xl md:text-2xl font-semibold text-blue-900">
              FinvestCorp<span className="text-blue-400">.</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/services" className={`nav-link ${location.pathname === "/services" ? "text-blue-900" : ""}`}>
              Services
            </Link>

            <div
              ref={investorZoneWrapperRef}
              className="relative"
              onMouseEnter={() => {
                clearInvestorCloseTimeout();
                setInvestorZoneOpen(true);
              }}
              onMouseLeave={() => {
                scheduleInvestorClose();
              }}
            >
              <button
                ref={investorZoneButtonRef}
                type="button"
                className={`nav-link ${isInvestorZoneActive ? "text-blue-900" : ""}`}
                aria-haspopup="menu"
                aria-expanded={investorZoneOpen}
                onClick={() => setInvestorZoneOpen((v) => !v)}
                onKeyDown={onInvestorZoneButtonKeyDown}
              >
                Investor Zone
              </button>
              {investorZoneOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full pt-2"
                  onMouseEnter={() => {
                    clearInvestorCloseTimeout();
                  }}
                  onMouseLeave={() => {
                    scheduleInvestorClose();
                  }}
                  onKeyDown={onInvestorZoneMenuKeyDown}
                >
                  <div className="w-56 rounded-xl border border-blue-100 bg-white shadow-lg overflow-hidden">
                    <Link
                      role="menuitem"
                      to="/investor-zone/auction-properties"
                      className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                      onClick={() => setInvestorZoneOpen(false)}
                      ref={(el) => {
                        investorZoneItemRefs.current[0] = el;
                      }}
                    >
                      Auction Properties
                    </Link>
                    <Link
                      role="menuitem"
                      to="/investor-zone/alternate-investment"
                      className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                      onClick={() => setInvestorZoneOpen(false)}
                      ref={(el) => {
                        investorZoneItemRefs.current[1] = el;
                      }}
                    >
                      Alternate Investment
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              ref={calculatorWrapperRef}
              className="relative"
              onMouseEnter={() => {
                clearCloseTimeout();
                setCalculatorOpen(true);
              }}
              onMouseLeave={() => {
                scheduleClose();
              }}
            >
              <button
                ref={calculatorButtonRef}
                type="button"
                className={`nav-link ${isCalculatorActive ? "text-blue-900" : ""}`}
                aria-haspopup="menu"
                aria-expanded={calculatorOpen}
                onClick={() => setCalculatorOpen((v) => !v)}
                onKeyDown={onCalculatorButtonKeyDown}
              >
                Calculator
              </button>
              {calculatorOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full pt-2"
                  onMouseEnter={() => {
                    clearCloseTimeout();
                  }}
                  onMouseLeave={() => {
                    scheduleClose();
                  }}
                  onKeyDown={onCalculatorMenuKeyDown}
                >
                  <div className="w-56 rounded-xl border border-blue-100 bg-white shadow-lg overflow-hidden">
                  <Link
                    role="menuitem"
                    to="/loancalculator"
                    className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                    onClick={() => setCalculatorOpen(false)}
                    ref={(el) => {
                      calculatorItemRefs.current[0] = el;
                    }}
                  >
                    EMI Calculator
                  </Link>
                  <Link
                    role="menuitem"
                    to="/loan-eligibility-calculator"
                    className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                    onClick={() => setCalculatorOpen(false)}
                    ref={(el) => {
                      calculatorItemRefs.current[1] = el;
                    }}
                  >
                    Loan Eligibility Calculator
                  </Link>
                  <Link
                    role="menuitem"
                    to="/sipcalculator"
                    className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                    onClick={() => setCalculatorOpen(false)}
                    ref={(el) => {
                      calculatorItemRefs.current[2] = el;
                    }}
                  >
                    SIP Calculator
                  </Link>
                  <Link
                    role="menuitem"
                    to="/fdcalculator"
                    className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                    onClick={() => setCalculatorOpen(false)}
                    ref={(el) => {
                      calculatorItemRefs.current[3] = el;
                    }}
                  >
                    FD Calculator
                  </Link>                  
                  </div>
                </div>
              )}
            </div>

            <div
              ref={careerWrapperRef}
              className="relative"
              onMouseEnter={() => {
                clearCareerCloseTimeout();
                setCareerOpen(true);
              }}
              onMouseLeave={() => {
                scheduleCareerClose();
              }}
            >
              <button
                ref={careerButtonRef}
                type="button"
                className={`nav-link ${isCareerActive ? "text-blue-900" : ""}`}
                aria-haspopup="menu"
                aria-expanded={careerOpen}
                onClick={() => setCareerOpen((v) => !v)}
                onKeyDown={onCareerButtonKeyDown}
              >
                Career
              </button>
              {careerOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full pt-2"
                  onMouseEnter={() => {
                    clearCareerCloseTimeout();
                  }}
                  onMouseLeave={() => {
                    scheduleCareerClose();
                  }}
                  onKeyDown={onCareerMenuKeyDown}
                >
                  <div className="w-56 rounded-xl border border-blue-100 bg-white shadow-lg overflow-hidden">
                    <Link
                      role="menuitem"
                      to="/refer"
                      className="flex items-center justify-between px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                      onClick={() => setCareerOpen(false)}
                      ref={(el) => {
                        careerItemRefs.current[0] = el;
                      }}
                    >
                      <span>Refer & Earn</span>
                      <span className="bg-blue-100 flex items-center p-1 rounded-lg">
                        <RupeeIcon width={10} />
                      </span>
                    </Link>
                    <Link
                      role="menuitem"
                      to="/careers/jobs"
                      className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                      onClick={() => setCareerOpen(false)}
                      ref={(el) => {
                        careerItemRefs.current[1] = el;
                      }}
                    >
                      Apply for Job
                    </Link>
                    <Link
                      role="menuitem"
                      to="/become-partner"
                      className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                      onClick={() => setCareerOpen(false)}
                      ref={(el) => {
                        careerItemRefs.current[2] = el;
                      }}
                    >
                      Become a Partner
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/blogs" className={`nav-link ${location.pathname === "/blogs" ? "text-blue-900" : ""}`}>Blogs</Link>
            <Link to="/gallery" className={`nav-link ${location.pathname === "/gallery" ? "text-blue-900" : ""}`}>Gallery</Link>
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
                <Link
                  to="/customerdashboard"
                  className="cursor-pointer"
                  onClick={() => setProfiledropopen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  to="/favourites"
                  className="cursor-pointer"
                  onClick={() => setProfiledropopen(false)}
                >
                  Favourites
                </Link>

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
              <Link
                className="px-4  text-finance-charcoal hover:bg-finance-cream rounded-md"
                to="/customerdashboard"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Dashboard
              </Link>
            )}

            {emailcookie && (
              <Link
                className="px-4  text-finance-charcoal hover:bg-finance-cream rounded-md"
                to="/favourites"
                onClick={() => {
                  setIsOpen(false);
                  setMobileCalculatorOpen(false);
                  setMobileInvestorZoneOpen(false);
                  setMobileCareerOpen(false);
                }}
              >
                Favourites
              </Link>
            )}
            
            <a
              href="/services"
              className="px-4  text-finance-charcoal hover:bg-finance-cream rounded-md"
              onClick={() => {
                setIsOpen(false);
                setMobileCalculatorOpen(false);
                setMobileInvestorZoneOpen(false);
                setMobileCareerOpen(false);
              }}
            >
              Services
            </a>

            <button
              type="button"
              className="px-4 w-full flex items-center justify-between text-left text-finance-charcoal hover:bg-finance-cream rounded-md"
              aria-haspopup="menu"
              aria-expanded={mobileInvestorZoneOpen}
              onClick={(e) => {
                e.stopPropagation();
                setMobileInvestorZoneOpen((prev) => !prev);
              }}
            >
              <span className="flex-1 py-1">Investor Zone</span>

              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileInvestorZoneOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {mobileInvestorZoneOpen && (
              <div role="menu" className="pl-6 flex flex-col space-y-2">
                <Link
                  role="menuitem"
                  to="/investor-zone/auction-properties"
                  className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileInvestorZoneOpen(false);
                    setMobileCalculatorOpen(false);
                    setMobileCareerOpen(false);
                    setIsOpen(false);
                  }}
                >
                  Auction Properties
                </Link>
                <Link
                  role="menuitem"
                  to="/investor-zone/alternate-investment"
                  className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileInvestorZoneOpen(false);
                    setMobileCalculatorOpen(false);
                    setMobileCareerOpen(false);
                    setIsOpen(false);
                  }}
                >
                  Alternate Investment
                </Link>
              </div>
            )}

            <button
              type="button"
              className="px-4 w-full flex items-center justify-between text-left text-finance-charcoal hover:bg-finance-cream rounded-md"
              aria-haspopup="menu"
              aria-expanded={mobileCalculatorOpen}
              onClick={(e) => {
                e.stopPropagation();
                setMobileCalculatorOpen((prev) => !prev);
              }}
            >
              <span className="flex-1 py-1">Calculator</span>

              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileCalculatorOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {mobileCalculatorOpen && (
              <div role="menu" className="pl-6 flex flex-col space-y-2">
                <Link
                  role="menuitem"
                  to="/loancalculator"
                  className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileCalculatorOpen(false);
                    setMobileCareerOpen(false);
                    setIsOpen(false);
                  }}
                >
                  EMI Calculator
                </Link>
                <Link
                  role="menuitem"
                  to="/loan-eligibility-calculator"
                  className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileCalculatorOpen(false);
                    setMobileCareerOpen(false);
                    setIsOpen(false);
                  }}
                >
                  Loan Eligibility Calculator
                </Link>
                <Link
                  role="menuitem"
                  to="/sipcalculator"
                  className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileCalculatorOpen(false);
                    setMobileCareerOpen(false);
                    setIsOpen(false);
                  }}
                >
                  SIP Calculator
                </Link>
                <Link
                  role="menuitem"
                  to="/fdcalculator"
                  className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileCalculatorOpen(false);
                    setMobileCareerOpen(false);
                    setIsOpen(false);
                  }}
                >
                  FD Calculator
                </Link>                
              </div>
            )}

            <button
              type="button"
              className="px-4 w-full flex items-center justify-between text-left text-finance-charcoal hover:bg-finance-cream rounded-md"
              aria-haspopup="menu"
              aria-expanded={mobileCareerOpen}
              onClick={(e) => {
                e.stopPropagation();
                setMobileCareerOpen((prev) => !prev);
              }}
            >
              <span className="flex-1 py-1">Career</span>

              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileCareerOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {mobileCareerOpen && (
              <div role="menu" className="pl-6 flex flex-col space-y-2">
                <Link
                  role="menuitem"
                  to="/refer"
                  className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileCareerOpen(false);
                    setMobileInvestorZoneOpen(false);
                    setMobileCalculatorOpen(false);
                    setIsOpen(false);
                  }}
                >
                  Refer & Earn
                  <span className="bg-blue-100 flex items-center p-1 rounded-lg">
                    <RupeeIcon width={10} />
                  </span>
                </Link>
                <Link
                  role="menuitem"
                  to="/careers/jobs"
                  className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileCareerOpen(false);
                    setMobileInvestorZoneOpen(false);
                    setMobileCalculatorOpen(false);
                    setIsOpen(false);
                  }}
                >
                  Apply for Job
                </Link>
                <Link
                  role="menuitem"
                  to="/become-partner"
                  className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileCareerOpen(false);
                    setMobileInvestorZoneOpen(false);
                    setMobileCalculatorOpen(false);
                    setIsOpen(false);
                  }}
                >
                  Become a Partner
                </Link>
              </div>
            )}

            <Link
              to="/blogs"
              className="px-4"
              onClick={() => {
                setIsOpen(false);
                setMobileCalculatorOpen(false);
                setMobileInvestorZoneOpen(false);
                setMobileCareerOpen(false);
              }}
            >
              Blogs
            </Link>
            <Link
              to="/gallery"
              className="px-4"
              onClick={() => {
                setIsOpen(false);
                setMobileCalculatorOpen(false);
                setMobileInvestorZoneOpen(false);
                setMobileCareerOpen(false);
              }}
            >
              Gallery
            </Link>
          </div>

          {!emailcookie ? (
            <button
              onClick={() => {
                setLoginOpen(true);
                setIsOpen(false);
                setMobileCalculatorOpen(false);
                setMobileInvestorZoneOpen(false);
                setMobileCareerOpen(false);
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
                setMobileCalculatorOpen(false);
                setMobileInvestorZoneOpen(false);
                setMobileCareerOpen(false);
                window.location.reload();
              }}
              className="w-full flex justify-center py-2 rounded-md text-[#fff] bg-blue-900"
            >
              Log Out
            </button>
          )}
        </div>
      <StockTicker />
      <BusinessNews/>
      </div>
    </nav>
  );
};

export default Navbar;

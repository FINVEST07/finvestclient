
import { useRef, useState, useEffect } from "react";
import { Menu, X, ChevronRight, ChevronDown, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookie from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StockTicker from "@/components/Stocknews";
import BusinessNews from "@/components/BusinessNews";
import axios from "axios";
import { getLoggedInEmail } from "@/lib/favourites";

const Navbar = ({ setLoginOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profiledropopen, setProfiledropopen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [loanSubmenuOpen, setLoanSubmenuOpen] = useState(false);
  const [mobileLoanSubmenuOpen, setMobileLoanSubmenuOpen] = useState(false);
  const [insuranceSubmenuOpen, setInsuranceSubmenuOpen] = useState(false);
  const [mobileInsuranceSubmenuOpen, setMobileInsuranceSubmenuOpen] = useState(false);
  const [investmentSubmenuOpen, setInvestmentSubmenuOpen] = useState(false);
  const [mobileInvestmentSubmenuOpen, setMobileInvestmentSubmenuOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [mobileCalculatorOpen, setMobileCalculatorOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);
  const [mobileCareerOpen, setMobileCareerOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState<string | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const servicesCloseTimeoutRef = useRef<number | null>(null);
  const careerCloseTimeoutRef = useRef<number | null>(null);
  const servicesWrapperRef = useRef<HTMLDivElement | null>(null);
  const servicesButtonRef = useRef<HTMLButtonElement | null>(null);
  const servicesItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const calculatorWrapperRef = useRef<HTMLDivElement | null>(null);
  const calculatorButtonRef = useRef<HTMLButtonElement | null>(null);
  const calculatorItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const careerWrapperRef = useRef<HTMLDivElement | null>(null);
  const careerButtonRef = useRef<HTMLButtonElement | null>(null);
  const careerItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const isCalculatorActive =
    location.pathname === "/loancalculator" ||
    location.pathname === "/loan-eligibility-calculator";

  const isServicesActive = location.pathname === "/services";

  const isAuctionPropertiesActive =
    location.pathname === "/investor-zone/auction-properties" ||
    location.pathname.startsWith("/investor-zone/auction/");

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

  useEffect(() => {
    const email = getLoggedInEmail();
    if (!email) {
      setIsPremium(false);
      setPremiumExpiresAt(null);
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URI}payments/premium-status`, {
        headers: { "x-user-email": email },
        withCredentials: true,
      })
      .then((res) => {
        setIsPremium(Boolean(res.data?.premium));
        setPremiumExpiresAt(res.data?.premiumExpiresAt || null);
      })
      .catch(() => {
        setIsPremium(false);
        setPremiumExpiresAt(null);
      });
  }, [emailcookie]);

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

  const clearServicesCloseTimeout = () => {
    if (servicesCloseTimeoutRef.current) {
      window.clearTimeout(servicesCloseTimeoutRef.current);
      servicesCloseTimeoutRef.current = null;
    }
  };

  const scheduleServicesClose = () => {
    clearServicesCloseTimeout();
    servicesCloseTimeoutRef.current = window.setTimeout(() => {
      setServicesOpen(false);
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
      if (!servicesOpen) return;
      const wrapper = servicesWrapperRef.current;
      if (!wrapper) return;
      if (!wrapper.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [servicesOpen]);

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

  const focusServicesItem = (index: number) => {
    const el = servicesItemRefs.current[index];
    if (el) el.focus();
  };

  const onServicesButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setServicesOpen(true);
      window.setTimeout(() => focusServicesItem(0), 0);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setServicesOpen(false);
    }
  };

  const onServicesMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setServicesOpen(false);
      servicesButtonRef.current?.focus();
      return;
    }

    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") {
      return;
    }

    e.preventDefault();
    const items = servicesItemRefs.current;
    const activeIndex = items.findIndex((n) => n === document.activeElement);
    const lastIndex = items.length - 1;

    if (e.key === "Home") return focusServicesItem(0);
    if (e.key === "End") return focusServicesItem(lastIndex);

    if (activeIndex === -1) {
      return focusServicesItem(0);
    }

    if (e.key === "ArrowDown") {
      return focusServicesItem(activeIndex === lastIndex ? 0 : activeIndex + 1);
    }

    if (e.key === "ArrowUp") {
      return focusServicesItem(activeIndex === 0 ? lastIndex : activeIndex - 1);
    }
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
            <div
              ref={servicesWrapperRef}
              className="relative"
              onMouseEnter={() => {
                clearServicesCloseTimeout();
                setServicesOpen(true);
              }}
              onMouseLeave={() => {
                scheduleServicesClose();
              }}
            >
              <button
                ref={servicesButtonRef}
                type="button"
                className={`nav-link ${isServicesActive ? "text-blue-900" : ""}`}
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((v) => !v)}
                onKeyDown={onServicesButtonKeyDown}
              >
                <span className="inline-flex items-center gap-1">
                  Services
                  <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                </span>
              </button>

              {servicesOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full pt-2 z-[60]"
                  onMouseEnter={() => {
                    clearServicesCloseTimeout();
                  }}
                  onMouseLeave={() => {
                    scheduleServicesClose();
                  }}
                  onKeyDown={onServicesMenuKeyDown}
                >
                  <div className="w-56 rounded-xl border border-blue-100 bg-white shadow-lg">
                    {/* Loans Submenu */}
                    <div
                      className="relative"
                      onMouseEnter={() => setLoanSubmenuOpen(true)}
                      onMouseLeave={() => setLoanSubmenuOpen(false)}
                    >
                      <button
                        type="button"
                        className="block w-full text-left px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                      >
                        <span className="inline-flex items-center justify-between w-full">
                          Loans
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </button>
                      {loanSubmenuOpen && (
                        <div className="absolute left-full top-0 w-64 ml-0.5 rounded-xl border border-blue-100 bg-white shadow-lg overflow-hidden z-[70]">
                          <Link
                            role="menuitem"
                            to="/info/home-loan"
                            className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                            onClick={() => setServicesOpen(false)}
                          >
                            Home Loan
                          </Link>
                          <Link
                            role="menuitem"
                            to="/info/loan-against-property"
                            className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                            onClick={() => setServicesOpen(false)}
                          >
                            Loan Against Property
                          </Link>
                          <Link
                            role="menuitem"
                            to="/info/msme-loan"
                            className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                            onClick={() => setServicesOpen(false)}
                          >
                            MSME Loan
                          </Link>
                          <Link
                            role="menuitem"
                            to="/construction-finance"
                            className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                            onClick={() => setServicesOpen(false)}
                          >
                            Construction Finance
                          </Link>
                        </div>
                      )}
                    </div>
                    {/* Insurances Submenu (temporarily hidden)
                    <div
                      className="relative"
                      onMouseEnter={() => setInsuranceSubmenuOpen(true)}
                      onMouseLeave={() => setInsuranceSubmenuOpen(false)}
                    >
                      <button
                        type="button"
                        className="block w-full text-left px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                      >
                        <span className="inline-flex items-center justify-between w-full">
                          Insurances
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </button>
                      {insuranceSubmenuOpen && (
                        <div className="absolute left-full top-0 w-64 ml-0.5 rounded-xl border border-blue-100 bg-white shadow-lg overflow-hidden z-[70]">
                          <Link
                            role="menuitem"
                            to="/info/life-insurance"
                            className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                            onClick={() => setServicesOpen(false)}
                          >
                            Life Insurance
                          </Link>
                          <Link
                            role="menuitem"
                            to="/info/health-insurance"
                            className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                            onClick={() => setServicesOpen(false)}
                          >
                            Health Insurance
                          </Link>
                          <Link
                            role="menuitem"
                            to="/info/general-insurance"
                            className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                            onClick={() => setServicesOpen(false)}
                          >
                            General Insurance
                          </Link>
                        </div>
                      )}
                    </div>
                    */}
                    {/* Investments Submenu (temporarily hidden)
                    <div
                      className="relative"
                      onMouseEnter={() => setInvestmentSubmenuOpen(true)}
                      onMouseLeave={() => setInvestmentSubmenuOpen(false)}
                    >
                      <button
                        type="button"
                        className="block w-full text-left px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                      >
                        <span className="inline-flex items-center justify-between w-full">
                          Investments
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </button>
                      {investmentSubmenuOpen && (
                        <div className="absolute left-full top-0 w-64 ml-0.5 rounded-xl border border-blue-100 bg-white shadow-lg overflow-hidden z-[70]">
                          <Link
                            role="menuitem"
                            to="/info/mutual-funds"
                            className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                            onClick={() => setServicesOpen(false)}
                          >
                            Mutual Funds
                          </Link>
                          <Link
                            role="menuitem"
                            to="/info/fixed-deposit"
                            className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                            onClick={() => setServicesOpen(false)}
                          >
                            Fixed Deposit
                          </Link>
                          <Link
                            role="menuitem"
                            to="/info/bonds"
                            className="block px-4 py-3 text-sm text-blue-900 hover:bg-blue-50"
                            onClick={() => setServicesOpen(false)}
                          >
                            Bonds
                          </Link>
                        </div>
                      )}
                    </div>
                    */}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/investor-zone/auction-properties"
              className={`nav-link ${isAuctionPropertiesActive ? "text-blue-900" : ""}`}
            >
              Auction Properties
            </Link>

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
                  className="absolute left-0 top-full pt-2 z-[60]"
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
                  className="absolute left-0 top-full pt-2 z-[60]"
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

                {isPremium ? (
                  <span className="flex items-center gap-2 cursor-default font-semibold rounded px-2 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-300 text-amber-800">
                    <Crown className="h-4 w-4 text-amber-500 fill-amber-200" />
                    <span>
                      Package Valid till{" "}
                      {premiumExpiresAt
                        ? new Date(premiumExpiresAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </span>
                ) : (
                  <Link
                    to="/premium-plans"
                    className="flex items-center gap-2 cursor-pointer font-semibold rounded px-2 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 border border-amber-500 text-white hover:from-amber-500 hover:to-yellow-600 transition-colors"
                    onClick={() => setProfiledropopen(false)}
                  >
                    <Crown className="h-4 w-4 text-white fill-white/30" />
                    Premium
                  </Link>
                )}

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
                  setMobileCareerOpen(false);
                }}
              >
                Favourites
              </Link>
            )}

            {emailcookie && (
              isPremium ? (
                <span className="flex items-center gap-2 px-4 py-1.5 font-semibold rounded-md bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-300 text-amber-800">
                  <Crown className="h-4 w-4 text-amber-500 fill-amber-200" />
                  <span>
                    Package Valid till{" "}
                    {premiumExpiresAt
                      ? new Date(premiumExpiresAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </span>
              ) : (
                <Link
                  className="flex items-center gap-2 px-4 py-1.5 font-semibold rounded-md bg-gradient-to-r from-amber-400 to-yellow-500 border border-amber-500 text-white hover:from-amber-500 hover:to-yellow-600 transition-colors"
                  to="/premium-plans"
                  onClick={() => {
                    setIsOpen(false);
                    setMobileCalculatorOpen(false);
                    setMobileCareerOpen(false);
                  }}
                >
                  <Crown className="h-4 w-4 text-white fill-white/30" />
                  Premium
                </Link>
              )
            )}

            <a
              href="/services"
              className="hidden"
            >
              Services
            </a>

            <button
              type="button"
              className="px-4 w-full flex items-center justify-between text-left text-finance-charcoal hover:bg-finance-cream rounded-md"
              aria-haspopup="menu"
              aria-expanded={mobileServicesOpen}
              onClick={(e) => {
                e.stopPropagation();
                setMobileServicesOpen((prev) => !prev);
              }}
            >
              <span className="flex-1 py-1">Services</span>

              <ChevronDown
                className={`h-4 w-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {mobileServicesOpen && (
              <div role="menu" className="pl-6 flex flex-col space-y-2">
                {/* Loans Submenu */}
                <button
                  type="button"
                  className="px-4 w-full flex items-center justify-between text-left text-finance-charcoal hover:bg-finance-cream rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileLoanSubmenuOpen((prev) => !prev);
                  }}
                >
                  <span className="flex-1 py-1">Loans</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileLoanSubmenuOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {mobileLoanSubmenuOpen && (
                  <div role="menu" className="pl-6 flex flex-col space-y-2">
                    <Link
                      role="menuitem"
                      to="/info/home-loan"
                      className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileLoanSubmenuOpen(false);
                        setMobileServicesOpen(false);
                        setMobileCalculatorOpen(false);
                        setMobileCareerOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      Home Loan
                    </Link>
                    <Link
                      role="menuitem"
                      to="/info/loan-against-property"
                      className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileLoanSubmenuOpen(false);
                        setMobileServicesOpen(false);
                        setMobileCalculatorOpen(false);
                        setMobileCareerOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      Loan Against Property
                    </Link>
                    <Link
                      role="menuitem"
                      to="/info/msme-loan"
                      className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileLoanSubmenuOpen(false);
                        setMobileServicesOpen(false);
                        setMobileCalculatorOpen(false);
                        setMobileCareerOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      MSME Loan
                    </Link>
                    <Link
                      role="menuitem"
                      to="/construction-finance"
                      className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileLoanSubmenuOpen(false);
                        setMobileServicesOpen(false);
                        setMobileCalculatorOpen(false);
                        setMobileCareerOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      Construction Finance
                    </Link>
                  </div>
                )}
                {/* Insurances Submenu (temporarily hidden)
                <button
                  type="button"
                  className="px-4 w-full flex items-center justify-between text-left text-finance-charcoal hover:bg-finance-cream rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileInsuranceSubmenuOpen((prev) => !prev);
                  }}
                >
                  <span className="flex-1 py-1">Insurances</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileInsuranceSubmenuOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {mobileInsuranceSubmenuOpen && (
                  <div role="menu" className="pl-6 flex flex-col space-y-2">
                    <Link
                      role="menuitem"
                      to="/info/life-insurance"
                      className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileInsuranceSubmenuOpen(false);
                        setMobileServicesOpen(false);
                        setMobileCalculatorOpen(false);
                        setMobileCareerOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      Life Insurance
                    </Link>
                    <Link
                      role="menuitem"
                      to="/info/health-insurance"
                      className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileInsuranceSubmenuOpen(false);
                        setMobileServicesOpen(false);
                        setMobileCalculatorOpen(false);
                        setMobileCareerOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      Health Insurance
                    </Link>
                    <Link
                      role="menuitem"
                      to="/info/general-insurance"
                      className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileInsuranceSubmenuOpen(false);
                        setMobileServicesOpen(false);
                        setMobileCalculatorOpen(false);
                        setMobileCareerOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      General Insurance
                    </Link>
                  </div>
                )}
                */}
                {/* Investments Submenu (temporarily hidden)
                <button
                  type="button"
                  className="px-4 w-full flex items-center justify-between text-left text-finance-charcoal hover:bg-finance-cream rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileInvestmentSubmenuOpen((prev) => !prev);
                  }}
                >
                  <span className="flex-1 py-1">Investments</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileInvestmentSubmenuOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {mobileInvestmentSubmenuOpen && (
                  <div role="menu" className="pl-6 flex flex-col space-y-2">
                    <Link
                      role="menuitem"
                      to="/info/mutual-funds"
                      className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileInvestmentSubmenuOpen(false);
                        setMobileServicesOpen(false);
                        setMobileCalculatorOpen(false);
                        setMobileCareerOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      Mutual Funds
                    </Link>
                    <Link
                      role="menuitem"
                      to="/info/fixed-deposit"
                      className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileInvestmentSubmenuOpen(false);
                        setMobileServicesOpen(false);
                        setMobileCalculatorOpen(false);
                        setMobileCareerOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      Fixed Deposit
                    </Link>
                    <Link
                      role="menuitem"
                      to="/info/bonds"
                      className="px-4 text-finance-charcoal hover:bg-finance-cream rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileInvestmentSubmenuOpen(false);
                        setMobileServicesOpen(false);
                        setMobileCalculatorOpen(false);
                        setMobileCareerOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      Bonds
                    </Link>
                  </div>
                )}
                */}
              </div>
            )}

            <Link
              to="/investor-zone/auction-properties"
              className="px-4"
              onClick={() => {
                setIsOpen(false);
                setMobileCalculatorOpen(false);
                setMobileCareerOpen(false);
              }}
            >
              Auction Properties
            </Link>

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

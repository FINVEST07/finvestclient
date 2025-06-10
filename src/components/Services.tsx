"use client";

import React, { useState } from "react";
import { 
  BarChart4, 
  Shield, 
  Briefcase, 
  ArrowRight, 
  X, 
  Home,
  Building2,
  Factory,
  Heart,
  Users,
  Car,
  Plane,
  TrendingUp,
  PieChart,
  MapPin
} from "lucide-react";
import ToastContainerComponent from "./ToastContainerComponent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";

const bankData = {
  // Loans
  workingCapital: [
    { name: "State Bank of India", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", rate: "8.5% - 12%", features: ["Quick Processing", "Flexible Tenure", "Minimal Documentation"] },
    { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", rate: "9% - 13%", features: ["Digital Application", "Same Day Approval", "Collateral Free Options"] },
    { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", rate: "8.75% - 12.5%", features: ["24/7 Support", "Easy EMI", "Quick Disbursal"] },
    { name: "Axis Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Axis_Bank_logo.svg", rate: "9.25% - 13.5%", features: ["Instant Approval", "Flexible Repayment", "Low Processing Fee"] },
    { name: "Punjab National Bank", logo: "https://upload.wikimedia.org/wikipedia/en/4/4e/PNB_Logo.svg", rate: "8.25% - 11.5%", features: ["Government Backed", "Low Interest", "Easy Documentation"] }
  ],
  
  loanAgainstProperty: [
    { name: "State Bank of India", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", rate: "8.4% - 11%", features: ["Up to 75% LTV", "Long Tenure", "Competitive Rates"] },
    { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", rate: "8.75% - 11.5%", features: ["Quick Valuation", "Flexible Tenure", "Part Payment"] },
    { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", rate: "8.65% - 11.25%", features: ["Online Application", "Fast Processing", "High Loan Amount"] },
    { name: "Axis Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Axis_Bank_logo.svg", rate: "9% - 12%", features: ["Doorstep Service", "Minimal Documentation", "Quick Disbursal"] },
    { name: "Bank of Baroda", logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Bank_of_Baroda_logo.svg", rate: "8.5% - 10.75%", features: ["Low Processing Fee", "Flexible EMI", "Easy Approval"] }
  ],
  
  homeLoan: [
    { name: "State Bank of India", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", rate: "8.5% - 9.25%", features: ["Low Interest Rate", "Long Tenure up to 30 years", "Government Subsidies"] },
    { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", rate: "8.75% - 9.5%", features: ["Pre-approved Loans", "Balance Transfer", "Top-up Facility"] },
    { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", rate: "8.7% - 9.4%", features: ["Digital Processing", "Instant Approval", "Flexible EMI"] },
    { name: "LIC Housing Finance", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/LIC_Logo.svg", rate: "8.6% - 9.3%", features: ["Specialized Housing Finance", "Attractive Interest Rates", "Easy Processing"] },
    { name: "Axis Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Axis_Bank_logo.svg", rate: "8.8% - 9.6%", features: ["Quick Sanction", "Doorstep Service", "Online Tracking"] }
  ],

  // Insurance
  healthInsurance: [
    { name: "HDFC ERGO", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", coverage: "₹5L - ₹1Cr", features: ["Cashless Treatment", "Pre & Post Hospitalization", "Day Care Procedures"] },
    { name: "ICICI Lombard", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", coverage: "₹3L - ₹50L", features: ["Wellness Programs", "No Claim Bonus", "24x7 Customer Support"] },
    { name: "SBI General Insurance", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", coverage: "₹2L - ₹25L", features: ["Affordable Premiums", "Wide Network", "Easy Claims"] },
    { name: "Bajaj Allianz", logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Bajaj_Allianz_logo.svg", coverage: "₹4L - ₹75L", features: ["Comprehensive Coverage", "Health Check-ups", "Fast Claim Settlement"] },
    { name: "New India Assurance", logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/New_India_Assurance_Logo.svg", coverage: "₹1L - ₹20L", features: ["Government Backed", "Pan India Presence", "Low Premium"] }
  ],
  
  lifeInsurance: [
    { name: "LIC of India", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/LIC_Logo.svg", coverage: "₹5L - ₹5Cr", features: ["Trusted Brand", "Multiple Plan Options", "Tax Benefits"] },
    { name: "HDFC Life", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", coverage: "₹10L - ₹10Cr", features: ["Online Premium Payment", "Flexible Plans", "Quick Settlement"] },
    { name: "ICICI Prudential", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", coverage: "₹5L - ₹3Cr", features: ["Unit Linked Plans", "Term Insurance", "Child Plans"] },
    { name: "SBI Life", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", coverage: "₹1L - ₹2Cr", features: ["Affordable Premiums", "Multiple Options", "Easy Process"] },
    { name: "Max Life Insurance", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Max_Life_Insurance_Logo.svg", coverage: "₹25L - ₹5Cr", features: ["Comprehensive Coverage", "Health Riders", "Online Services"] }
  ],
  
  motorTravelProperty: [
    { name: "HDFC ERGO", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", coverage: "Comprehensive", features: ["Motor Insurance", "Travel Insurance", "Home Insurance"] },
    { name: "ICICI Lombard", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", coverage: "Multi-Product", features: ["Instant Policy", "Cashless Claims", "24x7 Support"] },
    { name: "Bajaj Allianz", logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Bajaj_Allianz_logo.svg", coverage: "All-in-One", features: ["Quick Renewal", "Add-on Covers", "Easy Claims"] },
    { name: "Tata AIG", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Tata_AIG_logo.svg", coverage: "Complete Protection", features: ["Competitive Premiums", "Wide Coverage", "Fast Processing"] },
    { name: "Oriental Insurance", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Oriental_Insurance_Logo.svg", coverage: "Traditional Coverage", features: ["Government Backed", "Reliable Service", "Pan India Network"] }
  ],

  // Investments
  mutualFunds: [
    { name: "SBI Mutual Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", aum: "₹7.2L Cr", features: ["Equity Funds", "Debt Funds", "Hybrid Funds"] },
    { name: "HDFC Mutual Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", aum: "₹4.8L Cr", features: ["Top Performer", "Diversified Portfolio", "Expert Management"] },
    { name: "ICICI Prudential MF", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", aum: "₹4.2L Cr", features: ["Technology Funds", "Index Funds", "SIP Options"] },
    { name: "Axis Mutual Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Axis_Bank_logo.svg", aum: "₹2.8L Cr", features: ["Growth Focused", "Sector Funds", "Goal Based Investing"] },
    { name: "UTI Mutual Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/UTI_Logo.svg", aum: "₹2.2L Cr", features: ["Pioneer in MF", "Balanced Approach", "Long Term Wealth"] }
  ],
  
  pmsAif: [
    { name: "HDFC Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", minInvestment: "₹50L", features: ["Portfolio Management", "Alternative Investments", "Personalized Service"] },
    { name: "ICICI Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", minInvestment: "₹25L", features: ["Research Backed", "Risk Management", "Tax Efficient"] },
    { name: "Axis Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Axis_Bank_logo.svg", minInvestment: "₹1Cr", features: ["High Net Worth", "Customized Solutions", "Expert Advisory"] },
    { name: "Kotak Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Kotak_Mahindra_Bank_logo.svg", minInvestment: "₹25L", features: ["Wealth Management", "Alternative Funds", "Premium Service"] },
    { name: "SBI Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", minInvestment: "₹50L", features: ["Institutional Quality", "Diversified Strategies", "Long Term Focus"] }
  ],
  
  realEstateInvestments: [
    { name: "HDFC Property Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", minInvestment: "₹1Cr", features: ["Commercial Properties", "REITs", "Property Development"] },
    { name: "ICICI Realty", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", minInvestment: "₹50L", features: ["Residential Projects", "Commercial Spaces", "Land Banking"] },
    { name: "SBI Realty", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", minInvestment: "₹25L", features: ["Government Backed", "Prime Locations", "Affordable Housing"] },
    { name: "Axis Realty Partners", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Axis_Bank_logo.svg", minInvestment: "₹2Cr", features: ["Premium Properties", "High Returns", "Professional Management"] },
    { name: "Kotak Realty Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Kotak_Mahindra_Bank_logo.svg", minInvestment: "₹1Cr", features: ["Diversified Portfolio", "Risk Mitigation", "Expert Selection"] }
  ]
};

const ServiceCard = ({ icon, title, description, onClick, isExpanded }) => (
  <div
    className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer ${
      isExpanded ? 'ring-2 ring-blue-500' : ''
    }`}
    onClick={onClick}
  >
    <div className="mb-4 bg-blue-900/5 w-12 h-12 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-3 font-playfair text-blue-900">
      {title}
    </h3>
    <p className="text-finance-slate mb-4 text-sm">{description}</p>
    <div className="inline-flex items-center text-blue-900 font-medium hover:text-blue-700 transition-colors">
      {isExpanded ? 'Hide Details' : 'View Banks'} <ArrowRight className="ml-1 h-4 w-4" />
    </div>
  </div>
);

const BankModal = ({ isOpen, onClose, title, banks, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-blue-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banks.map((bank, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <img 
                    src={bank.logo} 
                    alt={bank.name}
                    className="w-12 h-12 object-contain mr-3"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5z'/%3E%3Cpath d='M2 17l10 5 10-5'/%3E%3Cpath d='M2 12l10 5 10-5'/%3E%3C/svg%3E";
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{bank.name}</h3>
                    <p className="text-sm text-blue-600">
                      {bank.rate || bank.coverage || bank.aum || bank.minInvestment}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {bank.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <button className="mt-4 w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Services = ({ setLoginOpen }) => {
  const [modalData, setModalData] = useState({ isOpen: false, title: '', banks: [], type: '' });
  const emailcookie = Cookie.get("finvest");
  const navigate = useNavigate();

  const serviceclicked = (serviceType, title) => {
    if (!emailcookie) {
      toast("Please Register First");
      setLoginOpen(true);
      return;
    }

    setModalData({
      isOpen: true,
      title,
      banks: bankData[serviceType] || [],
      type: serviceType
    });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, title: '', banks: [], type: '' });
  };

  const services = [
    // Loans Row
    {
      icon: <Factory className="h-6 w-6 text-blue-900" />,
      title: "Working Capital",
      description: "Flexible financing solutions for your business operations and cash flow management.",
      serviceType: "workingCapital"
    },
    {
      icon: <Building2 className="h-6 w-6 text-blue-900" />,
      title: "Loan Against Property",
      description: "Leverage your property value for business expansion or personal needs.",
      serviceType: "loanAgainstProperty"
    },
    {
      icon: <Home className="h-6 w-6 text-blue-900" />,
      title: "Home Loan",
      description: "Make your dream home a reality with attractive interest rates and flexible tenure.",
      serviceType: "homeLoan"
    },
    // Insurance Row
    {
      icon: <Heart className="h-6 w-6 text-blue-900" />,
      title: "Health Insurance",
      description: "Comprehensive health coverage for you and your family's medical expenses.",
      serviceType: "healthInsurance"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-900" />,
      title: "Life Insurance",
      description: "Secure your family's financial future with term and endowment plans.",
      serviceType: "lifeInsurance"
    },
    {
      icon: <Car className="h-6 w-6 text-blue-900" />,
      title: "Motor, Travel & Property",
      description: "Complete protection for your vehicle, travel, and property insurance needs.",
      serviceType: "motorTravelProperty"
    },
    // Investment Row
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-900" />,
      title: "Mutual Funds",
      description: "Diversified investment options to grow your wealth through professional fund management.",
      serviceType: "mutualFunds"
    },
    {
      icon: <PieChart className="h-6 w-6 text-blue-900" />,
      title: "PMS/AIF",
      description: "Portfolio Management Services and Alternative Investment Funds for HNI clients.",
      serviceType: "pmsAif"
    },
    {
      icon: <MapPin className="h-6 w-6 text-blue-900" />,
      title: "Real Estate Investments",
      description: "Invest in prime real estate projects and REITs for long-term wealth creation.",
      serviceType: "realEstateInvestments"
    }
  ];

  return (
    <section
      id="services"
      className="section-padding bg-gradient-to-b from-white to-finance-cream/30"
    >
      <ToastContainerComponent />
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className="text-sm font-medium text-blue-900 bg-blue-200 py-1 px-3 rounded-full">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 font-playfair text-blue-900">
            Comprehensive Financial Solutions
          </h2>
          <p className="text-finance-slate text-lg">
            We offer a wide range of loans, insurance products & investment
            opportunities tailored to your specific needs and goals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-12">
          {/* Loans Section */}
          <div>
            <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">
              <Briefcase className="inline-block mr-2 h-6 w-6" />
              Loan Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 3).map((service, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                  <ServiceCard
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    onClick={() => serviceclicked(service.serviceType, service.title)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Insurance Section */}
          <div>
            <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">
              <Shield className="inline-block mr-2 h-6 w-6" />
              Insurance Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(3, 6).map((service, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                  <ServiceCard
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    onClick={() => serviceclicked(service.serviceType, service.title)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Investment Section */}
          <div>
            <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">
              <BarChart4 className="inline-block mr-2 h-6 w-6" />
              Investment Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(6, 9).map((service, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                  <ServiceCard
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    onClick={() => serviceclicked(service.serviceType, service.title)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bank Modal */}
      <BankModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        title={modalData.title}
        banks={modalData.banks}
        type={modalData.type}
      />
    </section>
  );
};

export default Services;
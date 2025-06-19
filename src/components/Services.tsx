// "use client";

// import React, { useState } from "react";
// import { 
//   BarChart4, 
//   Shield, 
//   Briefcase, 
//   ArrowRight, 
//   X, 
//   Home,
//   Building2,
//   Factory,
//   Heart,
//   Users,
//   Car,
//   Plane,
//   TrendingUp,
//   PieChart,
//   MapPin
// } from "lucide-react";
// import { Helmet } from 'react-helmet-async';
// import ToastContainerComponent from "./ToastContainerComponent";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";
// import Cookie from "js-cookie";

// const bankData = {
//   // Loans
//   workingCapital: [
//     { name: "State Bank of India", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", rate: "8.5% - 12%", features: ["Quick Processing", "Flexible Tenure", "Minimal Documentation"] },
//     { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", rate: "9% - 13%", features: ["Digital Application", "Same Day Approval", "Collateral Free Options"] },
//     { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", rate: "8.75% - 12.5%", features: ["24/7 Support", "Easy EMI", "Quick Disbursal"] },
//     { name: "Axis Bank", logo: "axis.png", rate: "9.25% - 13.5%", features: ["Instant Approval", "Flexible Repayment", "Low Processing Fee"] },
//     { name: "Punjab National Bank", logo: "pnj.png", rate: "8.25% - 11.5%", features: ["Government Backed", "Low Interest", "Easy Documentation"] }
//   ],
  
//   loanAgainstProperty: [
//     { name: "State Bank of India", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", rate: "8.4% - 11%", features: ["Up to 75% LTV", "Long Tenure", "Competitive Rates"] },
//     { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", rate: "8.75% - 11.5%", features: ["Quick Valuation", "Flexible Tenure", "Part Payment"] },
//     { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", rate: "8.65% - 11.25%", features: ["Online Application", "Fast Processing", "High Loan Amount"] },
//     { name: "Axis Bank", logo: "axis.png", rate: "9% - 12%", features: ["Doorstep Service", "Minimal Documentation", "Quick Disbursal"] },
//     { name: "Bank of Baroda", logo: "bob.png", rate: "8.5% - 10.75%", features: ["Low Processing Fee", "Flexible EMI", "Easy Approval"] }
//   ],
  
//   homeLoan: [
//     { name: "State Bank of India", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", rate: "8.5% - 9.25%", features: ["Low Interest Rate", "Long Tenure up to 30 years", "Government Subsidies"] },
//     { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", rate: "8.75% - 9.5%", features: ["Pre-approved Loans", "Balance Transfer", "Top-up Facility"] },
//     { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", rate: "8.7% - 9.4%", features: ["Digital Processing", "Instant Approval", "Flexible EMI"] },
//     { name: "LIC Housing Finance", logo: "LIC.png", rate: "8.6% - 9.3%", features: ["Specialized Housing Finance", "Attractive Interest Rates", "Easy Processing"] },
//     { name: "Axis Bank", logo: "axis.png", rate: "8.8% - 9.6%", features: ["Quick Sanction", "Doorstep Service", "Online Tracking"] }
//   ],

//   // Insurance
//   healthInsurance: [
//     { name: "HDFC ERGO", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", coverage: "₹5L - ₹1Cr", features: ["Cashless Treatment", "Pre & Post Hospitalization", "Day Care Procedures"] },
//     { name: "ICICI Lombard", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", coverage: "₹3L - ₹50L", features: ["Wellness Programs", "No Claim Bonus", "24x7 Customer Support"] },
//     { name: "SBI General Insurance", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", coverage: "₹2L - ₹25L", features: ["Affordable Premiums", "Wide Network", "Easy Claims"] },
//     { name: "Bajaj Allianz", logo: "bajaj.png", coverage: "₹4L - ₹75L", features: ["Comprehensive Coverage", "Health Check-ups", "Fast Claim Settlement"] },
//     { name: "New India Assurance", logo: "NIIL.png", coverage: "₹1L - ₹20L", features: ["Government Backed", "Pan India Presence", "Low Premium"] }
//   ],
  
//   lifeInsurance: [
//     { name: "LIC of India", logo: "LIC.png", coverage: "₹5L - ₹5Cr", features: ["Trusted Brand", "Multiple Plan Options", "Tax Benefits"] },
//     { name: "HDFC Life", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", coverage: "₹10L - ₹10Cr", features: ["Online Premium Payment", "Flexible Plans", "Quick Settlement"] },
//     { name: "ICICI Prudential", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", coverage: "₹5L - ₹3Cr", features: ["Unit Linked Plans", "Term Insurance", "Child Plans"] },
//     { name: "SBI Life", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", coverage: "₹1L - ₹2Cr", features: ["Affordable Premiums", "Multiple Options", "Easy Process"] },
//     { name: "Max Life Insurance", logo: "MLI.png", coverage: "₹25L - ₹5Cr", features: ["Comprehensive Coverage", "Health Riders", "Online Services"] }
//   ],
  
//   motorTravelProperty: [
//     { name: "HDFC ERGO", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", coverage: "Comprehensive", features: ["Motor Insurance", "Travel Insurance", "Home Insurance"] },
//     { name: "ICICI Lombard", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", coverage: "Multi-Product", features: ["Instant Policy", "Cashless Claims", "24x7 Support"] },
//     { name: "Bajaj Allianz", logo: "bajaj.png", coverage: "All-in-One", features: ["Quick Renewal", "Add-on Covers", "Easy Claims"] },
//     { name: "Tata AIG", logo: "TAG.png", coverage: "Complete Protection", features: ["Competitive Premiums", "Wide Coverage", "Fast Processing"] },
//     { name: "Oriental Insurance", logo: "OI.png", coverage: "Traditional Coverage", features: ["Government Backed", "Reliable Service", "Pan India Network"] }
//   ],

//   // Investments
//   mutualFunds: [
//     { name: "SBI Mutual Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", aum: "₹7.2L Cr", features: ["Equity Funds", "Debt Funds", "Hybrid Funds"] },
//     { name: "HDFC Mutual Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", aum: "₹4.8L Cr", features: ["Top Performer", "Diversified Portfolio", "Expert Management"] },
//     { name: "ICICI Prudential MF", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", aum: "₹4.2L Cr", features: ["Technology Funds", "Index Funds", "SIP Options"] },
//     { name: "Axis Mutual Fund", logo: "axis.png", aum: "₹2.8L Cr", features: ["Growth Focused", "Sector Funds", "Goal Based Investing"] },
//     { name: "UTI Mutual Fund", logo: "UTI.png", aum: "₹2.2L Cr", features: ["Pioneer in MF", "Balanced Approach", "Long Term Wealth"] }
//   ],
  
//   pmsAif: [
//     { name: "HDFC Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", minInvestment: "₹50L", features: ["Portfolio Management", "Alternative Investments", "Personalized Service"] },
//     { name: "ICICI Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", minInvestment: "₹25L", features: ["Research Backed", "Risk Management", "Tax Efficient"] },
//     { name: "Axis Securities", logo: "axis.png", minInvestment: "₹1Cr", features: ["High Net Worth", "Customized Solutions", "Expert Advisory"] },
//     { name: "Kotak Securities", logo: "KS.png", minInvestment: "₹25L", features: ["Wealth Management", "Alternative Funds", "Premium Service"] },
//     { name: "SBI Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", minInvestment: "₹50L", features: ["Institutional Quality", "Diversified Strategies", "Long Term Focus"] }
//   ],
  
//   realEstateInvestments: [
//     { name: "HDFC Property Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", minInvestment: "₹1Cr", features: ["Commercial Properties", "REITs", "Property Development"] },
//     { name: "ICICI Realty", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", minInvestment: "₹50L", features: ["Residential Projects", "Commercial Spaces", "Land Banking"] },
//     { name: "SBI Realty", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", minInvestment: "₹25L", features: ["Government Backed", "Prime Locations", "Affordable Housing"] },
//     { name: "Axis Realty Partners", logo: "axis.png", minInvestment: "₹2Cr", features: ["Premium Properties", "High Returns", "Professional Management"] },
//     { name: "Kotak Realty Fund", logo: "KL.png", minInvestment: "₹1Cr", features: ["Diversified Portfolio", "Risk Mitigation", "Expert Selection"] }
//   ]
// };

// const ServiceCard = ({ icon, title, description, onClick, isExpanded = false }) => (
//   <div
//     className={`group relative bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50 cursor-pointer overflow-hidden ${
//       isExpanded ? 'ring-2 ring-blue-600/30 shadow-blue-600/10' : ''
//     }`}
//     onClick={onClick}
//   >
//     {/* Animated background gradient */}
//     <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
//     {/* Decorative elements */}
//     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
    
//     <div className="relative z-10">
//       <div className="mb-6 bg-gradient-to-br from-blue-600/10 to-blue-500/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
//         <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700">
//           {React.cloneElement(icon, { className: "h-6 w-6 text-white" })}
//         </div>
//       </div>
      
//       <h3 className="text-xl font-bold mb-4 text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
//         {title}
//       </h3>
      
//       <p className="text-gray-600 mb-6 text-sm leading-relaxed">{description}</p>
      
//       <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-all duration-300 group-hover:translate-x-1">
//         {isExpanded ? 'Hide Details' : 'View Options'} 
//         <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
//       </div>
//     </div>
//   </div>
// );

// const BankModal = ({ isOpen, onClose, title, banks, type, setLoginOpen }) => {
//   const emailcookie = Cookie.get("finvest");
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   if (!isOpen) return null;

//   const applyClick = () =>{
//     if (!emailcookie) {
//       alert("Please register or Login first to access our services")
//       setLoginOpen(true);
//       return;
//     } 

//     navigate("/customerdashboard");
//   }

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
//       <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-100/50 animate-scale-in">
//         <div className="p-8 border-b border-blue-100/50 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
//           <div>
//             <h2 className="text-3xl font-bold text-blue-900 mb-2">{title}</h2>
//             <p className="text-gray-600">Choose from our trusted partners</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-3 hover:bg-blue-50 rounded-full transition-all duration-300 hover:rotate-90 group"
//           >
//             <X className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
//           </button>
//         </div>
        
//         <div className="p-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//             {banks.map((bank, index) => (
//               <div 
//                 key={index} 
//                 className="group border border-blue-100/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/30"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div className="flex items-center mb-6">
//                   <div className="relative w-14 h-14 mr-4">
//                     <img 
//                       src={bank.logo} 
//                       alt={bank.name}
//                       className="w-full h-full object-contain rounded-xl shadow-sm"
//                       onError={(e) => {
//                         const target = e.target as HTMLImageElement;
//                         target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5z'/%3E%3Cpath d='M2 17l10 5 10-5'/%3E%3Cpath d='M2 12 l10 5 10-5'/%3E%3C/svg%3E";
//                       }}
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-bold text-blue-900 text-lg group-hover:text-blue-800 transition-colors">
//                       {bank.name}
//                     </h3>
//                     <p className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block mt-1">
//                       {bank.rate || bank.coverage || bank.aum || bank.minInvestment}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="space-y-3 mb-6">
//                   {bank.features.map((feature, idx) => (
//                     <div key={idx} className="flex items-start text-sm text-gray-600">
//                       <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
//                       <span className="leading-relaxed">{feature}</span>
//                     </div>
//                   ))}
//                 </div>
                
//                 <button onClick={applyClick} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 group-hover:scale-105">
//                   Apply Now
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Services = ({ setLoginOpen }) => {
//   const [modalData, setModalData] = useState({ isOpen: false, title: '', banks: [], type: '' });
  

//   const serviceclicked = (serviceType, title) => {
    

//     setModalData({
//       isOpen: true,
//       title,
//       banks: bankData[serviceType] || [],
//       type: serviceType
//     });
//   };

//   const closeModal = () => {
//     setModalData({ isOpen: false, title: '', banks: [], type: '' });
//   };

//   const services = [
//     // Loans Row
//     {
//       icon: <Factory className="h-6 w-6" />,
//       title: "Working Capital",
//       description: "Flexible financing solutions for your business operations and cash flow management with competitive rates.",
//       serviceType: "workingCapital"
//     },
//     {
//       icon: <Building2 className="h-6 w-6" />,
//       title: "Loan Against Property",
//       description: "Leverage your property value for business expansion or personal needs with attractive terms.",
//       serviceType: "loanAgainstProperty"
//     },
//     {
//       icon: <Home className="h-6 w-6" />,
//       title: "Home Loan",
//       description: "Make your dream home a reality with attractive interest rates and flexible tenure options.",
//       serviceType: "homeLoan"
//     },
//     // Insurance Row
//     {
//       icon: <Heart className="h-6 w-6" />,
//       title: "Health Insurance",
//       description: "Comprehensive health coverage for you and your family's medical expenses with cashless treatment.",
//       serviceType: "healthInsurance"
//     },
//     {
//       icon: <Users className="h-6 w-6" />,
//       title: "Life Insurance",
//       description: "Secure your family's financial future with term and endowment plans from trusted insurers.",
//       serviceType: "lifeInsurance"
//     },
//     {
//       icon: <Car className="h-6 w-6" />,
//       title: "Motor, Travel & Property",
//       description: "Complete protection for your vehicle, travel, and property insurance needs in one place.",
//       serviceType: "motorTravelProperty"
//     },
//     // Investment Row
//     {
//       icon: <TrendingUp className="h-6 w-6" />,
//       title: "Mutual Funds",
//       description: "Diversified investment options to grow your wealth through professional fund management expertise.",
//       serviceType: "mutualFunds"
//     },
//     {
//       icon: <PieChart className="h-6 w-6" />,
//       title: "PMS/AIF",
//       description: "Portfolio Management Services and Alternative Investment Funds for high net worth individuals.",
//       serviceType: "pmsAif"
//     },
//     {
//       icon: <MapPin className="h-6 w-6" />,
//       title: "Real Estate Investments",
//       description: "Invest in prime real estate projects and REITs for long-term wealth creation opportunities.",
//       serviceType: "realEstateInvestments"
//     }
//   ];

//   const sectionCategories = [
//     {
//       title: "Loan Products",
//       icon: <Briefcase className="h-7 w-7" />,
//       services: services.slice(0, 3),
//       gradient: "from-blue-50 to-blue-100/50",
//       iconBg: "from-blue-600 to-blue-700"
//     },
//     {
//       title: "Insurance Products", 
//       icon: <Shield className="h-7 w-7" />,
//       services: services.slice(3, 6),
//       gradient: "from-blue-50 to-blue-100/50",
//       iconBg: "from-blue-600 to-blue-700"
//     },
//     {
//       title: "Investment Products",
//       icon: <BarChart4 className="h-7 w-7" />,
//       services: services.slice(6, 9),
//       gradient: "from-blue-50 to-blue-100/50", 
//       iconBg: "from-blue-600 to-blue-700"
//     }
//   ];

//   return (
//     <section
//       id="services"
//       className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 relative overflow-hidden"
//     >
//       <Helmet>
//         <title>Services - RISEHIGH FINCON Financial Solutions</title>
//         <meta
//           name="description"
//           content="Explore RISEHIGH FINCON's financial services, including home loans, health insurance, mutual funds, and real estate investments with trusted partners."
//         />
//       </Helmet>
//       {/* Background decorative elements */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.1),transparent)] pointer-events-none"></div>
      
//       <ToastContainerComponent />
//       <div className="container mx-auto px-6 relative z-10">
//         {/* Header Section */}
//         <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
//           <div className="inline-flex items-center justify-center mb-6">
//             <span className="text-sm font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-blue-50 py-2 px-6 rounded-full border border-blue-200">
//               Our Services
//             </span>
//           </div>
//           <h2 className="text-4xl md:text-5xl font-bold mb-8 text-blue-900 bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
//             Comprehensive Financial Solutions
//           </h2>
//           <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
//             We offer a wide range of loans, insurance products & investment
//             opportunities tailored to your specific needs and goals with trusted partners.
//           </p>
//         </div>

//         {/* Services Sections */}
//         <div className="space-y-20">
//           {sectionCategories.map((category, categoryIndex) => (
//             <div key={categoryIndex} className="animate-slide-up" style={{ animationDelay: `${categoryIndex * 200}ms` }}>
//               {/* Section Header */}
//               <div className="text-center mb-12">
//                 <div className="inline-flex items-center justify-center mb-4">
//                   <div className={`p-3 rounded-2xl bg-gradient-to-r ${category.iconBg} shadow-lg`}>
//                     {React.cloneElement(category.icon, { className: "h-7 w-7 text-white" })}
//                   </div>
//                 </div>
//                 <h3 className="text-3xl font-bold text-blue-900 mb-3">
//                   {category.title}
//                 </h3>
//                 <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-500 mx-auto rounded-full"></div>
//               </div>

//               {/* Services Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//                 {category.services.map((service, index) => (
//                   <div 
//                     key={index} 
//                     className="animate-slide-up" 
//                     style={{ animationDelay: `${(categoryIndex * 3 + index + 1) * 150}ms` }}
//                   >
//                     <ServiceCard
//                       icon={service.icon}
//                       title={service.title}
//                       description={service.description}
//                       onClick={() => serviceclicked(service.serviceType, service.title)}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Bank Modal */}
//       <BankModal
//         isOpen={modalData.isOpen}
//         onClose={closeModal}
//         title={modalData.title}
//         banks={modalData.banks}
//         type={modalData.type}
//         setLoginOpen={setLoginOpen}
//       />
//     </section>
//   );
// };

// export default Services;



import React, { useState, ReactNode } from "react";
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
  MapPin,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import ToastContainerComponent from "./ToastContainerComponent";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";

// Hard-coded bankData (same as your original)
const bankData = {
  workingCapital: [
    { name: "State Bank of India", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", rate: "8.5% - 12%", features: ["Quick Processing", "Flexible Tenure", "Minimal Documentation"] },
    { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", rate: "9% - 13%", features: ["Digital Application", "Same Day Approval", "Collateral Free Options"] },
    { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", rate: "8.75% - 12.5%", features: ["24/7 Support", "Easy EMI", "Quick Disbursal"] },
    { name: "Axis Bank", logo: "axis.png", rate: "9.25% - 13.5%", features: ["Instant Approval", "Flexible Repayment", "Low Processing Fee"] },
    { name: "Punjab National Bank", logo: "pnj.png", rate: "8.25% - 11.5%", features: ["Government Backed", "Low Interest", "Easy Documentation"] }
  ],
  loanAgainstProperty: [
    { name: "State Bank of India", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", rate: "8.4% - 11%", features: ["Up to 75% LTV", "Long Tenure", "Competitive Rates"] },
    { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", rate: "8.75% - 11.5%", features: ["Quick Valuation", "Flexible Tenure", "Part Payment"] },
    { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", rate: "8.65% - 11.25%", features: ["Online Application", "Fast Processing", "High Loan Amount"] },
    { name: "Axis Bank", logo: "axis.png", rate: "9% - 12%", features: ["Doorstep Service", "Minimal Documentation", "Quick Disbursal"] },
    { name: "Bank of Baroda", logo: "bob.png", rate: "8.5% - 10.75%", features: ["Low Processing Fee", "Flexible EMI", "Easy Approval"] }
  ],
  homeLoan: [
    { name: "State Bank of India", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", rate: "8.5% - 9.25%", features: ["Low Interest Rate", "Long Tenure up to 30 years", "Government Subsidies"] },
    { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", rate: "8.75% - 9.5%", features: ["Pre-approved Loans", "Balance Transfer", "Top-up Facility"] },
    { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", rate: "8.7% - 9.4%", features: ["Digital Processing", "Instant Approval", "Flexible EMI"] },
    { name: "LIC Housing Finance", logo: "LIC.png", rate: "8.6% - 9.3%", features: ["Specialized Housing Finance", "Attractive Interest Rates", "Easy Processing"] },
    { name: "Axis Bank", logo: "axis.png", rate: "8.8% - 9.6%", features: ["Quick Sanction", "Doorstep Service", "Online Tracking"] }
  ],
  healthInsurance: [
    { name: "HDFC ERGO", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", coverage: "₹5L - ₹1Cr", features: ["Cashless Treatment", "Pre & Post Hospitalization", "Day Care Procedures"] },
    { name: "ICICI Lombard", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", coverage: "₹3L - ₹50L", features: ["Wellness Programs", "No Claim Bonus", "24x7 Customer Support"] },
    { name: "SBI General Insurance", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", coverage: "₹2L - ₹25L", features: ["Affordable Premiums", "Wide Network", "Easy Claims"] },
    { name: "Bajaj Allianz", logo: "bajaj.png", coverage: "₹4L - ₹75L", features: ["Comprehensive Coverage", "Health Check-ups", "Fast Claim Settlement"] },
    { name: "New India Assurance", logo: "NIIL.png", coverage: "₹1L - ₹20L", features: ["Government Backed", "Pan India Presence", "Low Premium"] }
  ],
  lifeInsurance: [
    { name: "LIC of India", logo: "LIC.png", coverage: "₹5L - ₹5Cr", features: ["Trusted Brand", "Multiple Plan Options", "Tax Benefits"] },
    { name: "HDFC Life", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", coverage: "₹10L - ₹10Cr", features: ["Online Premium Payment", "Flexible Plans", "Quick Settlement"] },
    { name: "ICICI Prudential", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", coverage: "₹5L - ₹3Cr", features: ["Unit Linked Plans", "Term Insurance", "Child Plans"] },
    { name: "SBI Life", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", coverage: "₹1L - ₹2Cr", features: ["Affordable Premiums", "Multiple Options", "Easy Process"] },
    { name: "Max Life Insurance", logo: "MLI.png", coverage: "₹25L - ₹5Cr", features: ["Comprehensive Coverage", "Health Riders", "Online Services"] }
  ],
  motorTravelProperty: [
    { name: "HDFC ERGO", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", coverage: "Comprehensive", features: ["Motor Insurance", "Travel Insurance", "Home Insurance"] },
    { name: "ICICI Lombard", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", coverage: "Multi-Product", features: ["Instant Policy", "Cashless Claims", "24x7 Support"] },
    { name: "Bajaj Allianz", logo: "bajaj.png", coverage: "All-in-One", features: ["Quick Renewal", "Add-on Covers", "Easy Claims"] },
    { name: "Tata AIG", logo: "TAG.png", coverage: "Complete Protection", features: ["Competitive Premiums", "Wide Coverage", "Fast Processing"] },
    { name: "Oriental Insurance", logo: "OI.png", coverage: "Traditional Coverage", features: ["Government Backed", "Reliable Service", "Pan India Network"] }
  ],
  mutualFunds: [
    { name: "SBI Mutual Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", aum: "₹7.2L Cr", features: ["Equity Funds", "Debt Funds", "Hybrid Funds"] },
    { name: "HDFC Mutual Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", aum: "₹4.8L Cr", features: ["Top Performer", "Diversified Portfolio", "Expert Management"] },
    { name: "ICICI Prudential MF", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", aum: "₹4.2L Cr", features: ["Technology Funds", "Index Funds", "SIP Options"] },
    { name: "Axis Mutual Fund", logo: "axis.png", aum: "₹2.8L Cr", features: ["Growth Focused", "Sector Funds", "Goal Based Investing"] },
    { name: "UTI Mutual Fund", logo: "UTI.png", aum: "₹2.2L Cr", features: ["Pioneer in MF", "Balanced Approach", "Long Term Wealth"] }
  ],
  pmsAif: [
    { name: "HDFC Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", minInvestment: "₹50L", features: ["Portfolio Management", "Alternative Investments", "Personalized Service"] },
    { name: "ICICI Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", minInvestment: "₹25L", features: ["Research Backed", "Risk Management", "Tax Efficient"] },
    { name: "Axis Securities", logo: "axis.png", minInvestment: "₹1Cr", features: ["High Net Worth", "Customized Solutions", "Expert Advisory"] },
    { name: "Kotak Securities", logo: "KS.png", minInvestment: "₹25L", features: ["Wealth Management", "Alternative Funds", "Premium Service"] },
    { name: "SBI Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", minInvestment: "₹50L", features: ["Institutional Quality", "Diversified Strategies", "Long Term Focus"] }
  ],
  realEstateInvestments: [
    { name: "HDFC Property Fund", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg", minInvestment: "₹1Cr", features: ["Commercial Properties", "REITs", "Property Development"] },
    { name: "ICICI Realty", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg", minInvestment: "₹50L", features: ["Residential Projects", "Commercial Spaces", "Land Banking"] },
    { name: "SBI Realty", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg", minInvestment: "₹25L", features: ["Government Backed", "Prime Locations", "Affordable Housing"] },
    { name: "Axis Realty Partners", logo: "axis.png", minInvestment: "₹2Cr", features: ["Premium Properties", "High Returns", "Professional Management"] },
    { name: "Kotak Realty Fund", logo: "KL.png", minInvestment: "₹1Cr", features: ["Diversified Portfolio", "Risk Mitigation", "Expert Selection"] }
  ]
};

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  isExpanded?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, onClick, isExpanded = false }) => (
  <div
    className={`group relative bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50 cursor-pointer overflow-hidden ${
      isExpanded ? 'ring-2 ring-blue-600/30 shadow-blue-600/10' : ''
    }`}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
    <div className="relative z-10">
      <div className="mb-6 bg-gradient-to-br from-blue-600/10 to-blue-500/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700">
          {React.cloneElement(icon, { className: "h-6 w-6 text-white" })}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4 text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">{description}</p>
      <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-all duration-300 group-hover:translate-x-1">
        {isExpanded ? 'Hide Details' : 'View Options'} 
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </div>
  </div>
);

interface BankModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  banks: Array<{
    name: string;
    logo: string;
    rate?: string;
    coverage?: string;
    aum?: string;
    minInvestment?: string;
    features: string[];
  }>;
  type: string;
  setLoginOpen: (value: boolean) => void;
}

const BankModal: React.FC<BankModalProps> = ({ isOpen, onClose, title, banks, type, setLoginOpen }) => {
  const emailcookie = Cookie.get("finvest");
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!isOpen) return null;

  const applyClick = () => {
    if (!emailcookie) {
      alert("Please register or Login first to access our services");
      setLoginOpen(true);
      return;
    }
    navigate("/customerdashboard");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-100/50 animate-scale-in">
        <div className="p-8 border-b border-blue-100/50 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2">{title}</h2>
            <p className="text-gray-600">Choose from our trusted partners</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-blue-50 rounded-full transition-all duration-300 hover:rotate-90 group"
          >
            <X className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {banks.map((bank, index) => (
              <div 
                key={index} 
                className="group border border-blue-100/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-6">
                  <div className="relative w-14 h-14 mr-4">
                    <img 
                      src={bank.logo} 
                      alt={`${bank.name} logo for RISEHIGH FINCON financial services`}
                      className="w-full h-full object-contain rounded-xl shadow-sm"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5z'/%3E%3Cpath d='M2 17l10 5 10-5'/%3E%3Cpath d='M2 12 l10 5 10-5'/%3E%3C/svg%3E";
                        target.alt = "Placeholder logo for financial services";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-900 text-lg group-hover:text-blue-800 transition-colors">
                      {bank.name}
                    </h3>
                    <p className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block mt-1">
                      {bank.rate || bank.coverage || bank.aum || bank.minInvestment}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {bank.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
                <button onClick={applyClick} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 group-hover:scale-105">
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

interface Service {
  icon: ReactNode;
  title: string;
  description: string;
  serviceType: string;
}

interface SectionCategory {
  title: string;
  icon: ReactNode;
  services: Service[];
  gradient: string;
  iconBg: string;
}

interface ServicesProps {
  setLoginOpen: (value: boolean) => void;
  title: string;
}

const Services: React.FC<ServicesProps> = ({ setLoginOpen, title }) => {
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    banks: Array<{
      name: string;
      logo: string;
      rate?: string;
      coverage?: string;
      aum?: string;
      minInvestment?: string;
      features: string[];
    }>;
    type: string;
  }>({
    isOpen: false,
    title: "",
    banks: [],
    type: "",
  });

  const serviceclicked = (serviceType: string, title: string) => {
    setModalData({
      isOpen: true,
      title,
      banks: bankData[serviceType as keyof typeof bankData] || [],
      type: serviceType,
    });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, title: "", banks: [], type: "" });
  };

  const services: Service[] = [
    {
      icon: <Factory className="h-6 w-6" />,
      title: "Working Capital",
      description: "Flexible financing solutions for your business operations and cash flow management with competitive rates.",
      serviceType: "workingCapital",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Loan Against Property",
      description: "Leverage your property value for business expansion or personal needs with attractive terms.",
      serviceType: "loanAgainstProperty",
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: "Home Loan",
      description: "Make your dream home a reality with attractive interest rates and flexible tenure options.",
      serviceType: "homeLoan",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Health Insurance",
      description: "Comprehensive health coverage for you and your family's medical expenses with cashless treatment.",
      serviceType: "healthInsurance",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Life Insurance",
      description: "Secure your family's financial future with term and endowment plans from trusted insurers.",
      serviceType: "lifeInsurance",
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: "Motor, Travel & Property",
      description: "Complete protection for your vehicle, travel, and property insurance needs in one place.",
      serviceType: "motorTravelProperty",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Mutual Funds",
      description: "Diversified investment options to grow your wealth through professional fund management expertise.",
      serviceType: "mutualFunds",
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "PMS/AIF",
      description: "Portfolio Management Services and Alternative Investment Funds for high net worth individuals.",
      serviceType: "pmsAif",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Real Estate Investments",
      description: "Invest in prime real estate projects and REITs for long-term wealth creation opportunities.",
      serviceType: "realEstateInvestments",
    },
  ];

  const sectionCategories: SectionCategory[] = [
    {
      title: "Loan Products",
      icon: <Briefcase className="h-7 w-7" />,
      services: services.slice(0, 3),
      gradient: "from-blue-50 to-blue-100/50",
      iconBg: "from-blue-600 to-blue-700",
    },
    {
      title: "Insurance Products",
      icon: <Shield className="h-7 w-7" />,
      services: services.slice(3, 6),
      gradient: "from-blue-50 to-blue-100/50",
      iconBg: "from-blue-600 to-blue-700",
    },
    {
      title: "Investment Products",
      icon: <BarChart4 className="h-7 w-7" />,
      services: services.slice(6, 9),
      gradient: "from-blue-50 to-blue-100/50",
      iconBg: "from-blue-600 to-blue-700",
    },
  ];

  return (
    <section
      id="services"
      className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 relative overflow-hidden"
    >
      <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content="Explore RISEHIGH FINCON's financial services, including home loans, health insurance, mutual funds, and real estate investments with trusted partners."
        />
      </Helmet>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.1),transparent)] pointer-events-none"></div>
      <ToastContainerComponent />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <span className="text-sm font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-blue-50 py-2 px-6 rounded-full border border-blue-200">
              Our Services
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-blue-900 bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
            Comprehensive Financial Solutions
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            We offer a wide range of loans, insurance products & investment
            opportunities tailored to your specific needs and goals with trusted partners.
          </p>
        </div>
        <div className="space-y-20">
          {sectionCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="animate-slide-up" style={{ animationDelay: `${categoryIndex * 200}ms` }}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${category.iconBg} shadow-lg`}>
                    {React.cloneElement(category.icon, { className: "h-7 w-7 text-white" })}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-blue-900 mb-3">
                  {category.title}
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-500 mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {category.services.map((service, index) => (
                  <div 
                    key={index} 
                    className="animate-slide-up" 
                    style={{ animationDelay: `${(categoryIndex * 3 + index + 1) * 150}ms` }}
                  >
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
          ))}
        </div>
      </div>
      <BankModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        title={modalData.title}
        banks={modalData.banks}
        type={modalData.type}
        setLoginOpen={setLoginOpen}
      />
    </section>
  );
};

export async function getStaticProps() {
  return {
    props: {
      title: "Services - RISEHIGH FINCON Financial Solutions",
    },
  };
}

export default Services;
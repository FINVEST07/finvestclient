import React from "react";
import { BarChart4, Shield, Briefcase, ArrowRight } from "lucide-react";
import ToastContainerComponent from "./ToastContainerComponent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";


const ServiceCard = ({
  icon,
  title,
  description,
  delay = "0",
  serviceclicked
}) => (
  <div
    className="bg-white min-h-[50vh] rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    style={{ animationDelay: delay }}
    onClick={serviceclicked}
  >
    <div className="mb-4 bg-blue-900/5 w-12 h-12 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 font-playfair text-blue-900">
      {title}
    </h3>
    <p className="text-finance-slate mb-4">{description}</p>
    <a
      href="#"
      className="inline-flex items-center text-blue-900 font-medium hover:text-blue-700 transition-colors"
    >
      Apply Now <ArrowRight className="ml-1 h-4 w-4" />
    </a>
  </div>
);

const Services = ({ setLoginOpen }) => {
  const emailcookie = Cookie.get("finvest");

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
            We offer a wide range of loans & Insurance products & investment
            opportunities tailored to your specific needs and goals.
          </p>
        </div>

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <ServiceCard
              icon={<Briefcase className="h-6 w-6 text-blue-900" />}
              title="Loans (Home, Mortgage, Working Capital, SME and MSME Finance, OD/CC, Construction Finance, Personal and more..."
              description="Flexible financing solutions to help your business thrive, from startups to established companies."
              serviceclicked = {serviceclicked}
              
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <ServiceCard
              icon={<Shield className="h-6 w-6 text-blue-900" />}
              title="Insurance (Health, Life, Travel, Motor,Home and more.."
              description="Comprehensive retirement strategies to ensure financial security and peace of mind in your golden years."
              serviceclicked = {serviceclicked}
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <ServiceCard
              icon={<BarChart4 className="h-6 w-6 text-blue-900" />}
              title="Investment Opportunity"
              description="Personalized investment strategies designed to grow your wealth and secure your financial future."
              serviceclicked = {serviceclicked}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

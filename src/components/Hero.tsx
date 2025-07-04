import { ChevronRight, DollarSign, Shield, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";

const Hero = () => {
  return (
    <>
      <Helmet>
        <title>FINVESTCORP - Trusted Financial Advisors for Loans & Investments</title>
        <meta
          name="description"
          content="FINVESTCORP offers expert financial advice on loans, insurance, and investments. Trusted by 1,500+ clients across India since 2013."
        />
      </Helmet>
      <section className=" xl:mt-[36vh] mt-[28vh] md:pt-4 pb-16 2xl:pb-20 relative 2xl:mt-[25vh] overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-blue-50 opacity-50 -z-10"></div>
        <div className="absolute top-1/3 -right-64 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl -z-10"></div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left column - Text content */}
            <div className="lg:w-1/2 space-y-6 animate-fade-in">
              <div className="inline-block mt-2 md:mt-0 ">
                <span className="bg-blue-200 text-blue-900 text-sm font-medium py-1 px-3 rounded-full border border-blue-900">
                  Financial Solutions & Freedom Starts Here
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight text-blue-900">
                Smart Finance and Investments, <br />
                <span className="relative">
                  Secure Future
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-blue-200 -z-10"></span>
                </span>
              </h1>

              <p className="text-finance-slate text-lg md:text-xl max-w-xl">
                Personalized investment strategies and loan solutions to help
                you achieve your financial goals with confidence and peace of
                mind.
              </p>

              <div className="pt-6 flex flex-col sm:flex-row gap-6 sm:gap-12 text-finance-slate">
                <div className="flex items-center">
                  <div className="mr-3 bg-blue-900/5 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-900" />
                  </div>
                  <span>12+ Years Experience</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 bg-blue-900/5 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-blue-900" />
                  </div>
                  <span>Certified Advisors</span>
                </div>
              </div>
            </div>

            {/* Right column - Image and floating cards */}
            <div className="lg:w-1/2 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
                <img
                  src="/heroimg.jpg"
                  alt="Financial advisor helping client"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>

              {/* Floating card 2 */}
              <div
                className={cn(
                  "absolute -bottom-5 -right-5 glass-card p-4 shadow-lg animate-float",
                  "animation-delay-1000 rounded-lg md:block hidden"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        98%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Client Satisfaction
                    </p>
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
                      <div className="w-[98%] h-full bg-blue-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;

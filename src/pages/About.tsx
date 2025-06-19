// import { Helmet } from "react-helmet-async"
// import { LineChart, ArrowUpRight } from "lucide-react";

// const About = () => (
//   <section id="about" className="section-padding bg-white">
//     <div className="container-custom">
//       <Helmet>
//         <title>About RISEHIGH FINCON - Trusted Financial Advisors</title>
//         <meta
//           name="description"
//           content="Learn about RISEHIGH FINCON, trusted financial advisors since 2013, offering personalized loan solutions, insurance advisory, and investment opportunities."
//         />
//       </Helmet>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//         <div className="order-2 lg:order-1 animate-fade-in-left">
//           <span className="text-sm font-medium text-blue-900 bg-blue-100 py-1 px-4 rounded-full">
//             About Us
//           </span>
//           <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 font-playfair text-blue-900">
//             Trusted Financial Advisors
//             <br /> Since 2013
//           </h2>

//           <p className="text-finance-slate mb-4">
//             RISEHIGH FINCON CONSULTANCY PVT. LTD was founded with a simple
//             mission: to provide personalized, transparent financial guidance
//             that helps our clients achieve their goals. For over many years,
//             we've been dedicated to creating tailored loan solutions & insurance
//             advisory and best investment opportunity that work for real people.
//           </p>

//           <p className="text-finance-slate mb-6">
//             With a team of certified financial advisors and loan specialists, we
//             combine deep industry knowledge with a client-first approach. We
//             believe in building long-term relationships based on trust,
//             integrity, and results.
//           </p>

//           <div className="grid grid-cols-2 gap-6 mt-8">
//             <div className="flex flex-col">
//               <span className="text-3xl font-bold text-blue-900">12+</span>
//               <span className="text-finance-slate">Years Experience</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-3xl font-bold text-blue-900">1,500+</span>
//               <span className="text-finance-slate">Clients Served</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-3xl font-bold text-blue-900">98%</span>
//               <span className="text-finance-slate">Client Satisfaction</span>
//             </div>
//           </div>
//         </div>

//         <div className="order-1 lg:order-2 relative animate-fade-in-right">
//           <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden">
//             <img
//               src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
//               alt="Financial advisors team"
//               className="w-full h-full object-cover"
//             />
//           </div>

//           <div className="absolute -bottom-6 -left-6 p-4 bg-blue-900 text-white rounded-lg shadow-xl max-w-xs hidden lg:block">
//             <div className="flex items-start mb-2">
//               <LineChart className="h-5 w-5 mr-2 text-blue-200" />
//               <h3 className="text-lg font-medium">Why Choose Us</h3>
//             </div>
//             <ul className="text-sm text-white/80 space-y-2">
//               <li className="flex items-start">
//                 <ArrowUpRight className="h-4 w-4 mr-1 text-blue-200 shrink-0 mt-0.5" />
//                 <span>Personalized investment strategies</span>
//               </li>
//               <li className="flex items-start">
//                 <ArrowUpRight className="h-4 w-4 mr-1 text-blue-200 shrink-0 mt-0.5" />
//                 <span>Transparent fee structure</span>
//               </li>
//               <li className="flex items-start">
//                 <ArrowUpRight className="h-4 w-4 mr-1 text-blue-200 shrink-0 mt-0.5" />
//                 <span>Certified financial advisors</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   </section>
// );

// export default About;



import { Helmet } from "react-helmet-async";
import { LineChart, ArrowUpRight } from "lucide-react";

const About = ({ title }) => (
  <section id="about" className="section-padding bg-white">
    <div className="container-custom">
      <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content="Learn about RISEHIGH FINCON, trusted financial advisors since 2013, offering personalized loan solutions, insurance advisory, and investment opportunities."
        />
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 animate-fade-in-left">
          <span className="text-sm font-medium text-blue-900 bg-blue-100 py-1 px-4 rounded-full">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 font-playfair text-blue-900">
            Trusted Financial Advisors
            <br /> Since 2013
          </h2>
          <p className="text-finance-slate mb-4">
            RISEHIGH FINCON CONSULTANCY PVT. LTD was founded with a simple
            mission: to provide personalized, transparent financial guidance
            that helps our clients achieve their goals. For over many years,
            we've been dedicated to creating tailored loan solutions & insurance
            advisory and best investment opportunity that work for real people.
          </p>
          <p className="text-finance-slate mb-6">
            With a team of certified financial advisors and loan specialists, we
            combine deep industry knowledge with a client-first approach. We
            believe in building long-term relationships based on trust,
            integrity, and results.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-blue-900">12+</span>
              <span className="text-finance-slate">Years Experience</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-blue-900">1,500+</span>
              <span className="text-finance-slate">Clients Served</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-blue-900">98%</span>
              <span className="text-finance-slate">Client Satisfaction</span>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative animate-fade-in-right">
          <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
              alt="Financial advisors team"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 p-4 bg-blue-900 text-white rounded-lg shadow-xl max-w-xs hidden lg:block">
            <div className="flex items-start mb-2">
              <LineChart className="h-5 w-5 mr-2 text-blue-200" />
              <h3 className="text-lg font-medium">Why Choose Us</h3>
            </div>
            <ul className="text-sm text-white/80 space-y-2">
              <li className="flex items-start">
                <ArrowUpRight className="h-4 w-4 mr-1 text-blue-200 shrink-0 mt-0.5" />
                <span>Personalized investment strategies</span>
              </li>
              <li className="flex items-start">
                <ArrowUpRight className="h-4 w-4 mr-1 text-blue-200 shrink-0 mt-0.5" />
                <span>Transparent fee structure</span>
              </li>
              <li className="flex items-start">
                <ArrowUpRight className="h-4 w-4 mr-1 text-blue-200 shrink-0 mt-0.5" />
                <span>Certified financial advisors</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export async function getStaticProps() {
  return {
    props: {
      title: "About RISEHIGH FINCON - Trusted Financial Advisors",
    },
  };
}

export default About;
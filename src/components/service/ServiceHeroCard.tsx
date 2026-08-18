import type { Info } from "@/data/serviceInfoData";

const ServiceHeroCard = ({ info }: { info: Info }) => (
  <div className="relative bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100/50 overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
    <div className="p-8 md:p-12">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-semibold mb-6 border border-blue-100">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        Our Expertise
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        {info.title}
      </h1>
      <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
        {info.description}
      </p>
    </div>
  </div>
);

export default ServiceHeroCard;

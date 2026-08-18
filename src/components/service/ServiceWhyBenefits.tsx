import { CheckCircle2 } from "lucide-react";
import type { Info } from "@/data/serviceInfoData";

const ServiceWhyBenefits = ({ info }: { info: Info }) => (
  <div className="grid md:grid-cols-2 gap-6">
    <div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-100/50 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-blue-600" />
        </div>
        Why It Matters
      </h2>
      <ul className="space-y-4">
        {info.importance.map((i, idx) => (
          <li key={idx} className="flex items-start gap-3 text-gray-600">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="leading-relaxed">{i}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-100/50 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>
        Key Benefits
      </h2>
      <ul className="space-y-4">
        {info.benefits.map((b, idx) => (
          <li key={idx} className="flex items-start gap-3 text-gray-600">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
            <span className="leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ServiceWhyBenefits;

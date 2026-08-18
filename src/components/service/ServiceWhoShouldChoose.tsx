import { CheckCircle2 } from "lucide-react";

const whoShouldItems = [
  "First-time applicants seeking clarity.",
  "Borrowers comparing multiple lenders.",
  "Need help with complex paperwork.",
  "Optimizing long-term costs.",
];

const ServiceWhoShouldChoose = () => (
  <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
    <h2 className="text-2xl font-bold mb-6">Who Should Choose This</h2>
    <div className="grid sm:grid-cols-2 gap-4">
      {whoShouldItems.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
          <CheckCircle2 className="h-5 w-5 text-blue-400" />
          <span className="text-gray-200 font-medium">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ServiceWhoShouldChoose;

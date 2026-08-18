import { Info } from "@/data/serviceInfoData";

interface ServiceProcessCardsProps {
  info: Info;
}

const defaultWhatWeDoItems = [
  "Understand your goals, eligibility, and constraints.",
  "Shortlist suitable banks/NBFCs and products.",
  "Guide documentation and application filing.",
  "Track the case till sanction and disbursal.",
];

const defaultHowItWorksItems = [
  "Initial consultation and profiling.",
  "Option comparison with pros/cons.",
  "Application submission and verification.",
  "Sanction, documentation, and disbursal.",
];

const ServiceProcessCards = ({ info }: ServiceProcessCardsProps) => {
  const whatWeDoItems = info.whatWeDo || defaultWhatWeDoItems;
  const howItWorksItems = info.howItWorks || defaultHowItWorksItems;

  return (
    <>
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-white h-full">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          </div>
          What We Do
        </h2>
        <ul className="space-y-4">
          {whatWeDoItems.map((text, idx) => (
            <li key={idx} className="flex items-start gap-3 text-blue-100">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-300 flex-shrink-0" />
              <span className="leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white h-full">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
          How It Works
        </h2>
        <ul className="space-y-4">
          {howItWorksItems.map((text, idx) => (
            <li key={idx} className="flex items-start gap-3 text-green-100">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-green-300 flex-shrink-0" />
              <span className="leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ServiceProcessCards;

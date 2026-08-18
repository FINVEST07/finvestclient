interface ServiceFAQsProps {
  faqs?: { q: string; a: string }[];
}

const defaultFaqs = [
  {
    q: "How long does the process take?",
    a: "Timelines vary by lender and profile. With complete documents, most cases move from application to sanction within a few days to a couple of weeks.",
  },
  {
    q: "Do you work with multiple banks/NBFCs?",
    a: "Yes. We compare across 20+ lenders to help you choose the option that best fits your requirements and eligibility.",
  },
  {
    q: "Can I restructure later or transfer my loan?",
    a: "We can guide on balance transfers, top-ups, and restructuring options based on market conditions and policy.",
  },
];

const ServiceFAQs = ({ faqs: customFaqs }: ServiceFAQsProps) => {
  const displayFaqs = customFaqs || defaultFaqs;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-100/50 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {displayFaqs.map((faq, idx) => (
          <div key={idx} className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
            <p className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">?</span>
              {faq.q}
            </p>
            <p className="text-gray-600 leading-relaxed pl-8">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceFAQs;

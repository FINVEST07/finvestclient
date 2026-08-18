import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import { ArrowLeft } from "lucide-react";

import { infos } from "@/data/serviceInfoData";
import ServiceHeroCard from "@/components/service/ServiceHeroCard";
import ServiceWhyBenefits from "@/components/service/ServiceWhyBenefits";
import ServiceProcessCards from "@/components/service/ServiceProcessCards";
import ServiceFAQs from "@/components/service/ServiceFAQs";
import ServiceEnquiryForm from "@/components/service/ServiceEnquiryForm";
import ServiceDirectContact from "@/components/service/ServiceDirectContact";

const ServiceInfo = () => {
  const { slug } = useParams();
  const info = useMemo(() => (slug ? infos[slug] : undefined), [slug]);

  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/info/${slug}` : `/info/${slug}`;
  const metaTitle = info ? `${info.title} - FINVESTCORP` : "Service - FINVESTCORP";
  const metaDesc = info ? `${info.title}: ${info.description}` : "Financial services information.";

  return (
    <section className="pt-6 pb-16 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 min-h-screen">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: info?.title || 'Service',
            description: metaDesc,
            author: { '@type': 'Organization', name: 'FINVESTCORP' },
            publisher: { '@type': 'Organization', name: 'FINVESTCORP', logo: { '@type': 'ImageObject', url: '/fin_lo.png' } },
            mainEntityOfPage: canonicalUrl,
          })}
        </script>
      </Helmet>
      <ToastContainerComponent />
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {!info ? (
          <div className="text-center text-gray-500 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Page Not Found</h2>
            <p>We couldn't find the service you're looking for.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link to="/" className="hover:text-blue-900 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/services" className="hover:text-blue-900 transition-colors">Services</Link>
              <span>/</span>
              <span className="text-blue-900 font-medium">{info.title}</span>
            </nav>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Left Column: Content */}
              <div className="lg:col-span-8 space-y-8">
                <ServiceHeroCard info={info} />
                <ServiceWhyBenefits info={info} />
              </div>

              {/* Right Column: Enquiry Form */}
              <div className="lg:col-span-4">
                <ServiceEnquiryForm />
              </div>
            </div>

            {/* Same Y-Axis Row for Process Boxes and Contact Card */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              <ServiceProcessCards info={info} />
              <ServiceDirectContact />
            </div>

            <div className="mt-8">
              <ServiceFAQs faqs={info.faqs} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceInfo;

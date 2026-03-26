import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import PropertyCard from "@/components/PropertyCard";

interface PropertyPhoto {
  url: string;
}

interface PropertyItem {
  _id: string;
  propertyName: string;
  area: string;
  type: "Auction" | "Distress";
  propertyType: string;
  price: number;
  description: string;
  photos?: PropertyPhoto[];
}

const InvestorPropertiesListing = ({
  type,
  title,
}: {
  type: "Auction" | "Distress";
  title: string;
}) => {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}properties`, {
        params: { type },
      });
      setProperties(res.data?.payload || []);
    } catch (e) {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [type]);

  const pageDescription = useMemo(
    () => `${title} on FINVESTCORP with location, type, pricing, and complete details.`,
    [title]
  );

  return (
    <section className="pt-6 pb-16 mx-auto bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>{title} - FINVESTCORP</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <ToastContainerComponent />
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <a href="/" className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-sm font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-blue-50 py-2 px-6 rounded-full border border-blue-200">Investor Zone</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-blue-900">{title}</h1>
          <p className="text-gray-600 mt-3">Explore curated property opportunities with transparent details.</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"></span>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No {type.toLowerCase()} properties to show</div>
        ) : (
          <div className="space-y-3 md:mx-12">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default InvestorPropertiesListing;

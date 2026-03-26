import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ToastContainerComponent from "@/components/ToastContainerComponent";

interface PropertyPhoto {
  url: string;
}

interface PropertyItem {
  _id: string;
  propertyId: string;
  propertyName: string;
  area: string;
  type: "Auction" | "Distress";
  floor: string;
  propertyType: string;
  address: string;
  phoneNumber: string;
  price: number;
  description: string;
  photos?: PropertyPhoto[];
}

const normalizeQuillHtml = (html: string) => {
  if (!html) return "";
  let out = html;

  const emptyParaRegex = "<p>\\s*(?:<br\\s*\\/?\\s*>|&nbsp;|\\s)*\\s*<\\/p>";
  out = out.replace(new RegExp(`^(\\s*${emptyParaRegex}\\s*)+`, "i"), "");
  out = out.replace(new RegExp(`(\\s*${emptyParaRegex}\\s*)+$`, "i"), "");
  out = out.replace(new RegExp(`(\\s*${emptyParaRegex}\\s*){2,}`, "gi"), "<p><br /></p>");

  return out;
};

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const PropertyDetail = () => {
  const { propertyId, type } = useParams();
  const [property, setProperty] = useState<PropertyItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadProperty = async () => {
    if (!propertyId) return;

    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}properties/${propertyId}`);
      setProperty(res.data?.payload || null);
    } catch (e) {
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const normalizedType = (type || "").toLowerCase();
  const isAuctionPath = normalizedType === "auction";
  const listingTitle = isAuctionPath ? "Auction Properties" : "Distress Properties";
  const listingPath = isAuctionPath
    ? "/investor-zone/auction-properties"
    : "/investor-zone/distress-properties";

  const description = useMemo(() => {
    if (!property) return "Investor zone property details on FINVESTCORP.";
    return stripHtml(property.description || "").slice(0, 170);
  }, [property]);

  const formattedPrice = useMemo(() => {
    if (!property) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(property.price) || 0);
  }, [property]);

  const canonicalUrl = typeof window !== "undefined"
    ? `${window.location.origin}/investor-zone/${normalizedType}/${propertyId || ""}`
    : `/investor-zone/${normalizedType}/${propertyId || ""}`;

  return (
    <section className="pt-6 pb-16 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>{property ? `${property.propertyName} - FINVESTCORP` : "Property - FINVESTCORP"}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={property ? property.propertyName : "Property"} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        {property?.photos?.[0]?.url && <meta property="og:image" content={property.photos[0].url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={property ? property.propertyName : "Property"} />
        <meta name="twitter:description" content={description} />
        {property?.photos?.[0]?.url && <meta name="twitter:image" content={property.photos[0].url} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Investor Zone", item: "/investor-zone/auction-properties" },
              { "@type": "ListItem", position: 3, name: listingTitle, item: listingPath },
              { "@type": "ListItem", position: 4, name: property?.propertyName || "Property", item: canonicalUrl }
            ]
          })}
        </script>
      </Helmet>
      <ToastContainerComponent />

      <div className="container mx-auto px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link to={listingPath} className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to {listingTitle}
          </Link>
        </div>

        <div className="mb-5 text-sm text-blue-800 font-medium">
          <Link to="/" className="hover:text-blue-900">Home</Link>
          <span className="mx-2">&gt;</span>
          <span>Investor Zone</span>
          <span className="mx-2">&gt;</span>
          <Link to={listingPath} className="hover:text-blue-900">{listingTitle}</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-blue-900">{property?.propertyName || "Property"}</span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"></span>
          </div>
        ) : !property ? (
          <div className="text-center text-gray-500 py-20">Property not found</div>
        ) : (
          <article className="bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden">
            {property.photos?.length ? (
              <div className="w-full bg-blue-50 p-3 md:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {property.photos.slice(0, 5).map((photo, idx) => (
                    <div
                      key={`${property._id}-${idx}`}
                      className="rounded-xl overflow-hidden border border-blue-100 bg-white h-72 sm:h-80 lg:h-[420px]"
                    >
                      <img
                        src={photo.url}
                        alt={`${property.propertyName}-${idx + 1}`}
                        className="w-full h-full object-contain block bg-slate-50"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="p-6 md:p-10">
              <h1 className="text-2xl md:text-6xl font-bold text-blue-900 mb-4 leading-snug">{property.propertyName}</h1>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">Property Details</h2>
                <div className="h-[2px] w-full bg-blue-200 mb-6" />

                <div className="grid md:grid-cols-2 gap-4 text-slate-800">
                  <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Listing For:</span>
                    <span>{property.type || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Property Type:</span>
                    <span>{property.propertyType || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Society/Building:</span>
                    <span>{property.propertyName || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Floor:</span>
                    <span>{property.floor || "-"}</span>
                  </div>

                  {/* <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Property ID:</span>
                    <span>{property.propertyId || "-"}</span>
                  </div> */}

                  {/* <div className="rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Location:</span>
                    <span>{property.area || "-"}</span>
                  </div> */}

                  <div className="md:col-span-2 rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Address:</span>
                    <span>{property.address || "-"}</span>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-gradient-to-r from-blue-900 to-blue-800 p-5 md:p-6 border border-blue-700">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-3xl bg-white/10 border border-blue-200/30 px-6 py-7 text-center text-white">
                      <p className="text-lg font-semibold uppercase tracking-wide">Price</p>
                      <p className="mt-2 text-4xl font-bold">{formattedPrice}</p>
                    </div>

                    <div className="rounded-3xl bg-white/10 border border-blue-200/30 px-6 py-7 text-center text-white">
                      <p className="text-lg font-semibold uppercase tracking-wide">Area</p>
                      <p className="mt-2 text-4xl font-bold">{property.area || "-"}</p>
                    </div>
                  </div>
                </div>
              </section>

              <div
                className="prose prose-blue max-w-none text-gray-800 break-words prose-a:text-blue-700 prose-a:underline hover:prose-a:text-blue-900 prose-ol:list-decimal prose-ul:list-disc prose-li:my-0 prose-p:my-1"
                dangerouslySetInnerHTML={{ __html: normalizeQuillHtml(property.description || "") }}
              />
            </div>
          </article>
        )}
      </div>
    </section>
  );
};

export default PropertyDetail;

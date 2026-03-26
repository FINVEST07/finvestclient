import { Link } from "react-router-dom";

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

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const normalizeDescription = (html: string) => {
  return stripHtml(html)
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
};

const PropertyCard = ({ property }: { property: PropertyItem }) => {
  const thumbnail = property.photos?.[0]?.url || "";
  const cleanDescription = normalizeDescription(property.description || "");
  const shortDescription = cleanDescription.length > 150 ? `${cleanDescription.slice(0, 150)}...` : cleanDescription;
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(property.price) || 0);

  return (
    <article className="group relative isolate bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-slate-300">
      {/* <div className="pointer-events-none absolute inset-0">
        <img
          src="/cardbg1.svg"
          alt=""
          className="absolute -top-35 -right-40 h-28 w-28 md:h-28 md:w-28 opacity-10 property-bg-float-slow"
          aria-hidden="true"
        />
        <img
          src="/cardbg2.png"
          alt=""
          className="absolute -bottom-18 right-[26%] h-16 w-16 md:h-20 md:w-20 opacity-15 property-bg-float-fast"
          aria-hidden="true"
        />
      </div> */}
      <div className="flex flex-col md:flex-row">
        <div className="relative z-10 p-3.5 md:p-4 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {property.type}
            </span>
            <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              {property.propertyType}
            </span>
            <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {property.area}
            </span>
          </div>

          <h2 className="text-base md:text-lg font-bold text-slate-900 mb-1 line-clamp-1">{property.propertyName}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-sm mb-2">
            <p className="text-slate-600 line-clamp-1">
              <span className="font-semibold text-slate-800">Area:</span> {property.area}
            </p>
            <p className="text-slate-600 line-clamp-1">
              <span className="font-semibold text-slate-800">Type:</span> {property.type}
            </p>
            <p className="text-slate-600 line-clamp-1">
              <span className="font-semibold text-slate-800">Property Type:</span> {property.propertyType}
            </p>
            <p className="font-bold text-slate-900 line-clamp-1">
              <span className="font-semibold text-slate-800">Price:</span> {formattedPrice}
            </p>
          </div>

          <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2 whitespace-pre-line">
            {shortDescription}
          </p>

          <div className="mt-2.5 pt-2.5 border-t border-slate-100">
            <Link
              to={`/investor-zone/${property.type.toLowerCase()}/${property._id}`}
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-900 hover:text-blue-800"
            >
              View Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>

        <div className="relative z-10 overflow-hidden md:w-[240px] md:min-w-[240px] h-44 md:h-auto bg-slate-100 border-t md:border-t-0 md:border-l border-slate-200">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={property.propertyName}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-slate-500 p-6 text-sm">No Image</div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;

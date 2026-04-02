import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Lock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import { toast } from "react-toastify";
import FavouriteHeartButton from "@/components/FavouriteHeartButton";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import { fetchFavourites, getLoggedInEmail, toggleFavourite } from "@/lib/favourites";

interface PropertyPhoto {
  url: string;
}

interface PropertyItem {
  _id: string;
  propertyId: string;
  createdAt?: string;
  headline: string;
  propertyOrSocietyName: string;
  area: string;
  type: "Auction" | "Distress";
  bhk: string;
  floor: string;
  propertyType: string;
  offerPrice: number;
  estimatedMarketValue: number;
  location: string;
  district: string;
  possession: "Physical" | "Symbolic" | string;
  status: "Available" | "Sold Out" | string;
  emdDate?: string;
  eoiDate?: string;
  flatNo?: string;
  fullAddress?: string;
  bankName?: string;
  contactPerson?: string;
  contactNumber?: string;
  pdfDocument?: {
    url?: string;
    original_filename?: string;
  } | string | null;
  photos?: PropertyPhoto[];
}

const listingTypeLabel: Record<PropertyItem["type"], string> = {
  Auction: "Auction",
  Distress: "Alternate Investment",
};

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatPropertyDate = (iso?: string) => {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const derivePostedDate = (property: PropertyItem | null) => {
  if (!property) return "-";
  if (property.createdAt) return formatPropertyDate(property.createdAt);
  if (property._id?.length >= 8) {
    const seconds = parseInt(property._id.slice(0, 8), 16);
    if (Number.isFinite(seconds)) {
      return formatPropertyDate(new Date(seconds * 1000).toISOString());
    }
  }
  return "-";
};

const LockedRow = ({ label }: { label: string }) => (
  <div className="rounded-xl bg-white px-5 py-4 border border-blue-100 flex items-center justify-between gap-2">
    <span className="font-semibold text-blue-900">{label}</span>
    <span className="inline-flex items-center gap-2 text-slate-500">
      <Lock className="w-4 h-4" />
      <span className="blur-sm select-none">Confidential</span>
    </span>
  </div>
);

const PropertyDetail = () => {
  const { propertyId, type } = useParams();
  const [property, setProperty] = useState<PropertyItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadedImageKeys, setLoadedImageKeys] = useState<Set<string>>(new Set());
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [togglingFavourite, setTogglingFavourite] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [confirmingRemoval, setConfirmingRemoval] = useState<boolean>(false);
  const isLoggedIn = Boolean(getLoggedInEmail());

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

  useEffect(() => {
    setLoadedImageKeys(new Set());
  }, [property?._id]);

  useEffect(() => {
    if (!isLoggedIn || !property?._id) return;

    const loadFavourites = async () => {
      try {
        const payload = await fetchFavourites();
        const isFav = (payload.favourites || []).some(
          (fav) => fav.type === "property" && String(fav.id) === String(property._id)
        );
        setIsFavourite(isFav);
      } catch (error) {
        setIsFavourite(false);
      }
    };

    loadFavourites();
  }, [isLoggedIn, property?._id]);

  const executeFavouriteToggle = async () => {
    if (!isLoggedIn || !property?._id || togglingFavourite) return;

    const wasFavourite = isFavourite;
    setIsFavourite(!wasFavourite);
    setTogglingFavourite(true);

    try {
      await toggleFavourite(String(property._id), "property");
    } catch (error: any) {
      setIsFavourite(wasFavourite);
      toast.error(error?.response?.data?.message || "Unable to update favourite");
    } finally {
      setTogglingFavourite(false);
    }
  };

  const handleFavouriteToggle = async () => {
    if (!isLoggedIn || !property?._id || togglingFavourite) return;

    if (isFavourite) {
      setIsConfirmOpen(true);
      return;
    }

    await executeFavouriteToggle();
  };

  const handleConfirmRemoval = async () => {
    if (confirmingRemoval || togglingFavourite) return;

    try {
      setConfirmingRemoval(true);
      await executeFavouriteToggle();
      setIsConfirmOpen(false);
    } finally {
      setConfirmingRemoval(false);
    }
  };

  const normalizedType = (type || "").toLowerCase();
  const isAuctionPath = normalizedType === "auction";
  const listingTitle = isAuctionPath ? "Auction Properties" : "Alternate Investment";
  const listingPath = isAuctionPath
    ? "/investor-zone/auction-properties"
    : "/investor-zone/alternate-investment";

  const description = useMemo(() => {
    if (!property) return "Investor zone property details on FINVESTCORP.";
    return `${property.headline || "Property"} in ${property.location || ""}, ${property.district || ""}`.trim();
  }, [property]);

  const canonicalUrl = typeof window !== "undefined"
    ? `${window.location.origin}/investor-zone/${normalizedType}/${propertyId || ""}`
    : `/investor-zone/${normalizedType}/${propertyId || ""}`;

  const visiblePhotos = (property?.photos || []).slice(0, 4);
  const hasPropertyDocument = Boolean(
    property?.pdfDocument &&
      (typeof property?.pdfDocument === "string" ||
        (typeof property?.pdfDocument === "object" &&
          (property?.pdfDocument?.url || property?.pdfDocument?.original_filename)))
  );
  const propertyDocumentUrl =
    property?._id && hasPropertyDocument
      ? `${import.meta.env.VITE_API_URI}properties/${property._id}/document`
      : "";

  return (
    <section className="pt-6 pb-16 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>{property ? `${property.headline || "Property"} - FINVESTCORP` : "Property - FINVESTCORP"}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={property ? property.headline || "Property" : "Property"} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        {property?.photos?.[0]?.url && <meta property="og:image" content={property.photos[0].url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={property ? property.headline || "Property" : "Property"} />
        <meta name="twitter:description" content={description} />
        {property?.photos?.[0]?.url && <meta name="twitter:image" content={property.photos[0].url} />}
      </Helmet>
      <ToastContainerComponent />

      <div className="container mx-auto px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link to={listingPath} className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to {listingTitle}
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"></span>
          </div>
        ) : !property ? (
          <div className="text-center text-gray-500 py-20">Property not found</div>
        ) : (
          <article className="bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden">
            <div className="w-full bg-blue-50 p-3 md:p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {visiblePhotos.length > 0 ? (
                  visiblePhotos.map((photo, idx) => {
                    const imageKey = `${property._id}-${idx}`;
                    const isLoaded = loadedImageKeys.has(imageKey);

                    return (
                      <div
                        key={imageKey}
                        className="group aspect-square rounded-[10px] overflow-hidden border border-blue-100 bg-slate-100 relative flex items-center justify-center"
                      >
                        {!isLoaded ? (
                          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />
                        ) : null}

                        <img
                          src={photo.url}
                          alt={`${property.headline || "property"}-${idx + 1}`}
                          className={`w-full h-full object-cover transition-all duration-300 ease-out ${
                            isLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
                          }`}
                          loading="lazy"
                          onLoad={() => {
                            setLoadedImageKeys((prev) => {
                              const next = new Set(prev);
                              next.add(imageKey);
                              return next;
                            });
                          }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full aspect-square rounded-[10px] border border-blue-100 bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
                    No images available
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl md:text-5xl font-bold text-blue-900 leading-snug">{property.headline || property.propertyOrSocietyName || "Property"}</h1>
                {isLoggedIn ? (
                  <FavouriteHeartButton
                    isFavourite={isFavourite}
                    disabled={togglingFavourite}
                    onToggle={handleFavouriteToggle}
                  />
                ) : null}
              </div>

              <section className="mb-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">Basic Information</h2>
                <div className="h-[2px] w-full bg-blue-200 mb-6" />

                <div className="grid md:grid-cols-2 gap-4 text-slate-800">
                  <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Headline:</span>
                    <span>{property.headline || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Property Type:</span>
                    <span>{property.propertyType || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Area:</span>
                    <span>{property.area || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">BHK:</span>
                    <span>{property.bhk || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Offer Price:</span>
                    <span>{formatCurrency(property.offerPrice)}</span>
                  </div>

                  <div className="rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Est. Market Value:</span>
                    <span>{formatCurrency(property.estimatedMarketValue)}</span>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Location:</span>
                    <span>{property.location || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">District:</span>
                    <span>{property.district || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Possession:</span>
                    <span>{property.possession || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Status:</span>
                    <span>{property.status || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                    <span className="font-semibold text-blue-900 min-w-[160px]">{property.type === "Auction" ? "EMD Date:" : "EOI Date:"}</span>
                    <span>{formatPropertyDate(property.type === "Auction" ? property.emdDate : property.eoiDate)}</span>
                  </div>

                  <div className="rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Listing:</span>
                    <span>{listingTypeLabel[property.type] || property.type || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Posted On:</span>
                    <span>{derivePostedDate(property)}</span>
                  </div>
                </div>
                <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
                  <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5" /> Locked Information
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">Unlock full property details after enquiry</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <LockedRow label="Flat No" />
                    <LockedRow label="Property / Society Name" />
                    <LockedRow label="Floor" />
                    <LockedRow label="Full Address" />
                    <LockedRow label="Bank Name" />
                    <LockedRow label="Contact Person" />
                    <LockedRow label="Contact No" />
                  </div>
                </div>

                {propertyDocumentUrl ? (
                  <div className="mt-8 rounded-2xl border border-blue-200 bg-white p-5">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Property Document</h3>
                    <div className="w-full max-w-[250px] h-[250px] relative rounded-xl overflow-hidden bg-[#f5f5f5] border border-blue-200">
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500">
                        <Lock className="w-10 h-10" />
                        <span className="text-xs font-medium">Document is locked</span>
                      </div>
                      <div className="absolute bottom-0 w-full bg-black/60 text-white text-center px-2 py-2 text-sm">
                        Unlock via enquiry
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/contact?propertyId=${property._id}&listing=${property.type}`}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-900 text-white px-6 py-3 font-semibold hover:bg-blue-800 transition-colors"
                  >
                    Get Details / Site Inspection Enquiry
                  </Link>
                </div>
              </section>
            </div>
          </article>
        )}
      </div>

      <ConfirmActionModal
        open={isConfirmOpen}
        title="Remove from favourites?"
        description="This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={confirmingRemoval}
        onCancel={() => {
          if (confirmingRemoval) return;
          setIsConfirmOpen(false);
        }}
        onConfirm={handleConfirmRemoval}
      />
    </section>
  );
};

export default PropertyDetail;

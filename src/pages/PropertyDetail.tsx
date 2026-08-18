import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Lock, Crown, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import { toast } from "react-toastify";
import FavouriteHeartButton from "@/components/FavouriteHeartButton";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import {
  FAVOURITE_COMPLETED_EVENT,
  ensureAuthenticatedForFavourite,
  fetchFavourites,
  getLoggedInEmail,
  toggleFavourite,
} from "@/lib/favourites";
import { openLoginModal } from "@/lib/loginModal";

interface PropertyPhoto {
  url: string;
}

const getPhotoUrl = (photo: unknown) => {
  if (typeof photo === "string") return photo.trim();
  if (photo && typeof photo === "object") {
    const candidate = (photo as { url?: string; secure_url?: string }).url ||
      (photo as { url?: string; secure_url?: string }).secure_url ||
      "";
    return String(candidate).trim();
  }
  return "";
};

interface PropertyItem {
  _id: string;
  propertyId: string;
  createdAt?: string;
  headline: string;
  propertyOrSocietyName: string;
  area: string;
  type: "Auction" | "Distress" | "New" | "Resale";
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
  inspectionDateTime?: string;
  highlights?: string;
  pdfDocument?: {
    url?: string;
    original_filename?: string;
  } | string | null;
  photos?: PropertyPhoto[];
}

const listingTypeLabel: Record<PropertyItem["type"], string> = {
  Auction: "Auction",
  Distress: "Alternate Investment",
  New: "New / Resale",
  Resale: "New / Resale",
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

const getStatusLabel = (property: PropertyItem | null) => {
  const rawStatus = String(property?.status || "").trim();
  const normalizedStatus = rawStatus.toLowerCase();

  if (
    property?.type === "Distress" &&
    (normalizedStatus === "sold out" || normalizedStatus === "soldout")
  ) {
    return "Fulfilled";
  }

  return rawStatus || "-";
};

const isEmphasizedAvailability = (property: PropertyItem | null, statusLabel: string) => {
  const normalizedStatus = String(statusLabel || "").trim().toLowerCase();

  return (
    (property?.type === "Auction" && normalizedStatus === "sold out") ||
    (property?.type === "Distress" && normalizedStatus === "fulfilled")
  );
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

const formatDisplayValue = (label: string, value: string) => {
  if (!value) return "-";
  if (label.toLowerCase().includes("date") || label.toLowerCase().includes("time")) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
  return value;
};

const UnlockedRow = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-white px-5 py-4 border border-blue-100 flex items-center justify-between gap-2">
    <span className="font-semibold text-blue-900">{label}</span>
    <span className="text-slate-800 text-sm text-right">{formatDisplayValue(label, value)}</span>
  </div>
);

const PropertyDetail = () => {
  const { propertyId, type } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadedImageKeys, setLoadedImageKeys] = useState<Set<string>>(new Set());
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [togglingFavourite, setTogglingFavourite] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [confirmingRemoval, setConfirmingRemoval] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [premiumProducts, setPremiumProducts] = useState<string[]>([]);
  const [docLoading, setDocLoading] = useState<boolean>(false);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isLoggedIn = Boolean(getLoggedInEmail());

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleNext = () => {
    if (!property?.photos) return;
    setCurrentIndex((i) => (i + 1) % property.photos!.length);
  };

  const handlePrev = () => {
    if (!property?.photos) return;
    setCurrentIndex((i) => (i - 1 + property.photos!.length) % property.photos!.length);
  };

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
    const email = getLoggedInEmail();
    if (!email) {
      setIsPremium(false);
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URI}payments/premium-status`, {
        headers: { "x-user-email": email },
        withCredentials: true,
      })
      .then((res) => {
        const products = res.data?.premiumProducts || [];
        setPremiumProducts(products);
        setIsPremium(Boolean(res.data?.premium));
      })
      .catch(() => {
        setPremiumProducts([]);
        setIsPremium(false);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    setLoadedImageKeys(new Set());
  }, [property?._id]);

  useEffect(() => {
    const onFavouriteCompleted = (event: Event) => {
      const detail = (event as CustomEvent<{ itemId?: string; itemType?: string }>).detail;
      if (detail?.itemType !== "property" || !detail.itemId) return;
      if (!property?._id || String(property._id) !== String(detail.itemId)) return;

      setIsFavourite(true);
    };

    window.addEventListener(FAVOURITE_COMPLETED_EVENT, onFavouriteCompleted);
    return () => {
      window.removeEventListener(FAVOURITE_COMPLETED_EVENT, onFavouriteCompleted);
    };
  }, [property?._id]);

  useEffect(() => {
    if (!isLoggedIn || !property?._id) {
      setIsFavourite(false);
      return;
    }

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
    if (!property?._id || togglingFavourite) return;
    if (!ensureAuthenticatedForFavourite({ itemId: String(property._id), itemType: "property" })) return;

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

  useEffect(() => {
    if (!lightboxOpen || !property?.photos?.length) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, property?.photos?.length]);

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

  const visiblePhotos = (property?.photos || [])
    .map((photo) => ({ url: getPhotoUrl(photo) }))
    .filter((photo) => Boolean(photo.url))
    .slice(0, 4);
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

  const propertyProduct = useMemo(() => {
    if (!property) return "";
    if (property.type === "Auction") return "auction";
    if (property.type === "Distress") return "alternate-investment";
    if (property.type === "New" || property.type === "Resale") return "new-resale";
    return "";
  }, [property]);

  const hasProductAccess = useMemo(() => {
    if (!propertyProduct) return isPremium;
    return premiumProducts.some((p) => p === propertyProduct || p === "all");
  }, [premiumProducts, propertyProduct, isPremium]);

  useEffect(() => {
    if (hasProductAccess && propertyDocumentUrl) {
      setDocLoading(true);
    }
  }, [hasProductAccess, propertyDocumentUrl]);

  const statusLabel = getStatusLabel(property);
  const shouldEmphasizeStatus = isEmphasizedAvailability(property, statusLabel);

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
                      <button
                        key={imageKey}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setLightboxOpen(true);
                        }}
                        className="group aspect-square rounded-[10px] overflow-hidden border border-blue-100 bg-slate-100 relative flex items-center justify-center cursor-zoom-in"
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
                          onError={(event) => {
                            const target = event.currentTarget;
                            if (target.dataset.fallbackApplied === "true") return;
                            target.dataset.fallbackApplied = "true";
                            target.src = "/placeholder.svg";
                          }}
                          onLoad={() => {
                            setLoadedImageKeys((prev) => {
                              const next = new Set(prev);
                              next.add(imageKey);
                              return next;
                            });
                          }}
                        />
                      </button>
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
                <FavouriteHeartButton
                  isFavourite={isFavourite}
                  disabled={togglingFavourite}
                  onToggle={handleFavouriteToggle}
                />
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
                    <span className="font-semibold text-blue-900 min-w-[160px]">Configuration:</span>
                    <span>{property.bhk || "-"}</span>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                    <span className="font-semibold text-blue-900 min-w-[160px]">{property.type === "Distress" ? "Fund Required:" : "Offer Price:"}</span>
                    <span>{formatCurrency(property.offerPrice)}</span>
                  </div>

                  <div className="rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">{property.type === "Distress" ? "Collateral Value:" : "Est. Market Value:"}</span>
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

                  {!(property.type === "New" || property.type === "Resale") && (
                    <div className="rounded-xl bg-gradient-to-r from-blue-100/70 to-blue-50 px-5 py-4 flex items-center gap-3 border border-blue-200">
                      <span className="font-semibold text-blue-900 min-w-[160px]">Possession:</span>
                      <span>{property.possession || "-"}</span>
                    </div>
                  )}

                  <div className="rounded-xl bg-white px-5 py-4 flex items-center gap-3 border border-blue-100">
                    <span className="font-semibold text-blue-900 min-w-[160px]">Status:</span>
                    <span
                      className={shouldEmphasizeStatus ? "text-red-700 font-bold italic" : ""}
                    >
                      {statusLabel}
                    </span>
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

                {property.highlights && property.highlights.trim() ? (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {property.highlights
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-800">
                            <span className="text-blue-600 font-bold mt-0.5">•</span>
                            <span>{line}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                    <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                      {hasProductAccess ? <Crown className="w-5 h-5 text-finance-gold" /> : <Lock className="w-5 h-5" />}
                      {hasProductAccess ? "Premium Information" : "Locked Information"}
                    </h3>
                    {!hasProductAccess && (
                      <button
                        onClick={() => {
                          if (getLoggedInEmail()) {
                            navigate("/premium-plans");
                          } else {
                            openLoginModal();
                          }
                        }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-800 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                      >
                        <Crown className="w-5 h-5" />
                        Get Premium to Unlock
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    {hasProductAccess ? "Full property details unlocked with your premium subscription" : "Unlock full property details after enquiry"}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {hasProductAccess ? (
                      <>
                        <UnlockedRow label="Flat / Shop / Unit / Gala / Plot No" value={property.flatNo || "-"} />
                        <UnlockedRow label="Property / Society Name" value={property.propertyOrSocietyName || "-"} />
                        <UnlockedRow label="Floor" value={property.floor || "-"} />
                        <UnlockedRow label="Full Address" value={property.fullAddress || "-"} />
                        <UnlockedRow label={property.type === "Distress" ? "Builder Name" : "Bank Name"} value={property.bankName || "-"} />
                        <UnlockedRow label={property.type === "New" || property.type === "Resale" ? "Contact Type" : "Contact Person"} value={property.contactPerson || "-"} />
                        <UnlockedRow label="Contact No" value={property.contactNumber || "-"} />
                        <UnlockedRow label="Inspection Date & Time" value={property.inspectionDateTime || "-"} />
                      </>
                    ) : (
                      <>
                        <LockedRow label="Flat / Shop / Unit / Gala / Plot No" />
                        <LockedRow label="Property / Society Name" />
                        <LockedRow label="Floor" />
                        <LockedRow label="Full Address" />
                        <LockedRow label={property.type === "Distress" ? "Builder Name" : "Bank Name"} />
                        <LockedRow label={property.type === "New" || property.type === "Resale" ? "Contact Type" : "Contact Person"} />
                        <LockedRow label="Contact No" />
                        <LockedRow label="Inspection Date & Time" />
                      </>
                    )}
                  </div>
                </div>

                {propertyDocumentUrl ? (
                  <div className="mt-8 rounded-2xl border border-blue-200 bg-white p-5">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Property Document</h3>
                    {hasProductAccess ? (
                      <div className="w-full">
                        <div className="relative w-full h-[500px] rounded-xl border border-blue-200 overflow-hidden">
                          {docLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50 z-10">
                              <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
                              <span className="text-sm text-slate-600">Loading document...</span>
                            </div>
                          )}
                          <iframe
                            src={propertyDocumentUrl}
                            title="Property Document"
                            className="w-full h-full"
                            onLoad={() => setDocLoading(false)}
                          />
                        </div>
                        <a
                          href={propertyDocumentUrl}
                          download
                          className="inline-flex items-center gap-2 mt-3 text-blue-900 font-medium hover:underline"
                        >
                          Download Document
                        </a>
                      </div>
                    ) : (
                      <div className="w-full max-w-[250px] h-[250px] relative rounded-xl overflow-hidden bg-[#f5f5f5] border border-blue-200">
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500">
                          <Lock className="w-10 h-10" />
                          <span className="text-xs font-medium">Document is locked</span>
                        </div>
                        <div className="absolute bottom-0 w-full bg-black/60 text-white text-center px-2 py-2 text-sm">
                          Unlock via enquiry
                        </div>
                      </div>
                    )}
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

      {lightboxOpen && property?.photos && property.photos.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 touch-none"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button
            aria-label="Close"
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl z-[110]"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>

          <button
            aria-label="Previous"
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 transition-colors z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          >
            <span className="text-5xl font-light">‹</span>
          </button>

          <div
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getPhotoUrl(property.photos[currentIndex])}
              alt="property full view"
              className="max-w-[95vw] max-h-[90vh] object-contain rounded shadow-2xl transition-all duration-300"
            />
          </div>

          <button
            aria-label="Next"
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 transition-colors z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <span className="text-5xl font-light">›</span>
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
            {currentIndex + 1} / {property.photos.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertyDetail;

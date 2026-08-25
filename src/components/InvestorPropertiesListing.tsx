import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowLeft, ChevronDown, RotateCcw, Crown } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import { toast } from "react-toastify";
import { openLoginModal } from "@/lib/loginModal";
import {
  FAVOURITE_COMPLETED_EVENT,
  ensureAuthenticatedForFavourite,
  fetchFavourites,
  getLoggedInEmail,
  toggleFavourite,
} from "@/lib/favourites";

interface FilterSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  premium?: boolean;
}

const FilterSelect = ({
  value,
  options,
  onChange,
  isActive,
  ariaLabel,
}: {
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  isActive?: boolean;
  ariaLabel: string;
}) => {
  const [open, setOpen] = useState(false);
  const selectedLabel =
    options.find((o) => o.value === value)?.label || options[0]?.label || "";
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={`h-11 w-full flex items-center justify-between rounded-lg border bg-white pl-3 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors ${
          isActive ? "border-blue-400 bg-blue-50" : "border-blue-200"
        }`}
      >
        <span className="flex items-center gap-1.5 truncate">
          {selectedOption?.premium && (
            <Crown className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
          )}
          {selectedLabel}
        </span>
        <ChevronDown
          className="pointer-events-none absolute right-[18px] top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  if (option.disabled) return;
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-1.5 px-3 py-2 text-sm text-left transition-colors ${
                  option.disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : option.value === value
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {option.premium && (
                  <Crown
                    className={`h-3.5 w-3.5 flex-shrink-0 ${
                      option.disabled ? "text-gray-400" : "text-amber-500"
                    }`}
                  />
                )}
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

interface PropertyPhoto {
  url: string;
}

interface PropertyItem {
  _id: string;
  headline: string;
  createdAt?: string;
  area: string;
  type: "Auction" | "Distress" | "New" | "Resale";
  propertyType: string;
  bhk?: string;
  offerPrice?: number;
  estimatedMarketValue?: number;
  location?: string;
  district?: string;
  possession?: string;
  status?: string;
  emdDate?: string;
  eoiDate?: string;
  inspectionDateTime?: string;
  postingDateTime?: string;
  photos?: PropertyPhoto[];
}

const InvestorPropertiesListing = ({
  type,
  title,
}: {
  type: "Auction" | "Distress" | "New" | "Resale";
  title: string;
}) => {
  type SortValue = "latest" | "price_high" | "price_low" | "inspection_date" | "emd_date";
  type PossessionValue = "all" | "physical" | "symbolic" | "free hold";

  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
  const [confirmingRemoval, setConfirmingRemoval] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [premiumProducts, setPremiumProducts] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortValue>("latest");
  const navigate = useNavigate();
  const [selectedPossession, setSelectedPossession] = useState<PossessionValue>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const isLoggedIn = Boolean(getLoggedInEmail());

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

  useEffect(() => {
    const onFavouriteCompleted = (event: Event) => {
      const detail = (event as CustomEvent<{ itemId?: string; itemType?: string }>).detail;
      if (detail?.itemType !== "property" || !detail.itemId) return;

      setFavouriteIds((prev) => {
        const next = new Set(prev);
        next.add(String(detail.itemId));
        return next;
      });
    };

    window.addEventListener(FAVOURITE_COMPLETED_EVENT, onFavouriteCompleted);
    return () => {
      window.removeEventListener(FAVOURITE_COMPLETED_EVENT, onFavouriteCompleted);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setFavouriteIds(new Set());
      return;
    }

    const loadFavourites = async () => {
      try {
        const payload = await fetchFavourites();
        const ids = new Set(
          (payload.favourites || [])
            .filter((fav) => fav.type === "property")
            .map((fav) => String(fav.id))
        );
        setFavouriteIds(ids);
      } catch (error) {
        setFavouriteIds(new Set());
      }
    };

    loadFavourites();
  }, [isLoggedIn]);

  const executePropertyToggle = async (propertyId: string) => {
    if (!isLoggedIn || togglingIds.has(propertyId)) return;

    const wasFavourite = favouriteIds.has(propertyId);
    const nextIds = new Set(favouriteIds);
    if (wasFavourite) {
      nextIds.delete(propertyId);
    } else {
      nextIds.add(propertyId);
    }
    setFavouriteIds(nextIds);
    setTogglingIds((prev) => new Set(prev).add(propertyId));

    try {
      await toggleFavourite(propertyId, "property");
    } catch (error: any) {
      setFavouriteIds((prev) => {
        const rollback = new Set(prev);
        if (wasFavourite) {
          rollback.add(propertyId);
        } else {
          rollback.delete(propertyId);
        }
        return rollback;
      });
      toast.error(error?.response?.data?.message || "Unable to update favourite");
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
    }
  };

  const handlePropertyFavouriteToggle = async (propertyId: string) => {
    if (!ensureAuthenticatedForFavourite({ itemId: propertyId, itemType: "property" }) || togglingIds.has(propertyId)) return;

    const wasFavourite = favouriteIds.has(propertyId);
    if (wasFavourite) {
      setPendingRemovalId(propertyId);
      return;
    }

    await executePropertyToggle(propertyId);
  };

  const handleConfirmRemoval = async () => {
    if (!pendingRemovalId || confirmingRemoval) return;

    try {
      setConfirmingRemoval(true);
      await executePropertyToggle(pendingRemovalId);
      setPendingRemovalId(null);
    } finally {
      setConfirmingRemoval(false);
    }
  };

  const listingProduct = useMemo(() => {
    if (type === "Auction") return "auction";
    if (type === "Distress") return "alternate-investment";
    if (type === "New" || type === "Resale") return "new-resale";
    return "";
  }, [type]);

  const hasProductAccess = useMemo(() => {
    if (!listingProduct) return isPremium;
    return premiumProducts.some((p) => p === listingProduct || p === "all");
  }, [premiumProducts, listingProduct, isPremium]);

  const pageDescription = useMemo(
    () => `${title} on FINVESTCORP with location, type, pricing, and complete details.`,
    [title]
  );

  const locationOptions = useMemo(() => {
    return Array.from(
      new Set(
        properties
          .map((item) => String(item.location || "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [properties]);

  const districtOptions = useMemo(() => {
    return Array.from(
      new Set(
        properties
          .map((item) => String(item.district || "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [properties]);

  const isVisibleNow = (postingDateTime?: string) => {
    if (!postingDateTime) return true;
    const scheduled = new Date(postingDateTime).getTime();
    return Number.isNaN(scheduled) || scheduled <= Date.now();
  };

  const visibleProperties = useMemo(() => {
    const normalize = (value?: string) => String(value || "").trim().toLowerCase();

    let items = properties.filter((item) => isVisibleNow(item.postingDateTime));

    if (selectedPossession !== "all") {
      items = items.filter((item) => normalize(item.possession) === selectedPossession);
    }

    if (selectedLocation !== "all") {
      items = items.filter((item) => normalize(item.location) === normalize(selectedLocation));
    }

    if (selectedDistrict !== "all") {
      items = items.filter((item) => normalize(item.district) === normalize(selectedDistrict));
    }

    if (selectedSort === "price_high") {
      return items.sort((a, b) => Number(b.offerPrice || 0) - Number(a.offerPrice || 0));
    }

    if (selectedSort === "price_low") {
      return items.sort((a, b) => Number(a.offerPrice || 0) - Number(b.offerPrice || 0));
    }

    if (selectedSort === "inspection_date") {
      const now = Date.now();
      return items.sort((a, b) => {
        const aTime = a.inspectionDateTime ? new Date(a.inspectionDateTime).getTime() : null;
        const bTime = b.inspectionDateTime ? new Date(b.inspectionDateTime).getTime() : null;

        if (aTime === null && bTime === null) return 0;
        if (aTime === null) return 1;
        if (bTime === null) return -1;

        const aFuture = aTime >= now;
        const bFuture = bTime >= now;

        if (aFuture && bFuture) {
          return aTime - bTime;
        }
        if (aFuture && !bFuture) return -1;
        if (!aFuture && bFuture) return 1;

        return bTime - aTime;
      });
    }

    if (selectedSort === "emd_date") {
      const now = Date.now();
      return items.sort((a, b) => {
        const aTime = a.emdDate ? new Date(a.emdDate).getTime() : null;
        const bTime = b.emdDate ? new Date(b.emdDate).getTime() : null;

        if (aTime === null && bTime === null) return 0;
        if (aTime === null) return 1;
        if (bTime === null) return -1;

        const aFuture = aTime >= now;
        const bFuture = bTime >= now;

        if (aFuture && bFuture) {
          return aTime - bTime;
        }
        if (aFuture && !bFuture) return -1;
        if (!aFuture && bFuture) return 1;

        return bTime - aTime;
      });
    }

    // Default latest sort by createdAt (descending), with safe fallback.
    return items.sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime() || 0;
      const bTime = new Date(b.createdAt || 0).getTime() || 0;
      return bTime - aTime;
    });
  }, [properties, selectedPossession, selectedLocation, selectedDistrict, selectedSort]);

  const isSimpleType = type === "New" || type === "Resale";
  const listingLabel = type === "Distress" ? "alternate investment" : "auction";
  const isDefaultFilters =
    selectedSort === "latest" &&
    selectedPossession === "all" &&
    selectedLocation === "all" &&
    selectedDistrict === "all";

  const handleResetFilters = () => {
    setSelectedSort("latest");
    setSelectedPossession("all");
    setSelectedLocation("all");
    setSelectedDistrict("all");
  };

  const premiumSortValues = ["inspection_date", "emd_date"];

  const sortOptions = useMemo(() => {
    const options: FilterSelectOption[] = [
      { value: "latest", label: "Latest Posted" },
      { value: "inspection_date", label: "Inspection Date", premium: true },
      { value: "emd_date", label: "EMD Date", premium: true },
      { value: "price_high", label: "Price: High to Low" },
      { value: "price_low", label: "Price: Low to High" },
    ];
    if (type !== "Auction") {
      return options.filter((opt) => opt.value !== "inspection_date" && opt.value !== "emd_date");
    }
    return options;
  }, [type]);

  const possessionOptions: FilterSelectOption[] = [
    { value: "all", label: "All Possession" },
    { value: "physical", label: "Physical" },
    { value: "symbolic", label: "Symbolic" },
    { value: "free hold", label: "Free Hold" },
  ];

  const locationSelectOptions: FilterSelectOption[] = [
    { value: "all", label: "All Locations" },
    ...locationOptions.map((location) => ({ value: location, label: location })),
  ];

  const districtSelectOptions: FilterSelectOption[] = [
    { value: "all", label: "All Districts" },
    ...districtOptions.map((district) => ({ value: district, label: district })),
  ];

  return (
    <section className="pt-6 pb-16 mx-auto bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>{title} - FINVESTCORP</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
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

        <div className="mb-6 md:mx-12">
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${isSimpleType ? 4 : 5} gap-3`}>
            <FilterSelect
              ariaLabel="Sort properties"
              value={selectedSort}
              options={sortOptions}
              onChange={(value) => {
                if (premiumSortValues.includes(value) && !hasProductAccess) {
                  if (!isLoggedIn) {
                    openLoginModal();
                  } else {
                    const label = value === "inspection_date" ? "Inspection Date" : "EMD Date";
                    toast.info(`${label} filter is only for Premium users`);
                    navigate("/premium-plans");
                  }
                  return;
                }
                setSelectedSort(value as SortValue);
              }}
              isActive={selectedSort !== "latest"}
            />

            {!isSimpleType && (
              <FilterSelect
                ariaLabel="Filter by possession"
                value={selectedPossession}
                options={possessionOptions}
                onChange={(value) => setSelectedPossession(value as PossessionValue)}
                isActive={selectedPossession !== "all"}
              />
            )}

            <FilterSelect
              ariaLabel="Filter by location"
              value={selectedLocation}
              options={locationSelectOptions}
              onChange={setSelectedLocation}
              isActive={selectedLocation !== "all"}
            />

            <FilterSelect
              ariaLabel="Filter by district"
              value={selectedDistrict}
              options={districtSelectOptions}
              onChange={setSelectedDistrict}
              isActive={selectedDistrict !== "all"}
            />

            <button
              type="button"
              onClick={handleResetFilters}
              disabled={isDefaultFilters}
              className="h-11 inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 text-sm font-semibold text-blue-900 hover:bg-blue-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"></span>
          </div>
        ) : visibleProperties.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No {listingLabel} properties found for the selected filters</div>
        ) : (
          <div className="space-y-3 md:mx-12">
            {visibleProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                showFavourite
                isFavourite={favouriteIds.has(String(property._id))}
                isToggling={togglingIds.has(String(property._id))}
                onToggleFavourite={handlePropertyFavouriteToggle}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmActionModal
        open={Boolean(pendingRemovalId)}
        title="Remove from favourites?"
        description="This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={confirmingRemoval}
        onCancel={() => {
          if (confirmingRemoval) return;
          setPendingRemovalId(null);
        }}
        onConfirm={handleConfirmRemoval}
      />
    </section>
  );
};

export default InvestorPropertiesListing;

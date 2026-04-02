import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowLeft, ChevronDown, RotateCcw } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import PropertyCard from "@/components/PropertyCard";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import { toast } from "react-toastify";
import { fetchFavourites, getLoggedInEmail, toggleFavourite } from "@/lib/favourites";

interface FilterSelectOption {
  value: string;
  label: string;
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
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 w-full appearance-none rounded-lg border bg-white pl-3 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors ${
          isActive ? "border-blue-400 bg-blue-50" : "border-blue-200"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-[18px] top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        aria-hidden="true"
      />
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
  type: "Auction" | "Distress";
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
  photos?: PropertyPhoto[];
}

const InvestorPropertiesListing = ({
  type,
  title,
}: {
  type: "Auction" | "Distress";
  title: string;
}) => {
  type SortValue = "latest" | "price_high" | "price_low";
  type PossessionValue = "all" | "physical" | "symbolic";

  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
  const [confirmingRemoval, setConfirmingRemoval] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<SortValue>("latest");
  const [selectedPossession, setSelectedPossession] = useState<PossessionValue>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const isLoggedIn = Boolean(getLoggedInEmail());

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
    if (!isLoggedIn) return;

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
    if (!isLoggedIn || togglingIds.has(propertyId)) return;

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

  const visibleProperties = useMemo(() => {
    const normalize = (value?: string) => String(value || "").trim().toLowerCase();

    let items = [...properties];

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

    // Default latest sort by createdAt (descending), with safe fallback.
    return items.sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime() || 0;
      const bTime = new Date(b.createdAt || 0).getTime() || 0;
      return bTime - aTime;
    });
  }, [properties, selectedPossession, selectedLocation, selectedDistrict, selectedSort]);

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

  const sortOptions: FilterSelectOption[] = [
    { value: "latest", label: "Latest" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "price_low", label: "Price: Low to High" },
  ];

  const possessionOptions: FilterSelectOption[] = [
    { value: "all", label: "All Possession" },
    { value: "physical", label: "Physical" },
    { value: "symbolic", label: "Symbolic" },
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

        <div className="mb-6 md:mx-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <FilterSelect
              ariaLabel="Sort properties"
              value={selectedSort}
              options={sortOptions}
              onChange={(value) => setSelectedSort(value as SortValue)}
              isActive={selectedSort !== "latest"}
            />

            <FilterSelect
              ariaLabel="Filter by possession"
              value={selectedPossession}
              options={possessionOptions}
              onChange={(value) => setSelectedPossession(value as PossessionValue)}
              isActive={selectedPossession !== "all"}
            />

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
                showFavourite={isLoggedIn}
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

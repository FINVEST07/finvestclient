import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import BlogCard from "@/components/BlogCard";
import PropertyCard from "@/components/PropertyCard";
import JobCard from "@/components/JobCard";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import { fetchFavourites, getLoggedInEmail, toggleFavourite } from "@/lib/favourites";

type MainFilter = "all" | "blogs" | "properties" | "jobs";
type SortOption = "newest" | "oldest" | "price_low" | "price_high" | "alternate" | "auction";

const MAIN_FILTERS: Array<{ label: string; value: MainFilter }> = [
  { label: "All", value: "all" },
  { label: "Blogs", value: "blogs" },
  { label: "Properties", value: "properties" },
  { label: "Jobs", value: "jobs" },
];

const BLOG_SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
];

const PROPERTY_SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: "Price: Low to High", value: "price_low" },
  { label: "Price: High to Low", value: "price_high" },
  { label: "Alternate", value: "alternate" },
  { label: "Auction", value: "auction" },
];

const isValidDate = (value: unknown) => {
  const d = new Date(value as any);
  return !Number.isNaN(d.getTime());
};

const safeTimestamp = (value: unknown) => {
  if (!isValidDate(value)) return 0;
  return new Date(value as any).getTime();
};

const safePrice = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizePropertyType = (value: unknown) => String(value || "").trim().toLowerCase();

const Favourites = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [pendingRemoval, setPendingRemoval] = useState<{ id: string; type: "blog" | "property" | "job" } | null>(null);
  const [confirmingRemoval, setConfirmingRemoval] = useState<boolean>(false);
  const [selectedMainFilter, setSelectedMainFilter] = useState<MainFilter>("all");
  const [selectedSortOption, setSelectedSortOption] = useState<SortOption>("newest");

  const isLoggedIn = Boolean(getLoggedInEmail());

  const loadFavouritesData = async () => {
    if (!isLoggedIn) {
      setBlogs([]);
      setProperties([]);
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const payload = await fetchFavourites();
      setBlogs(payload.blogs || []);
      setProperties(payload.properties || []);
      setJobs(payload.jobs || []);
    } catch (error: any) {
      setBlogs([]);
      setProperties([]);
      setJobs([]);
      toast.error(error?.response?.data?.message || "Unable to load favourites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavouritesData();
  }, [isLoggedIn]);

  useEffect(() => {
    const validMainFilters: MainFilter[] = ["all", "blogs", "properties", "jobs"];
    if (!validMainFilters.includes(selectedMainFilter)) {
      setSelectedMainFilter("all");
      return;
    }

    if (selectedMainFilter === "blogs") {
      const validBlogSort: SortOption[] = ["newest", "oldest"];
      if (!validBlogSort.includes(selectedSortOption)) {
        setSelectedSortOption("newest");
      }
      return;
    }

    if (selectedMainFilter === "properties") {
      const validPropertySort: SortOption[] = ["price_low", "price_high", "alternate", "auction"];
      if (!validPropertySort.includes(selectedSortOption)) {
        setSelectedSortOption("price_low");
      }
      return;
    }

    if (selectedMainFilter === "jobs") {
      const validJobSort: SortOption[] = ["newest", "oldest"];
      if (!validJobSort.includes(selectedSortOption)) {
        setSelectedSortOption("newest");
      }
      return;
    }

    // Keep a sensible default while on "All".
    setSelectedSortOption("newest");
  }, [selectedMainFilter, selectedSortOption]);

  const visibleBlogs = useMemo(() => {
    const items = [...blogs];

    if (selectedMainFilter === "blogs") {
      if (selectedSortOption === "oldest") {
        return items.sort((a, b) => safeTimestamp(a?.createdAt) - safeTimestamp(b?.createdAt));
      }

      return items.sort((a, b) => safeTimestamp(b?.createdAt) - safeTimestamp(a?.createdAt));
    }

    // Default sort for "All"
    return items.sort((a, b) => safeTimestamp(b?.createdAt) - safeTimestamp(a?.createdAt));
  }, [blogs, selectedMainFilter, selectedSortOption]);

  const visibleJobs = useMemo(() => {
    const items = [...jobs];

    if (selectedMainFilter === "jobs" && selectedSortOption === "oldest") {
      return items.sort((a, b) => safeTimestamp(a?.createdAt) - safeTimestamp(b?.createdAt));
    }

    return items.sort((a, b) => safeTimestamp(b?.createdAt) - safeTimestamp(a?.createdAt));
  }, [jobs, selectedMainFilter, selectedSortOption]);

  const visibleProperties = useMemo(() => {
    let items = [...properties];

    if (selectedMainFilter === "properties") {
      if (selectedSortOption === "price_low") {
        return items.sort((a, b) => safePrice(a?.price) - safePrice(b?.price));
      }

      if (selectedSortOption === "price_high") {
        return items.sort((a, b) => safePrice(b?.price) - safePrice(a?.price));
      }

      if (selectedSortOption === "auction") {
        return items.filter((item) => normalizePropertyType(item?.type) === "auction");
      }

      if (selectedSortOption === "alternate") {
        // "Alternate" maps to prior "Distress" nomenclature in existing data.
        return items.filter((item) => {
          const kind = normalizePropertyType(item?.type);
          return kind === "distress" || kind === "alternate";
        });
      }
    }

    // Default sort for "All"
    return items.sort((a, b) => safeTimestamp(b?.createdAt) - safeTimestamp(a?.createdAt));
  }, [properties, selectedMainFilter, selectedSortOption]);

  const showBlogsSection = selectedMainFilter === "all" || selectedMainFilter === "blogs";
  const showPropertiesSection = selectedMainFilter === "all" || selectedMainFilter === "properties";
  const showJobsSection = selectedMainFilter === "all" || selectedMainFilter === "jobs";

  const activeSortOptions = selectedMainFilter === "blogs" || selectedMainFilter === "jobs"
    ? BLOG_SORT_OPTIONS
    : selectedMainFilter === "properties"
      ? PROPERTY_SORT_OPTIONS
      : [];

  const executeRemoveBlog = async (blogId: string) => {
    if (togglingIds.has(blogId)) return;

    setBlogs((prev) => prev.filter((blog) => String(blog._id) !== String(blogId)));
    setTogglingIds((prev) => new Set(prev).add(blogId));

    try {
      await toggleFavourite(blogId, "blog");
    } catch (error: any) {
      await loadFavouritesData();
      toast.error(error?.response?.data?.message || "Unable to update favourite");
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(blogId);
        return next;
      });
    }
  };

  const executeRemoveProperty = async (propertyId: string) => {
    if (togglingIds.has(propertyId)) return;

    setProperties((prev) => prev.filter((property) => String(property._id) !== String(propertyId)));
    setTogglingIds((prev) => new Set(prev).add(propertyId));

    try {
      await toggleFavourite(propertyId, "property");
    } catch (error: any) {
      await loadFavouritesData();
      toast.error(error?.response?.data?.message || "Unable to update favourite");
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
    }
  };

  const executeRemoveJob = async (jobId: string) => {
    if (togglingIds.has(jobId)) return;

    setJobs((prev) => prev.filter((job) => String(job._id) !== String(jobId)));
    setTogglingIds((prev) => new Set(prev).add(jobId));

    try {
      await toggleFavourite(jobId, "job");
    } catch (error: any) {
      await loadFavouritesData();
      toast.error(error?.response?.data?.message || "Unable to update favourite");
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  };

  const handleRemoveBlog = async (blogId: string) => {
    if (togglingIds.has(blogId)) return;
    setPendingRemoval({ id: blogId, type: "blog" });
  };

  const handleRemoveProperty = async (propertyId: string) => {
    if (togglingIds.has(propertyId)) return;
    setPendingRemoval({ id: propertyId, type: "property" });
  };

  const handleRemoveJob = async (jobId: string) => {
    if (togglingIds.has(jobId)) return;
    setPendingRemoval({ id: jobId, type: "job" });
  };

  const handleConfirmRemoval = async () => {
    if (!pendingRemoval || confirmingRemoval) return;

    try {
      setConfirmingRemoval(true);
      if (pendingRemoval.type === "blog") {
        await executeRemoveBlog(pendingRemoval.id);
      } else if (pendingRemoval.type === "property") {
        await executeRemoveProperty(pendingRemoval.id);
      } else {
        await executeRemoveJob(pendingRemoval.id);
      }
      setPendingRemoval(null);
    } finally {
      setConfirmingRemoval(false);
    }
  };

  return (
    <section className="pt-6 pb-16 mx-auto bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>Favourites - FINVESTCORP</title>
        <meta name="description" content="Your favourite blogs and properties on FINVESTCORP." />
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
          <span className="text-sm font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-blue-50 py-2 px-6 rounded-full border border-blue-200">Profile</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-blue-900">Favourites</h1>
          <p className="text-gray-600 mt-3">Your saved blogs and properties in one place.</p>
        </div>

        {!isLoggedIn ? (
          <div className="text-center text-gray-600 py-20">Please login to view your favourites.</div>
        ) : loading ? (
          <div className="text-center py-20">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"></span>
          </div>
        ) : (
          <div className="space-y-12 md:mx-12">
            <section className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {MAIN_FILTERS.map((filter) => {
                  const isActive = selectedMainFilter === filter.value;
                  return (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setSelectedMainFilter(filter.value)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                        isActive
                          ? "bg-blue-900 text-white border-blue-900"
                          : "bg-white text-blue-900 border-blue-200 hover:bg-blue-50"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              {selectedMainFilter !== "all" ? (
                <div className="flex flex-wrap gap-2 transition-all duration-200">
                  {activeSortOptions.map((option) => {
                    const isActive = selectedSortOption === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedSortOption(option.value)}
                        className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium border transition-all duration-200 ${
                          isActive
                            ? "bg-blue-100 text-blue-900 border-blue-300"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </section>

            {showBlogsSection ? (
              <section className="transition-all duration-200">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-5">Favourite Blogs</h2>
                {visibleBlogs.length === 0 ? (
                  <div className="bg-white border border-blue-100 rounded-2xl p-8 text-gray-500">
                    {selectedMainFilter === "blogs" ? "No blogs found for this filter." : "No favourite blogs yet."}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {visibleBlogs.map((blog) => (
                      <BlogCard
                        key={blog._id}
                        blog={blog}
                        showFavourite
                        isFavourite
                        isToggling={togglingIds.has(String(blog._id))}
                        onToggleFavourite={handleRemoveBlog}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : null}

            {showPropertiesSection ? (
              <section className="transition-all duration-200">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-5">Favourite Properties</h2>
                {visibleProperties.length === 0 ? (
                  <div className="bg-white border border-blue-100 rounded-2xl p-8 text-gray-500">
                    {selectedMainFilter === "properties"
                      ? "No properties found for this filter."
                      : "No favourite properties yet."}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visibleProperties.map((property) => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        showFavourite
                        isFavourite
                        isToggling={togglingIds.has(String(property._id))}
                        onToggleFavourite={handleRemoveProperty}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : null}

            {showJobsSection ? (
              <section className="transition-all duration-200">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-5">Favourite Jobs</h2>
                {visibleJobs.length === 0 ? (
                  <div className="bg-white border border-blue-100 rounded-2xl p-8 text-gray-500">
                    {selectedMainFilter === "jobs" ? "No jobs found for this filter." : "No favourite jobs yet."}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {visibleJobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        showFavourite
                        isFavourite
                        isToggling={togglingIds.has(String(job._id))}
                        onToggleFavourite={handleRemoveJob}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : null}
          </div>
        )}
      </div>

      <ConfirmActionModal
        open={Boolean(pendingRemoval)}
        title="Remove from favourites?"
        description="This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={confirmingRemoval}
        onCancel={() => {
          if (confirmingRemoval) return;
          setPendingRemoval(null);
        }}
        onConfirm={handleConfirmRemoval}
      />
    </section>
  );
};

export default Favourites;

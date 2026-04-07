import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import { toast } from "react-toastify";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import JobCard from "@/components/JobCard";
import {
  FAVOURITE_COMPLETED_EVENT,
  ensureAuthenticatedForFavourite,
  fetchFavourites,
  getLoggedInEmail,
  toggleFavourite,
} from "@/lib/favourites";

interface JobItem {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  location?: string;
  salary?: string;
  type?: string;
  createdAt?: string;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
  const [confirmingRemoval, setConfirmingRemoval] = useState<boolean>(false);
  const isLoggedIn = Boolean(getLoggedInEmail());

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}jobs`);
      setJobs(res.data?.payload || []);
    } catch (error) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const onFavouriteCompleted = (event: Event) => {
      const detail = (event as CustomEvent<{ itemId?: string; itemType?: string }>).detail;
      if (detail?.itemType !== "job" || !detail.itemId) return;

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
            .filter((fav) => fav.type === "job")
            .map((fav) => String(fav.id))
        );
        setFavouriteIds(ids);
      } catch (error) {
        setFavouriteIds(new Set());
      }
    };

    loadFavourites();
  }, [isLoggedIn]);

  const executeJobToggle = async (jobId: string) => {
    if (!isLoggedIn || togglingIds.has(jobId)) return;

    const wasFavourite = favouriteIds.has(jobId);
    const nextIds = new Set(favouriteIds);
    if (wasFavourite) {
      nextIds.delete(jobId);
    } else {
      nextIds.add(jobId);
    }
    setFavouriteIds(nextIds);
    setTogglingIds((prev) => new Set(prev).add(jobId));

    try {
      await toggleFavourite(jobId, "job");
    } catch (error: any) {
      setFavouriteIds((prev) => {
        const rollback = new Set(prev);
        if (wasFavourite) {
          rollback.add(jobId);
        } else {
          rollback.delete(jobId);
        }
        return rollback;
      });
      toast.error(error?.response?.data?.message || "Unable to update favourite");
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  };

  const handleJobFavouriteToggle = async (jobId: string) => {
    if (!ensureAuthenticatedForFavourite({ itemId: jobId, itemType: "job" }) || togglingIds.has(jobId)) return;

    const wasFavourite = favouriteIds.has(jobId);
    if (wasFavourite) {
      setPendingRemovalId(jobId);
      return;
    }

    await executeJobToggle(jobId);
  };

  const handleConfirmRemoval = async () => {
    if (!pendingRemovalId || confirmingRemoval) return;

    try {
      setConfirmingRemoval(true);
      await executeJobToggle(pendingRemovalId);
      setPendingRemovalId(null);
    } finally {
      setConfirmingRemoval(false);
    }
  };

  return (
    <section className="pt-6 pb-16 mx-auto bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>Careers - Apply for Jobs | FINVESTCORP</title>
        <meta
          name="description"
          content="Explore current openings at FINVESTCORP and apply for roles in finance, sales, and operations."
        />
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
          <span className="text-sm font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-blue-50 py-2 px-6 rounded-full border border-blue-200">Careers</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-blue-900">Apply for Job</h1>
          <p className="text-gray-600 mt-3">Join our team and build a strong career with FINVESTCORP.</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"></span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No job postings available right now</div>
        ) : (
          <div className="space-y-6 md:mx-12">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                showFavourite
                isFavourite={favouriteIds.has(String(job._id))}
                isToggling={togglingIds.has(String(job._id))}
                onToggleFavourite={handleJobFavouriteToggle}
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

export default Jobs;

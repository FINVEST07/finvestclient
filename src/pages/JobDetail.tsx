import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import FavouriteHeartButton from "@/components/FavouriteHeartButton";
import ConfirmActionModal from "@/components/ConfirmActionModal";
import { toast } from "react-toastify";
import { fetchFavourites, getLoggedInEmail, toggleFavourite } from "@/lib/favourites";

interface JobItem {
  _id: string;
  title: string;
  description: string;
  location?: string;
  salary?: string;
  type?: string;
  createdAt?: string;
}

const stripHtml = (html: string) => {
  const withoutTags = (html || "").replace(/<[^>]*>/g, " ");
  const normalized = withoutTags.replace(/\s+/g, " ").trim();

  if (typeof document === "undefined") {
    return normalized.replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
  }

  const textarea = document.createElement("textarea");
  textarea.innerHTML = normalized;
  return (textarea.value || "").replace(/\s+/g, " ").trim();
};

const normalizeQuillHtml = (html: string) => {
  if (!html) return "";
  let out = html;

  const emptyParaRegex = "<p>\\s*(?:<br\\s*\\/?\\s*>|&nbsp;|\\s)*\\s*<\\/p>";
  out = out.replace(new RegExp(`^(\\s*${emptyParaRegex}\\s*)+`, "i"), "");
  out = out.replace(new RegExp(`(\\s*${emptyParaRegex}\\s*)+$`, "i"), "");
  out = out.replace(new RegExp(`(\\s*${emptyParaRegex}\\s*){2,}`, "gi"), "<p><br /></p>");

  return out;
};

const formatJobDate = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState<JobItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [togglingFavourite, setTogglingFavourite] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [confirmingRemoval, setConfirmingRemoval] = useState<boolean>(false);
  const isLoggedIn = Boolean(getLoggedInEmail());

  const loadJob = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}jobs/${id}`);
      setJob(res.data?.payload || null);
    } catch (error) {
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [id]);

  useEffect(() => {
    if (!isLoggedIn || !job?._id) return;

    const loadFavourites = async () => {
      try {
        const payload = await fetchFavourites();
        const isFav = (payload.favourites || []).some(
          (fav) => fav.type === "job" && String(fav.id) === String(job._id)
        );
        setIsFavourite(isFav);
      } catch (error) {
        setIsFavourite(false);
      }
    };

    loadFavourites();
  }, [isLoggedIn, job?._id]);

  const executeFavouriteToggle = async () => {
    if (!isLoggedIn || !job?._id || togglingFavourite) return;

    const wasFavourite = isFavourite;
    setIsFavourite(!wasFavourite);
    setTogglingFavourite(true);

    try {
      await toggleFavourite(String(job._id), "job");
    } catch (error: any) {
      setIsFavourite(wasFavourite);
      toast.error(error?.response?.data?.message || "Unable to update favourite");
    } finally {
      setTogglingFavourite(false);
    }
  };

  const handleFavouriteToggle = async () => {
    if (!isLoggedIn || !job?._id || togglingFavourite) return;

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

  const description = useMemo(() => {
    if (!job) return "Explore job opportunities at FINVESTCORP.";
    return stripHtml(job.description || "").slice(0, 160);
  }, [job]);

  return (
    <section className="pt-6 pb-16 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>{job ? `${job.title} - Careers | FINVESTCORP` : "Job Details | FINVESTCORP"}</title>
        <meta name="description" content={description} />
      </Helmet>
      <ToastContainerComponent />

      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Link to="/careers/jobs" className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"></span>
          </div>
        ) : !job ? (
          <div className="text-center text-gray-500 py-20">Job not found</div>
        ) : (
          <article className="bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden">
            <div className="p-6 md:p-10">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-2xl md:text-4xl font-bold text-blue-900">{job.title}</h1>
                {isLoggedIn ? (
                  <FavouriteHeartButton
                    isFavourite={isFavourite}
                    disabled={togglingFavourite}
                    onToggle={handleFavouriteToggle}
                  />
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
                <span className="inline-flex px-2.5 py-1 rounded-md font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Posted on {formatJobDate(job.createdAt)}
                </span>
                {job.type ? (
                  <span className="inline-flex px-2.5 py-1 rounded-md font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {job.type}
                  </span>
                ) : null}
                {job.location ? (
                  <span className="inline-flex px-2.5 py-1 rounded-md font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {job.location}
                  </span>
                ) : null}
                {job.salary ? (
                  <span className="inline-flex px-2.5 py-1 rounded-md font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {job.salary}
                  </span>
                ) : null}
              </div>

              <div
                className="prose prose-blue max-w-none text-gray-800 break-words prose-a:text-blue-700 prose-a:underline hover:prose-a:text-blue-900 prose-ol:list-decimal prose-ul:list-disc prose-li:my-0 prose-p:my-1"
                dangerouslySetInnerHTML={{ __html: normalizeQuillHtml(job.description || "") }}
              />
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

export default JobDetail;

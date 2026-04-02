import { Link } from "react-router-dom";
import FavouriteHeartButton from "@/components/FavouriteHeartButton";

interface JobItem {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
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

const formatJobDate = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const JobCard = ({
  job,
  showFavourite,
  isFavourite,
  isToggling,
  onToggleFavourite,
}: {
  job: JobItem;
  showFavourite?: boolean;
  isFavourite?: boolean;
  isToggling?: boolean;
  onToggleFavourite?: (jobId: string) => void;
}) => {
  const preview = stripHtml(job.description || "");
  const shortPreview = preview.length > 200 ? `${preview.slice(0, 200)}...` : preview;

  return (
    <article className="relative grid md:grid-cols-1 gap-0 md:gap-4 items-stretch bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden hover:-translate-y-0.5 transition-all">
      {showFavourite ? (
        <div className="absolute top-3 right-3 z-20">
          <FavouriteHeartButton
            isFavourite={Boolean(isFavourite)}
            disabled={Boolean(isToggling)}
            onToggle={() => onToggleFavourite?.(String(job._id))}
          />
        </div>
      ) : null}

      <Link to={`/careers/jobs/${job._id}`} className="p-6 md:p-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-2 line-clamp-2">{job.title}</h2>
        <p className="text-gray-700 leading-relaxed line-clamp-4 whitespace-pre-line">{shortPreview}</p>

        <span className="mt-4 inline-flex items-center gap-2 text-blue-900 font-semibold">
          View job details
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </span>

        {job.createdAt ? (
          <p className="mt-4 text-xs text-gray-500 font-medium">Posted on {formatJobDate(job.createdAt)}</p>
        ) : null}
      </Link>
    </article>
  );
};

export default JobCard;

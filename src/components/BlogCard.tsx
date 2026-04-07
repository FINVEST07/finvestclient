import { Link } from "react-router-dom";
import FavouriteHeartButton from "@/components/FavouriteHeartButton";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const formatBlogDate = (value: unknown) => {
  if (!value) return "";
  const d = new Date(value as any);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BlogCard = ({
  blog,
  showFavourite,
  isFavourite,
  isToggling,
  onToggleFavourite,
}: {
  blog: any;
  showFavourite?: boolean;
  isFavourite?: boolean;
  isToggling?: boolean;
  onToggleFavourite?: (blogId: string) => void;
}) => {
  const href = `/blogs/${blog.slug || blog._id}`;

  return (
    <article className="relative grid md:grid-cols-3 gap-0 md:gap-4 items-stretch bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden hover:-translate-y-0.5 transition-all">
      {showFavourite !== false ? (
        <div className="absolute top-3 right-3 md:top-auto md:bottom-5 md:right-[calc(33.333333%+0.25rem)] z-20">
          <FavouriteHeartButton
            isFavourite={Boolean(isFavourite)}
            disabled={Boolean(isToggling)}
            onToggle={() => onToggleFavourite?.(String(blog._id))}
          />
        </div>
      ) : null}

      <Link to={href} className="p-6 md:col-span-2 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">{blog.title}</h2>
        <p className="text-gray-700 leading-relaxed line-clamp-4 whitespace-pre-line">
          {typeof blog.content === "string" ? stripHtml(blog.content) : ""}
        </p>

        <div className="mt-2.5 pt-2.5 border-t border-slate-100">
          <span className="inline-flex items-center gap-2 text-blue-900 font-semibold">
            Read full article
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </span>
          {blog?.createdAt ? (
            <p className="mt-2 text-xs text-slate-500 font-medium">Posted on: {formatBlogDate(blog.createdAt)}</p>
          ) : null}
        </div>
      </Link>

      <Link to={href} className="bg-blue-50">
        {blog.thumbnailUrl ? (
          <img
            src={blog.thumbnailUrl}
            alt={blog.title}
            className="w-full h-auto block"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-blue-700 p-6">No Image</div>
        )}
      </Link>
    </article>
  );
};

export default BlogCard;

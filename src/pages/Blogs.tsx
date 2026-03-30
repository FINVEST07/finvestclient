import { useEffect, useState } from "react";
import axios from "axios";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import BlogCard from "@/components/BlogCard";
import { fetchFavourites, getLoggedInEmail, toggleFavourite } from "@/lib/favourites";

const Blogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const isLoggedIn = Boolean(getLoggedInEmail());

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}blogs`);
      setBlogs(res.data?.payload || []);
    } catch (e) {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadFavourites = async () => {
      try {
        const payload = await fetchFavourites();
        const ids = new Set(
          (payload.favourites || [])
            .filter((fav) => fav.type === "blog")
            .map((fav) => String(fav.id))
        );
        setFavouriteIds(ids);
      } catch (error) {
        setFavouriteIds(new Set());
      }
    };

    loadFavourites();
  }, [isLoggedIn]);

  const handleBlogFavouriteToggle = async (blogId: string) => {
    if (!isLoggedIn) return;

    const wasFavourite = favouriteIds.has(blogId);
    const nextIds = new Set(favouriteIds);
    if (wasFavourite) {
      nextIds.delete(blogId);
    } else {
      nextIds.add(blogId);
    }
    setFavouriteIds(nextIds);
    setTogglingIds((prev) => new Set(prev).add(blogId));

    try {
      await toggleFavourite(blogId, "blog");
    } catch (error: any) {
      setFavouriteIds((prev) => {
        const rollback = new Set(prev);
        if (wasFavourite) {
          rollback.add(blogId);
        } else {
          rollback.delete(blogId);
        }
        return rollback;
      });
      toast.error(error?.response?.data?.message || "Unable to update favourite");
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(blogId);
        return next;
      });
    }
  };

  return (
    <section className="pt-6 pb-16 mx-auto bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>Blogs - FINVESTCORP</title>
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
          <span className="text-sm font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-blue-50 py-2 px-6 rounded-full border border-blue-200">Blogs</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-blue-900">Insights and Updates</h1>
          <p className="text-gray-600 mt-3">Learn more about finance, loans and investments.</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"></span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No blogs to show</div>
        ) : (
          <div className="space-y-6 md:mx-12">
            {blogs.map((b) => (
              <BlogCard
                key={b._id}
                blog={b}
                showFavourite={isLoggedIn}
                isFavourite={favouriteIds.has(String(b._id))}
                isToggling={togglingIds.has(String(b._id))}
                onToggleFavourite={handleBlogFavouriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;

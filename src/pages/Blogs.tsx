import { useEffect, useState } from "react";
import axios from "axios";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
          <div className="space-y-6 mx-12">
            {blogs.map((b) => (
              <a key={b._id} className="grid md:grid-cols-3 gap-4 items-stretch bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden hover:-translate-y-0.5 transition-all" href={`/blogs/${b.slug || b._id}` }>
                <div className="p-6 md:col-span-2 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">{b.title}</h2>
                  <p className="text-gray-700 leading-relaxed line-clamp-4 whitespace-pre-line">{b.content}</p>
                </div>
                <div className="aspect-square bg-blue-50 grid place-items-center">
                  {b.thumbnailUrl ? (
                    <img src={b.thumbnailUrl} alt={b.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="text-blue-700">No Image</div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadBlog = async () => {
    try {
      setLoading(true);
      // Prefer slug endpoint
      const bySlug = await axios.get(`${import.meta.env.VITE_API_URI}blogs/slug/${slug}`);
      setBlog(bySlug.data?.payload || null);
    } catch (e) {
      // fallback: maybe slug is actually an id
      try {
        const byId = await axios.get(`${import.meta.env.VITE_API_URI}blogs/${slug}`);
        setBlog(byId.data?.payload || null);
      } catch (e2) {
        setBlog(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) loadBlog();
  }, [slug]);

  const description = blog ? (blog.content?.length ? stripHtml(blog.content).slice(0, 160) : blog.title) : "Read our latest financial insights and updates.";
  const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/blogs/${slug}` : `/blogs/${slug}`;

  return (
    <section className="pt-6 pb-16 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>{blog ? `${blog.title} - FINVESTCORP` : 'Blog - FINVESTCORP'}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={blog ? blog.title : 'Blog'} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        {blog?.thumbnailUrl && <meta property="og:image" content={blog.thumbnailUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog ? blog.title : 'Blog'} />
        <meta name="twitter:description" content={description} />
        {blog?.thumbnailUrl && <meta name="twitter:image" content={blog.thumbnailUrl} />}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: blog?.title || 'Blog',
            image: blog?.thumbnailUrl ? [blog.thumbnailUrl] : undefined,
            datePublished: blog?.createdAt || undefined,
            author: { '@type': 'Organization', name: 'FINVESTCORP' },
            publisher: { '@type': 'Organization', name: 'FINVESTCORP', logo: { '@type': 'ImageObject', url: '/fin_lo.png' } },
            mainEntityOfPage: canonicalUrl,
            description
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
              { '@type': 'ListItem', position: 2, name: 'Blogs', item: '/blogs' },
              { '@type': 'ListItem', position: 3, name: blog?.title || 'Blog', item: canonicalUrl }
            ]
          })}
        </script>
      </Helmet>
      <ToastContainerComponent />
      <div className="container mx-auto px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"></span>
          </div>
        ) : !blog ? (
          <div className="text-center text-gray-500 py-20">Blog not found</div>
        ) : (
          <article className="bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden">
            {blog.thumbnailUrl && (
              <div className="w-full bg-blue-50">
                <div className="aspect-video md:aspect-[16/7] lg:aspect-[16/6] w-full">
                  <img
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    className="w-full h-auto object-contain block"
                  />
                </div>
              </div>
            )}
            <div className="p-6 md:p-10">
              <h1 className="text-2xl md:text-4xl font-bold text-blue-900 mb-4 leading-snug">{blog.title}</h1>
              <div
                className="prose prose-blue max-w-none text-gray-800 break-words prose-a:text-blue-700 prose-a:underline hover:prose-a:text-blue-900 prose-ol:list-decimal prose-ul:list-disc prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: blog.content || "" }}
              />
            </div>
          </article>
        )}
      </div>
    </section>
  );
};

export default BlogDetail;

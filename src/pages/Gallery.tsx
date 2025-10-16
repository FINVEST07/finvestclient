import { useEffect, useState } from "react";
import axios from "axios";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";

const Gallery = () => {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}media`);
      setMedia(res.data?.payload || []);
    } catch (e) {
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  // keyboard navigation when lightbox open
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setCurrentIndex((i) => (i + 1) % media.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => (i - 1 + media.length) % media.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, media.length]);

  return (
    <section className="pt-6 pb-16 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>Gallery - FINVESTCORP</title>
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
          <span className="text-sm font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-blue-50 py-2 px-6 rounded-full border border-blue-200">Gallery</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-blue-900">Our Moments</h1>
          <p className="text-gray-600 mt-3">Explore highlights from our events and activities.</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"></span>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No images to show</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-5">
            {media.map((m, idx) => (
              <button
                key={m._id}
                type="button"
                className="group bg-white rounded-xl shadow-xl p-4 pb-0 pt-6 hover:shadow-md border border-blue-200 overflow-hidden text-left transition-shadow"
                onClick={() => { setCurrentIndex(idx); setLightboxOpen(true); }}
              >
                <div className="aspect-[3/4] w-full bg-blue-50">
                  <img src={m.url} alt={m.label || 'media'} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="px-3 py-2">
                  <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-center text-blue-900 line-clamp-2 min-h-[2.5rem]">
                    {m.label || m.text || 'Untitled'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {lightboxOpen && media.length > 0 && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button aria-label="Close" className="absolute top-4 right-4 text-white text-2xl" onClick={() => setLightboxOpen(false)}>✕</button>
          <button
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3"
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => (i - 1 + media.length) % media.length); }}
          >
            ‹
          </button>
          <div className="max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <img src={media[currentIndex].url} alt="media" className="w-full h-full object-contain" />
          </div>
          <button
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3"
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => (i + 1) % media.length); }}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;

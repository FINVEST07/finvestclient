"use client";

import { useEffect, useState } from "react";

// In-memory cache object
const cache = {};

const BusinessNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    const cacheKey = "business-us";

    if (cache[cacheKey]) {
      setNews(cache[cacheKey]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://newsdata.io/api/1/news?apikey=pub_ae2dc193e5ea478baf1f964fa482ec12&country=us&category=business&language=en`
      );

      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        throw new Error("No news articles found.");
      }

      cache[cacheKey] = data.results;
      setNews(data.results);
    } catch (err) {
      console.error("News fetch error:", err);
      setNews([]);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="py-2   max-w-8xl w-full   z-40 ">
      {/* Marquee Container */}
      <div className="overflow-hidden bg-blue-900 p-2 rounded">
        {loading && <p className="text-center">Loading news...</p>}

        {!loading && error && (
          <div className="text-center text-white/95 ">
            <p className="text-center text-white/95 ">No news available right now.</p>


          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <p className="text-center text-white/95 ">No news available right now.</p>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="marquee-container ">
            <div className="marquee">
              {news.map((item, index) => (
                <span key={index} className="marquee-item text-white/95 ">
                  {item.title} &nbsp; • &nbsp;
                </span>
              ))}
              {/* Duplicate news items for seamless looping */}
              {news.map((item, index) => (
                <span key={`dup-${index}`} className="marquee-item text-white/95 ">
                  {item.title} &nbsp; • &nbsp;
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CSS for Marquee Effect */}
      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }
        .marquee {
          display: inline-block;
          animation: marquee 90s linear infinite;
        }
        .marquee-item {
          display: inline-block;
          font-size: 1rem;
          
          padding-right: 1rem;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default BusinessNews;
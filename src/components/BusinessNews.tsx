"use client";

import styles from "./BusinessNews.module.css"

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
    <div className="py-2 max-w-8xl -mt-1 w-full z-40">
      {/* Marquee Container */}
      <div className="overflow-hidden bg-blue-900 p-2 rounded">
        {loading && <p className="text-center text-white/95">Loading news...</p>}

        {!loading && error && (
          <div className="text-center text-white/95">
            <p>No news available right now.</p>
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <p className="text-center text-white/95">No news available right now.</p>
        )}

        {!loading && !error && news.length > 0 && (
          <div className={styles.marqueeContainer}>
            <div className={styles.marquee}>
              {news.map((item, index) => (
                <span key={index} className={styles.marqueeItem}>
                  {item.title}  • 
                </span>
              ))}
              {/* Duplicate news items for seamless looping */}
              {news.map((item, index) => (
                <span key={`dup-${index}`} className="marquee-item text-white/95">
                  {item.title}  • 
                </span>
              ))}
              {/* Disclaimer inside marquee */}
              <span className="marquee-item text-white/95">
                News sourced from NewsData.io  • 
              </span>
            </div>
          </div>
        )}
      </div>

     

    </div>
  );
};

export default BusinessNews;
"use client";

import { useEffect, useState } from "react";

// Tab configuration
const TABS = [
  { label: "India", country: "in", category: "business" },
  { label: "Global", country: "us", category: "business" },
  { label: "Startups", country: "in", category: "technology" },
];

// In-memory cache object
const cache = {};

const BusinessNewsTabs = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (tab: typeof TABS[number]) => {
    const cacheKey = tab.label;

    if (cache[cacheKey]) {
      setNews(cache[cacheKey]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://newsdata.io/api/1/news?apikey=pub_ae2dc193e5ea478baf1f964fa482ec12&country=${tab.country}&category=${tab.category}&language=en`
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
    fetchNews(activeTab);
  }, [activeTab]);

  return (
    <div className="bg-blue-900 mt-8 text-white px-4 py-4 border-t border-b border-gray-700">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-full ${
              activeTab.label === tab.label
                ? "bg-blue-800 text-white"
                : "bg-blue-300 text-blue-800 hover:bg-blue-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* News Content */}
      <div className="space-y-4  overflow-y-auto">
        {loading && <p className="text-gray-400">Loading news...</p>}

        {!loading && error && (
          <div className="text-red-400">
            <p>⚠️ {error}</p>
            <button
              onClick={() => fetchNews(activeTab)}
              className="mt-2 px-3 py-1 text-sm bg-red-600 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <p className="text-yellow-400">No news available right now.</p>
        )}

        {!loading &&
          !error &&
          news.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 items-start hover:bg-blue-700 p-2 rounded-md transition"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt="news"
                  className="w-20 h-16 object-cover rounded"
                />
              )}
              <div>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-xs text-gray-400">
                  {item.description?.slice(0, 100)}...
                </p>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
};

export default BusinessNewsTabs;

import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import ToastContainerComponent from "@/components/ToastContainerComponent";

interface JobItem {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
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

const Jobs = () => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}jobs`);
      setJobs(res.data?.payload || []);
    } catch (error) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <section className="pt-6 pb-16 mx-auto bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 min-h-screen">
      <Helmet>
        <title>Careers - Apply for Jobs | FINVESTCORP</title>
        <meta
          name="description"
          content="Explore current openings at FINVESTCORP and apply for roles in finance, sales, and operations."
        />
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
          <span className="text-sm font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-blue-50 py-2 px-6 rounded-full border border-blue-200">Careers</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-blue-900">Apply for Job</h1>
          <p className="text-gray-600 mt-3">Join our team and build a strong career with FINVESTCORP.</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <span className="animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full"></span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No job postings available right now</div>
        ) : (
          <div className="space-y-6 md:mx-12">
            {jobs.map((job) => {
              const preview = stripHtml(job.description || "");
              const shortPreview = preview.length > 200 ? `${preview.slice(0, 200)}...` : preview;

              return (
                <a
                  key={job._id}
                  href={`/careers/jobs/${job._id}`}
                  className="grid md:grid-cols-1 gap-0 md:gap-4 items-stretch bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden hover:-translate-y-0.5 transition-all"
                >
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-blue-900 mb-2 line-clamp-2">{job.title}</h2>
                    <p className="text-gray-700 leading-relaxed line-clamp-4 whitespace-pre-line">{shortPreview}</p>

                    <span className="mt-4 inline-flex items-center gap-2 text-blue-900 font-semibold">
                      View job details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>

                    {job.createdAt ? (
                      <p className="mt-4 text-xs text-gray-500 font-medium">Posted on {formatJobDate(job.createdAt)}</p>
                    ) : null}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Jobs;

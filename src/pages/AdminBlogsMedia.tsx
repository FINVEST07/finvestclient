import AdminSidebar from "@/components/AdminSidebar";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { toast } from "sonner";
import ToastContainerComponent from "@/components/ToastContainerComponent";

const AdminBlogsMedia = () => {
  const [adminRank, setAdminRank] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPostOpen, setIsPostOpen] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // media state
  const [media, setMedia] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(false);
  const [isMediaOpen, setIsMediaOpen] = useState<boolean>(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaSubmitting, setMediaSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const storedRank = localStorage.getItem("rank");
    const storedEmail = localStorage.getItem("email");
    if (storedRank) setAdminRank(parseInt(storedRank));
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}blogs`);
      setBlogs(res.data?.payload || []);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to load blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
    // also load media
    loadMedia();
  }, [adminRank, email]);

  const loadMedia = async () => {
    try {
      setLoadingMedia(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}media`);
      setMedia(res.data?.payload || []);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to load media");
      setMedia([]);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    try {
      setSubmitting(true);
      const form = new FormData();
      form.append("title", title);
      form.append("content", content);
      if (thumbnail) form.append("thumbnail", thumbnail);

      const res = await axios.post(`${import.meta.env.VITE_API_URI}blogs`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.status) {
        toast.success(res.data?.message || "Blog posted");
        setIsPostOpen(false);
        setTitle("");
        setContent("");
        setThumbnail(null);
        loadBlogs();
      } else {
        toast.error(res.data?.message || "Failed to post blog");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Thumbnail",
        cell: (row: any) => (
          <div className="py-2">
            {row?.thumbnailUrl ? (
              <img
                src={row.thumbnailUrl}
                alt={row.title}
                className="w-14 h-14 object-cover rounded"
                loading="lazy"
              />
            ) : (
              <div className="w-14 h-14 bg-slate-300 rounded grid place-items-center text-xs text-slate-600">N/A</div>
            )}
          </div>
        ),
        width: "120px",
      },
      {
        name: "Content",
        cell: (row: any) => (
          <textarea
            readOnly
            value={row?.content || ""}
            className="w-full p-2 border rounded resize-none bg-gray-100 text-gray-800"
            rows={3}
          />
        ),
        grow: 3,
      },
      {
        name: "Title",
        selector: (row: any) => row.title,
        wrap: true,
        grow: 2,
      },
      {
        name: "Created",
        selector: (row: any) => {
          const d = row?.createdAt ? new Date(row.createdAt) : null;
          return d ? `${d.toLocaleDateString()} ${d.toLocaleTimeString()}` : "-";
        },
        width: "220px",
      },
    ],
    []
  );

  const customStyles: any = {
    headRow: {
      style: {
        backgroundColor: "#0F172A",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
        padding: "12px",
      },
    },
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        padding: "12px",
      },
    },
    rows: {
      style: {
        backgroundColor: "#f9fafb",
        fontSize: "14px",
        padding: "10px",
        borderBottom: "1px solid #d1d5db",
      },
    },
    cells: {
      style: {
        textAlign: "left",
        paddingLeft: "15px",
      },
    },
    pagination: {
      style: {
        backgroundColor: "#e2e8f0",
        color: "#374151",
        fontSize: "14px",
      },
    },
  };

  return (
    <div className="bg-slate-800 pb-16 w-full min-h-screen">
      <ToastContainerComponent />
      {adminRank == 1 && <AdminSidebar />}

      <div className={`${adminRank == 1 ? "ml-[22%]" : ""} pt-[10vh] px-[5%]`}>
        <div className="flex flex-col gap-10">
          <section className="bg-slate-900/50 rounded-lg border border-slate-700 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-2xl font-semibold">Blogs</h2>
              <button
                onClick={() => setIsPostOpen(true)}
                className="px-4 py-2 bg-[#D6B549] text-slate-900 font-medium rounded-md hover:brightness-95"
              >
                Post Blog
              </button>
            </div>

            <div className="mt-5">
              {loading ? (
                <div className="text-center py-10">
                  <span className="animate-spin inline-block w-6 h-6 border-4 border-t-transparent border-[#D6B549] rounded-full"></span>
                </div>
              ) : (
                <DataTable
                  columns={columns as any}
                  data={blogs}
                  pagination
                  customStyles={customStyles}
                  noDataComponent={
                    <div className="text-center py-6 text-gray-400">No blogs found</div>
                  }
                />
              )}
            </div>
          </section>

          <section className="bg-slate-900/50 rounded-lg border border-slate-700 p-6 shadow-lg min-h-[20vh]">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-2xl font-semibold">Media</h2>
              <button
                onClick={() => setIsMediaOpen(true)}
                className="px-4 py-2 bg-[#D6B549] text-slate-900 font-medium rounded-md hover:brightness-95"
              >
                Post Image
              </button>
            </div>
            <div className="mt-5">
              {loadingMedia ? (
                <div className="text-center py-10">
                  <span className="animate-spin inline-block w-6 h-6 border-4 border-t-transparent border-[#D6B549] rounded-full"></span>
                </div>
              ) : media.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No media uploaded</div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
                  {media.map((m) => (
                    <div key={m._id} className="bg-slate-800 border border-slate-700 rounded-md overflow-hidden">
                      <img src={m.url} alt={m.text || "media"} className="w-full h-36 object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {isPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsPostOpen(false)} />
          <div className="relative w-[90%] max-w-2xl bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">Post a Blog</h3>
              <button
                onClick={() => setIsPostOpen(false)}
                className="text-slate-500 hover:text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D6B549]"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 h-40 resize-y focus:outline-none focus:ring-2 focus:ring-[#D6B549]"
                  placeholder="Write your blog content..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 bg-white"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsPostOpen(false)}
                className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-[#D6B549] text-slate-900 font-medium disabled:opacity-70"
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isMediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMediaOpen(false)} />
          <div className="relative w-[90%] max-w-2xl bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">Post Image</h3>
              <button onClick={() => setIsMediaOpen(false)} className="text-slate-500 hover:text-slate-700" aria-label="Close">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f) setMediaFile(f);
                  }}
                  className="w-full border-2 border-dashed border-slate-300 rounded-md p-6 text-center bg-slate-50 flex flex-col items-center justify-center"
                >
                  <p className="text-slate-600 mb-2">Drag & drop an image here</p>
                  <p className="text-slate-500 text-sm">or</p>
                  <div className="mt-3">
                    <input type="file" accept="image/*" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} className="block mx-auto" />
                  </div>
                  {mediaFile && (
                    <div className="mt-3 text-slate-700 text-sm">Selected: {mediaFile.name}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={() => setIsMediaOpen(false)} className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
              <button
                onClick={async () => {
                  if (!mediaFile) { toast.error("Please select an image"); return; }
                  try {
                    setMediaSubmitting(true);
                    const form = new FormData();
                    form.append("image", mediaFile);
                    const res = await axios.post(`${import.meta.env.VITE_API_URI}media`, form, { headers: { "Content-Type": "multipart/form-data" } });
                    if (res.data?.status) {
                      toast.success(res.data?.message || "Image posted");
                      setIsMediaOpen(false);
                      setMediaFile(null);
                      loadMedia();
                    } else {
                      toast.error(res.data?.message || "Failed to upload image");
                    }
                  } catch (e: any) {
                    console.error(e);
                    toast.error(e?.response?.data?.message || "Something went wrong");
                  } finally {
                    setMediaSubmitting(false);
                  }
                }}
                disabled={mediaSubmitting}
                className="px-4 py-2 rounded-md bg-[#D6B549] text-slate-900 font-medium disabled:opacity-70"
              >
                {mediaSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogsMedia;

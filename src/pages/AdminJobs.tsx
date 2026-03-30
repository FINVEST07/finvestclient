import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "sonner";
import AdminSidebar from "@/components/AdminSidebar";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface JobRecord {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

const normalizeQuillHtmlForStorage = (html: string) => {
  if (!html) return "";
  let out = html;
  const emptyParaRegex = "<p>\\s*(?:<br\\s*\\/?\\s*>|&nbsp;|\\s)*\\s*<\\/p>";

  out = out.replace(new RegExp(`(\\s*${emptyParaRegex}\\s*)+`, "gi"), "<br />");
  out = out.replace(/(<br\s*\/?>\s*){3,}/gi, "<br /><br />");
  return out.trim();
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "list",
    "bullet",
    "link",
    "align",
  ];

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingId("");
  };

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}jobs`);
      setJobs(res.data?.payload || []);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (job: JobRecord) => {
    setEditingId(job._id);
    setTitle(job.title || "");
    setDescription(job.description || "");
    setOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        description: normalizeQuillHtmlForStorage(description),
      };

      const req = editingId
        ? axios.put(`${import.meta.env.VITE_API_URI}jobs/${editingId}`, payload)
        : axios.post(`${import.meta.env.VITE_API_URI}jobs`, payload);

      const res = await req;

      if (!res.data?.status) {
        toast.error(res.data?.message || "Failed to save job");
        return;
      }

      toast.success(res.data?.message || (editingId ? "Job updated" : "Job created"));
      setOpen(false);
      resetForm();
      loadJobs();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job posting?")) return;

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URI}jobs/${id}`);
      if (!res.data?.status) {
        toast.error(res.data?.message || "Failed to delete job");
        return;
      }

      toast.success(res.data?.message || "Job deleted");
      setJobs((prev) => prev.filter((item) => item._id !== id));
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete job");
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Title",
        selector: (row: JobRecord) => row.title,
        wrap: true,
        grow: 2,
      },
      {
        name: "Description",
        cell: (row: JobRecord) => {
          const text = stripHtml(row.description || "");
          const shortText = text.length > 100 ? `${text.slice(0, 100)}...` : text;
          return (
            <span title={text} className="block max-w-[280px]">
              {shortText}
            </span>
          );
        },
        grow: 3,
      },
      {
        name: "Created",
        selector: (row: JobRecord) => formatDateTime(row.createdAt),
        width: "190px",
      },
      {
        name: "Actions",
        cell: (row: JobRecord) => (
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => openEdit(row)}
            >
              Edit
            </button>
            <button
              className="px-3 py-1 bg-red-600 text-white rounded"
              onClick={() => handleDelete(row._id)}
            >
              Delete
            </button>
          </div>
        ),
        width: "180px",
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
      <AdminSidebar />

      <div className="ml-[22%] pt-[10vh] px-[5%]">
        <section className="bg-slate-900/50 rounded-lg border border-slate-700 p-6 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-white text-2xl font-semibold">Jobs</h2>
            <button
              onClick={openCreate}
              disabled={submitting}
              className="px-4 py-2 bg-[#D6B549] text-slate-900 font-medium rounded-md hover:brightness-95 disabled:opacity-70"
            >
              Post Job
            </button>
          </div>

          <div className="mt-5">
            <DataTable
              columns={columns as any}
              data={jobs}
              progressPending={loading}
              pagination
              customStyles={customStyles}
              responsive
              noDataComponent={
                <div className="text-center py-6 text-gray-500">No jobs posted yet.</div>
              }
            />
          </div>
        </section>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-[90%] max-w-2xl bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">
                {editingId ? "Edit Job" : "Post Job"}
              </h3>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-700" aria-label="Close">
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
                <div className="admin-job-quill relative border border-slate-300 rounded-md">
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={(val) => setDescription(val)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your job content..."
                  />
                </div>
                <style>{`
                  .admin-job-quill .ql-container { height: 260px; overflow-y: auto; }
                  .admin-job-quill .ql-tooltip { z-index: 50; }
                  .admin-job-quill .ql-tooltip { left: 8px !important; }
                  .admin-job-quill .ql-tooltip { max-width: calc(100% - 16px); }
                  .admin-job-quill .ql-tooltip input { width: 220px; max-width: 60vw; }
                `}</style>
                {/* Hidden textarea keeps browser validation/autofill tools happy with rich text editors */}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="hidden"
                  readOnly
                />
              </div>

            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-[#D6B549] text-slate-900 font-medium disabled:opacity-70"
              >
                {submitting ? "Saving..." : editingId ? "Save" : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;

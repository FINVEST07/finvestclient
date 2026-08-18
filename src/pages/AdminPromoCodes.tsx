import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "sonner";
import AdminSidebar from "@/components/AdminSidebar";
import ToastContainerComponent from "@/components/ToastContainerComponent";

interface PromoCodeRecord {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  createdAt?: string;
}

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AdminPromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCodeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const resetForm = () => {
    setCode("");
    setDescription("");
    setDiscountType("percentage");
    setDiscountValue("");
    setStartDate("");
    setEndDate("");
    setIsActive(true);
    setEditingId("");
  };

  const loadPromoCodes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}promocodes`);
      setPromoCodes(res.data?.payload || []);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load promo codes");
      setPromoCodes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPromoCodes();
  }, [loadPromoCodes]);

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (promo: PromoCodeRecord) => {
    setEditingId(promo._id);
    setCode(promo.code);
    setDescription(promo.description || "");
    setDiscountType(promo.discountType);
    setDiscountValue(String(promo.discountValue || ""));
    setStartDate(promo.startDate ? promo.startDate.slice(0, 10) : "");
    setEndDate(promo.endDate ? promo.endDate.slice(0, 10) : "");
    setIsActive(promo.isActive);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!code.trim()) {
      toast.error("Promo code is required");
      return;
    }

    if (!discountValue || isNaN(Number(discountValue))) {
      toast.error("Valid discount value is required");
      return;
    }

    if (discountType === "percentage" && (Number(discountValue) < 0 || Number(discountValue) > 100)) {
      toast.error("Percentage discount must be between 0 and 100");
      return;
    }

    try {
      setSubmitting(true);

      const payload: any = {
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        startDate: startDate || null,
        endDate: endDate || null,
        isActive,
      };

      if (!editingId) {
        payload.code = code.trim().toUpperCase();
      }

      const req = editingId
        ? axios.put(`${import.meta.env.VITE_API_URI}promocodes/${editingId}`, payload)
        : axios.post(`${import.meta.env.VITE_API_URI}promocodes`, payload);

      const res = await req;

      if (!res.data?.status) {
        toast.error(res.data?.message || "Failed to save promo code");
        return;
      }

      toast.success(res.data?.message || (editingId ? "Promo code updated" : "Promo code created"));
      setOpen(false);
      resetForm();
      loadPromoCodes();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save promo code");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URI}promocodes/${id}`);
      if (!res.data?.status) {
        toast.error(res.data?.message || "Failed to delete promo code");
        return;
      }

      toast.success(res.data?.message || "Promo code deleted");
      setPromoCodes((prev) => prev.filter((item) => item._id !== id));
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete promo code");
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Code",
        selector: (row: PromoCodeRecord) => row.code,
        cell: (row: PromoCodeRecord) => (
          <span className="font-mono font-semibold text-slate-800">{row.code}</span>
        ),
        width: "140px",
      },
      {
        name: "Discount",
        cell: (row: PromoCodeRecord) => (
          <span>
            {row.discountType === "percentage"
              ? `${row.discountValue}%`
              : `₹${row.discountValue}`}
          </span>
        ),
        width: "120px",
      },
      {
        name: "Valid Period",
        cell: (row: PromoCodeRecord) => (
          <span className="text-sm">
            {formatDate(row.startDate)} - {formatDate(row.endDate)}
          </span>
        ),
        width: "180px",
      },
      {
        name: "Status",
        cell: (row: PromoCodeRecord) => (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              row.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {row.isActive ? "Active" : "Inactive"}
          </span>
        ),
        width: "100px",
      },
      {
        name: "Actions",
        cell: (row: PromoCodeRecord) => (
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
            <h2 className="text-white text-2xl font-semibold">Promo Codes</h2>
            <button
              onClick={openCreate}
              disabled={submitting}
              className="px-4 py-2 bg-[#D6B549] text-slate-900 font-medium rounded-md hover:brightness-95 disabled:opacity-70"
            >
              Create Promo Code
            </button>
          </div>

          <div className="mt-5">
            <DataTable
              columns={columns as any}
              data={promoCodes}
              progressPending={loading}
              pagination
              customStyles={customStyles}
              responsive
              noDataComponent={
                <div className="text-center py-6 text-gray-500">No promo codes created yet.</div>
              }
            />
          </div>
        </section>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-[90%] max-w-2xl bg-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">
                {editingId ? "Edit Promo Code" : "Create Promo Code"}
              </h3>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-700" aria-label="Close">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={!!editingId}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D6B549] disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                  placeholder="e.g. SAVE10"
                />
                {editingId && (
                  <p className="text-xs text-slate-500 mt-1">Code cannot be changed after creation.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D6B549]"
                  placeholder="Optional description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "percentage" | "flat")}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D6B549]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Discount Value {discountType === "percentage" ? "(%)" : "(₹)"}
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D6B549]"
                    placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 500"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D6B549]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D6B549]"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Active
                </label>
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
                {submitting ? "Saving..." : editingId ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromoCodes;

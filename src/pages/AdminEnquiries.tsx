import AdminSidebar from "@/components/AdminSidebar";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ToastContainerComponent from "@/components/ToastContainerComponent";

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminRank, setAdminRank] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedRank = localStorage.getItem("rank");
    const storedEmail = localStorage.getItem("email");

    if (storedRank && storedEmail) {
      setAdminRank(parseInt(storedRank));
      setEmail(storedEmail);
    } else {
      alert("You are not authorized. Redirecting to login...");
      navigate("/admin");
    }
  }, []);

  const formatDate = (iso: any) => {
    try {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return "-";
      return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URI}getenquiries`);
      setEnquiries(res.data?.payload || []);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to load enquiries");
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!adminRank || !email) return;
    loadData();
  }, [adminRank, email, loadData]);

  const columns = useMemo(
    () => [
      { name: "Name", selector: (row: any) => row.name || "-", width: "160px" },
      { name: "Email", selector: (row: any) => row.email || "-", width: "240px" },
      { name: "Mobile", selector: (row: any) => row.mobile || "-", width: "150px" },
      { name: "City", selector: (row: any) => row.city || "-", width: "140px" },
      { name: "Service", selector: (row: any) => row.service || "-", width: "130px" },
      { name: "Amount", selector: (row: any) => row.amount || "-", width: "130px" },
      {
        name: "Referral",
        selector: (row: any) => row.referralCode || "-",
        width: "140px",
      },
      {
        name: "Submitted",
        selector: (row: any) => formatDate(row.createdAt),
        width: "190px",
      },
    ],
    []
  );

  const customStyles = {
    headRow: {
      style: {
        width: "100%",
        backgroundColor: "#0F172A",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
        padding: "12px",
      },
    },
    headCells: {
      style: () => ({
        flex: "1 1 auto",
        textAlign: "left",
        fontSize: "14px",
        fontWeight: "bold",
        padding: "12px",
      }),
    },
    rows: {
      style: {
        backgroundColor: "#f9fafb",
        color: "#374151",
        fontSize: "14px",
        padding: "10px",
        borderBottom: "1px solid #d1d5db",
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
    <div className="bg-slate-800 w-full min-h-screen">
      <ToastContainerComponent />
      <AdminSidebar />
      <div className="ml-[22%] pt-[10vh] px-[5%]">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-white text-2xl font-semibold">Enquiries</h1>
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
            onClick={() => loadData()}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        <DataTable
          columns={columns as any}
          data={enquiries}
          progressPending={loading}
          pagination
          //@ts-expect-error ignore
          customStyles={customStyles}
          noDataComponent={
            <div className="p-4 text-center text-gray-500">No enquiries found</div>
          }
        />
      </div>
    </div>
  );
};

export default AdminEnquiries;

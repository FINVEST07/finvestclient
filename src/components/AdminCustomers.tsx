import AdminSidebar from "./AdminSidebar";
import { useState, useCallback, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Crown, X, Search } from "lucide-react";

// Error Boundary Component
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) return fallback;
  return children;
};

// Type definition for customer data
interface Subscription {
  planId: string;
  planLabel: string;
  amount: number;
  status: string;
  orderId: string;
  paymentId: string;
  activatedAt: string;
  expiresAt: string;
  createdAt: string;
}

interface Customer {
  customer_id: string;
  fullName: string;
  mobile: string;
  email: string;
  createdAt: string;
  premium?: boolean;
  premiumPlan?: string | null;
  premiumActivatedAt?: string | null;
  premiumExpiresAt?: string | null;
  subscription?: Subscription | null;
}

const PLAN_LABELS: Record<string, string> = {
  "1m": "1 Month",
  "3m": "3 Months",
  "6m": "6 Months",
  "1y": "1 Year",
};

const AdminCustomers = () => {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 3;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const formatDate = (isoDate: string): string => {
    try {
      if (!isoDate || typeof isoDate !== "string") {
        console.warn("Invalid date format:", isoDate);
        return "Invalid Date";
      }
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date object:", isoDate);
        return "Invalid Date";
      }
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Error in Date";
    }
  };

  const columns = [
    {
      name: "C_ID",
      cell: (row: Customer) => {
        try {
          return (
            <a
              className="underline text-blue-600"
              target="_blank"
              href={`/customerdashboard?email=${encodeURIComponent(
                row.email
              )}&customer_id=${encodeURIComponent(row.customer_id)}`}
              rel="noopener noreferrer"
            >
              {row.customer_id}
            </a>
          );
        } catch (err) {
          console.error("Error rendering C_ID cell:", err);
          return <span className="text-red-500">Error</span>;
        }
      },
      width: "100px",
    },
    {
      name: "Registered Date",
      selector: (row: Customer) => formatDate(row.createdAt),
      width: "150px",
    },
    {
      name: "Name",
      selector: (row: Customer) => row.fullName || "N/A",
      width: "150px",
    },
    {
      name: "Mobile",
      selector: (row: Customer) => row.mobile || "N/A",
      width: "150px",
    },
    {
      name: "Email ID",
      selector: (row: Customer) => row.email || "N/A",
      width: "250px",
    },
    {
      name: "Premium",
      cell: (row: Customer) =>
        row.premium ? (
          <button
            onClick={() => setSelectedCustomer(row)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:from-blue-800 hover:to-blue-700 transition-all"
          >
            <Crown className="w-3.5 h-3.5 text-finance-gold" />
            {PLAN_LABELS[row.premiumPlan || ""] || row.premiumPlan || "Active"}
          </button>
        ) : (
          <span className="text-slate-400 text-xs font-medium">Free</span>
        ),
      width: "140px",
    },
  ];

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
      style: (column) => ({
        flex: "1 1 auto",
        textAlign: "left",
        fontSize: "14px",
        fontWeight: "bold",
        padding: "12px",
        marginLeft: column.index === 0 ? "-100px" : "50px",
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
    cells: {
      style: (column) => ({
        textAlign: "center",
        paddingLeft: "15px",
        marginLeft: column.index === 0 ? "-100px" : "50px",
      }),
    },
    pagination: {
      style: {
        backgroundColor: "#e2e8f0",
        color: "#374151",
        fontSize: "14px",
      },
    },
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Set timeout for API call
      timeoutRef.current = setTimeout(() => {
        setError("Request timeout. Please try again.");
        setLoading(false);
      }, 10000);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}getcustomers`,
        {
          timeout: 10000,
          headers: {
            Accept: "application/json",
          },
        }
      );

      // Validate response
      if (!response?.data?.payload) {
        throw new Error("Invalid response structure");
      }

      const payload = response.data.payload;

      // Type checking for payload
      if (!Array.isArray(payload)) {
        console.error("Payload is not an array:", payload);
        setCustomerList([]);
        setError("Invalid data format received");
        return;
      }

      setCustomerList(payload);
    } catch (error) {
      console.error("Error loading customers:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        retryCount,
      });

      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        setTimeout(() => loadData(), 2000 * (retryCount + 1));
      } else {
        setError(error.message || "Failed to load customers");
        setCustomerList([]);
      }
    } finally {
      setLoading(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [retryCount]);

  useEffect(() => {
    loadData();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loadData]);

  const filteredCustomerList = customerList.filter((c) => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase().trim();
    return (
      (c.fullName || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.mobile || "").toLowerCase().includes(q) ||
      String(c.customer_id || "").toLowerCase().includes(q)
    );
  });

  // Fallback UI
  const renderContent = () => {
    if (error) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              setRetryCount(0);
              loadData();
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="text-center py-4">
          <span className="animate-spin inline-block w-6 h-6 border-4 border-t-transparent border-orange-500 rounded-full"></span>
          <p className="text-white mt-2">Loading customers...</p>
        </div>
      );
    }

    if (customerList.length === 0) {
      return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p className="font-bold">No Data</p>
          <p>No customers found.</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => loadData()}
          >
            Refresh
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, mobile, or customer ID..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          />
        </div>
        <DataTable
          columns={columns}
          data={filteredCustomerList}
          pagination
          //@ts-expect-error err
          customStyles={customStyles}
          noDataComponent={
            <div className="p-4 text-center text-gray-500">
              {searchText ? "No matching customers found" : "No customers available"}
            </div>
          }
        />
      </div>
    );
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded">
          <p className="font-bold">Component Error</p>
          <p>An unexpected error occurred. Please try refreshing the page.</p>
        </div>
      }
    >
      <div className="bg-slate-800 w-full min-h-screen">
        <AdminSidebar />
        <div className="ml-[22%] pt-[10vh] px-[5%]">{renderContent()}</div>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-finance-gold" />
                <div>
                  <h3 className="text-lg font-bold">Premium Subscription</h3>
                  <p className="text-blue-100 text-sm">{selectedCustomer.fullName || selectedCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Plan</p>
                  <p className="text-sm font-semibold text-blue-900">
                    {PLAN_LABELS[selectedCustomer.premiumPlan || ""] || selectedCustomer.premiumPlan || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Status</p>
                  <p className="text-sm font-semibold">
                    <span className="inline-flex items-center gap-1.5 text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {selectedCustomer.subscription?.status || "Active"}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Activated On</p>
                  <p className="text-sm text-slate-800">{formatDate(selectedCustomer.premiumActivatedAt || selectedCustomer.subscription?.activatedAt || "")}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Expires On</p>
                  <p className="text-sm text-slate-800">{formatDate(selectedCustomer.premiumExpiresAt || selectedCustomer.subscription?.expiresAt || "")}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Amount Paid</p>
                  <p className="text-sm font-semibold text-blue-900">
                    ₹{(selectedCustomer.subscription?.amount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Payment ID</p>
                  <p className="text-sm text-slate-800 break-all">{selectedCustomer.subscription?.paymentId || "N/A"}</p>
                </div>
              </div>

              {selectedCustomer.subscription?.orderId && (
                <div>
                  <p className="text-xs text-slate-500 font-medium">Order ID</p>
                  <p className="text-sm text-slate-800 break-all">{selectedCustomer.subscription.orderId}</p>
                </div>
              )}

              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full mt-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default AdminCustomers;

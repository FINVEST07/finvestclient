import AdminSidebar from "./AdminSidebar";
import { useState, useCallback, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

// Error Boundary Component
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) return fallback;
  return children;
};

// Type definition for customer data
interface Customer {
  customer_id: string;
  fullName: string;
  mobile: string;
  email: string;
  createdAt: string;
}

const AdminCustomers = () => {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 3;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      name: "Registered Date",
      selector: (row: Customer) => formatDate(row.createdAt),
      width: "150px",
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
      <DataTable
        columns={columns}
        data={customerList}
        pagination
        //@ts-expect-error err
        customStyles={customStyles}
        noDataComponent={
          <div className="p-4 text-center text-gray-500">
            No customers available
          </div>
        }
      />
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
    </ErrorBoundary>
  );
};

export default AdminCustomers;

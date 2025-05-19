import AdminSidebar from "./AdminSidebar";
import { useState, useCallback, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

const AdminCustomers = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const columns = [
    { name: "C_ID", selector: (row) => row.customer_id, width: "100px" },
    { name: "Name", selector: (row) => row.fullName, width: "150px" },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      width: "150px",
    },
    { name: "Email ID", selector: (row) => row.email, width: "250px" },
    {
      name: "Registered Date",
      selector: (row) => formatDate(row.createdAt),
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
        marginLeft: column.index === 0 ? "-100px" : "50px", // No margin for first column
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
        marginLeft: column.index === 0 ? "-100px" : "50px", // No margin for first column
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
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}getcustomers`
      );
      const payload = response.data.payload;
      

      if (Array.isArray(payload)) {
        setCustomerList(payload);
      } else {
        setCustomerList([]); // fallback to empty array
      }
    } catch (error) {
      console.error("Error loading users", error);
      setCustomerList([]); // fallback if error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  
  return (
    <div className="bg-slate-800 w-full min-h-screen">
      <AdminSidebar />
      <div className="ml-[22%] pt-[10vh] px-[5%]">
        {loading ? (
          <div className="text-center py-4">
            <span className="animate-spin inline-block w-6 h-6 border-4 border-t-transparent border-orange-500 rounded-full"></span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={customerList}
            pagination
            //@ts-expect-error fff
            customStyles={customStyles}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;


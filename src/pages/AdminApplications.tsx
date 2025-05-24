import AdminSidebar from "@/components/AdminSidebar";
import { useState, useCallback, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ToastContainerComponent from "@/components/ToastContainerComponent";

const AdminApplications = () => {
  const [applicationList, setApplicationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminRank, setAdminRank] = useState(null);
  const [email, setEmail] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [forwardboxopen, setForwardBoxOpen] = useState(false);
  const [forwardadmin , setForwardAdmin] = useState("")
  const [currentApplicationId , setCurrentApplicationId ] = useState("");

  const navigate = useNavigate();

 
  const CloseIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        width={20}
        className="ml-auto"
        onClick={() => setForwardBoxOpen(false)}
      >
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>
    );
  };

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

  const loadData = useCallback(async () => {
    if (!adminRank || !email) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}getapplicationcustomers`,
        {
          params: { rank: adminRank, email: email },
        }
      );
      const payload = response.data.payload;

      setApplicationList(payload || []);

      const adminresponse = await axios.get(
        `${import.meta.env.VITE_API_URI}getadmins`,
        {
          params: { email: email },
        }
      );

      if (!adminresponse.data.status) {
        toast.error(adminresponse.data.message);
      }

      setAdmins(adminresponse.data.payload);
    } catch (error) {
      console.error("Error loading users", error);
      setApplicationList([]);
    } finally {
      setLoading(false);
    }
  }, [adminRank]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  
 

  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours24 = date.getHours();
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    const ampm = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes} ${ampm}`;
  };

  const handleComplete = async (applicationId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}completeapplication`,
        {
          applicationId: applicationId,
        }
      );

      if (response.data.status) {
        toast.success(response.data.message);
        loadData();
      }
    } catch (error) {
      console.error(error);
      alert("Something Went Wrong");
    }
  };

  const handleForward = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}forwardapplication`,
        {
          email: forwardadmin,
          applicationId : currentApplicationId
        }
      );

      if (!response.data.status) {
        toast.error(response.data.message);
        return;
      }

      toast.error(response.data.message);
      setCurrentApplicationId("");
      setForwardAdmin("");
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
    
  };

  const columns = [
    {
      name: "",
      cell: (row) => (
        <button
          className="px-4 py-2 bg-blue-800 rounded text-white"
          onClick={() => {
            setForwardBoxOpen(true);
            setCurrentApplicationId(row.applicationId)
          }}
        >
          Forward
        </button>
      ),
      width: "100px",
    },
    {
      name: "",
      cell: (row) => (
        <button
          className="px-4 py-2 text-2xl rounded text-white"
          onClick={() => handleComplete(row.applicationId)}
        >
          ✅
        </button>
      ),
      width: "100px",
    },
    { name: "Customer Name", selector: (row) => row.fullName, width: "180px" },

    {
      name: "Application ID",
      cell: (row) => (
        <a
          className="underline text-blue-600"
          target="_blank"
          href={`/applicationform?update=false&type=${row.servicetype}&customerId=${row.customer_id}`}
        >
          {row.applicationId.toUpperCase()}
        </a>
      ),
      width: "150px",
    },
    {
      name: "Date",
      selector: (row) => formatDate(row.createdAt),
    },
    {
      name: "Time",
      selector: (row) => formatTime(row.createdAt),
    },
    { name: "AADHAAR", selector: (row) => row.aadhaarNumber, width: "150px" },
    { name: "Service", selector: (row) => row.servicename },
    { name: "Loan Amount", selector: (row) => row?.newLoanAmount },
  ];

  // const docFields = [
  //   { name: "Customer Photo", key: "photo" },
  //   { name: "PAN Card", key: "pancard" },
  //   { name: "Aadhar Card", key: "aadharcard" },
  //   { name: "Passport", key: "passport" },
  //   { name: "Visa", key: "visa" },
  //   { name: "CDC", key: "cdc" },
  //   { name: "Rent Agreement", key: "rentagreement" },
  //   { name: "Salary Slip", key: "salaryslip" },
  //   { name: "Bank Statement", key: "bankstatement" },
  //   { name: "Form 16", key: "form16" },
  //   { name: "ITR", key: "itr" },
  //   { name: "Sale Agreement", key: "saleagreement" },
  //   { name: "Share Certificate", key: "sharecertificate" },
  //   { name: "Electricity Bill", key: "electricitybill" },
  //   { name: "Maintenance Bill", key: "maintenancebill" },
  //   { name: "House Tax Bill", key: "housetaxbill" },
  //   { name: "NOC", key: "noc" },
  //   { name: "Marriage Certificate", key: "marraigecertificate" },
  //   { name: "Birth Certificate", key: "birthcertificate" },
  //   { name: "Qualification Certificate", key: "qualificationcertificate" },
  // ];

  // // Push document image columns dynamically
  // docFields.forEach(({ name, key }) => {
  //   columns.push({
  //     name,
  //     selector: (row) => row[key],
  //     // @ts-expect-error hhh
  //     cell: (row) => renderImageCell(row[key], name, row.fullName),
  //     width: "200px",
  //   });
  // });

  const customStyles = {
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
      style: () => ({
        fontSize: "14px",
        fontWeight: "bold",
        padding: "12px",
      }),
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
      style: () => ({
        textAlign: "center",
        paddingLeft: "15px",
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

  return (
    <div className="bg-slate-800 w-full min-h-screen">
      <ToastContainerComponent />
      {adminRank == 1 && <AdminSidebar />}

      {forwardboxopen && (
        <div className="absolute z-50  ml-[45%] w-[30%] px-4 py-2 bg-gray-400 shadow-gray-300 shadow-md top-[32vh] rounded-lg">
          <CloseIcon/>
          <h1 className="text-center font-semibold text-xl text-[#1E293B]">
            Forward
          </h1>
          <label className="text-[#1E293B] font-semibold">Name :</label>
          <br />
          <select
            className="w-[100%] py-1 rounded-sm px-2 mt-2"
            onChange={(e) => setForwardAdmin(e.target.value)}
          >
            <option value="">Select a Person</option>
            {admins?.length > 0 &&
              admins.map((item, index) => (
                <option key={index} value={item.email}>
                  {item.adminname}
                </option>
              ))}
          </select>
          <button onClick={handleForward} className="w-[100%] mt-4 text-white rounded-sm py-2 bg-[#1E293B]">
            Forward
          </button>
        </div>
      )}

      <div className={`${adminRank == 1 ? "ml-[22%]" : ""}  pt-[10vh] px-[5%]`}>
        {loading ? (
          <div className="text-center py-4">
            <span className="animate-spin inline-block w-6 h-6 border-4 border-t-transparent border-orange-500 rounded-full"></span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={applicationList}
            pagination
            //@ts-expect-error ignore
            customStyles={customStyles}
          />
        )}
      </div>
    </div>
  );
};

export default AdminApplications;

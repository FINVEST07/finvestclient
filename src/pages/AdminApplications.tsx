import AdminSidebar from "@/components/AdminSidebar";
import { useState, useCallback, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ToastContainerComponent from "@/components/ToastContainerComponent";

const AdminApplications = () => {
  const [applicationList, setApplicationList] = useState([]);
  const [processingApplications, setProcessingApplications] = useState([]);
  const [completedApplications, setCompletedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminRank, setAdminRank] = useState(null);
  const [email, setEmail] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [forwardboxopen, setForwardBoxOpen] = useState(false);
  const [forwardadmin, setForwardAdmin] = useState("");
  const [currentApplicationId, setCurrentApplicationId] = useState("");
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false);
  const [applicationToComplete, setApplicationToComplete] = useState("");

  // New state for appraisal modal
  const [appraisalModalOpen, setAppraisalModalOpen] = useState(false);
  const [currentAppraisal, setCurrentAppraisal] = useState("");
  const [appraisalApplicationId, setAppraisalApplicationId] = useState("");

  const navigate = useNavigate();

  const CloseIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        width={20}
        className="ml-auto cursor-pointer"
        onClick={() => setForwardBoxOpen(false)}
      >
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>
    );
  };

  const PencilIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={16}
        height={16}
        className="cursor-pointer text-blue-600 hover:text-blue-800"
      >
        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
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

      // Filter applications by status
      const processing =
        payload?.filter((app) => app.status === "Processing") || [];
      const completed =
        payload?.filter((app) => app.status === "Completed") || [];

      setProcessingApplications(processing);
      setCompletedApplications(completed);

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
      setProcessingApplications([]);
      setCompletedApplications([]);
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
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
        setConfirmCompleteOpen(false);
        setApplicationToComplete("");
        loadData();
      }
    } catch (error) {
      console.error(error);
      alert("Something Went Wrong");
    }
  };

  const handleCompleteClick = (applicationId) => {
    setApplicationToComplete(applicationId);
    setConfirmCompleteOpen(true);
  };

  const handleAppraisalEdit = (applicationId, currentAppraisal) => {
    setAppraisalApplicationId(applicationId);
    setCurrentAppraisal(currentAppraisal || "");
    setAppraisalModalOpen(true);
  };

  const handleAppraisalSubmit = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}addappraisal`,
        {
          applicationId: appraisalApplicationId,
          appraisal: currentAppraisal,
        }
      );

      if (response.data.status) {
        toast.success("Appraisal updated successfully");
        setAppraisalModalOpen(false);
        setAppraisalApplicationId("");
        setCurrentAppraisal("");
        loadData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response.data?.message) {
        toast.error(error.response.data?.message);
      } else {
        console.error(error);
        toast.error("Something went wrong while updating appraisal");
      }
    }
  };

  const handleForward = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}forwardapplication`,
        {
          email: forwardadmin,
          applicationId: currentApplicationId,
        }
      );

      if (!response.data.status) {
        toast.error(response.data.message);
        return;
      }

      toast.success(response.data.message);
      setCurrentApplicationId("");
      setForwardAdmin("");
      setForwardBoxOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong");
    }
  };

  // Columns for processing applications (with Forward and Complete buttons)
  const processingColumns = [
    {
      name: "",
      cell: (row) => (
        <button
          className="px-4 py-2 bg-blue-800 rounded text-white"
          onClick={() => {
            setForwardBoxOpen(true);
            setCurrentApplicationId(row.applicationId);
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
        <div className="flex items-center ">
          <button
            className="px-4 py-2 text-2xl rounded text-white"
            onClick={() => handleCompleteClick(row.applicationId)}
          >
            ✅
          </button>
          {/* <button
            onClick={() =>
              handleAppraisalEdit(row.applicationId, row.appraisal)
            }
            className="p-2 hover:bg-gray-100 rounded"
            title="Edit Appraisal"
          >
            <PencilIcon />
          </button> */}
        </div>
      ),
      width: "80px",
    },
    {
      name: "Assigned Person",
      cell: (row) => <p>{row.representativeid}</p>,
      width: "260px",
    },
    {
      name: "Appraisal",
      cell: (row) => (
        <textarea
          readOnly
          value={row?.appraisal || ""}
          className="w-full p-2 border rounded resize-none"
          rows={2}
          onClick={() => handleAppraisalEdit(row.applicationId, row.appraisal)}
        ></textarea>
      ),
      width: "260px",
    },
    {
      name: "Customer Name",
      cell: (row) => (
        <a
          className="underline text-blue-600"
          target="_blank"
          href={`/customerdashboard?email=${row.email}&customer_id=${row.customer_id}`}
        >
          {row.fullName}
        </a>
      ),
      width: "180px",
    },
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
    { name: "City", selector: (row) => row?.city },
    {
      name: "Location",
      selector: (row) => row?.location,
      width: "150px",
    },
    { name: "AADHAAR", selector: (row) => row.aadhaarNumber, width: "150px" },
    { name: "Service", selector: (row) => row.servicename },
    { name: "Loan Amount", selector: (row) => row?.newLoanAmount },
    { name: "Status", selector: (row) => row.status, width: "120px" },
  ];

  // Columns for completed applications (without Forward and Complete buttons)
  const completedColumns = [
    {
      name: "Customer Name",
      cell: (row) => (
        <a
          className="underline text-blue-600"
          target="_blank"
          href={`/customerdashboard?email=${row.email}&customer_id=${row.customer_id}`}
        >
          {row.customer_id.toUpperCase()}
        </a>
      ),
      width: "180px",
    },
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
    {
      name: "Closing Date",
      selector: (row) => formatDate(row.closingTime),
    },
    {
      name: "Closing Time",
      selector: (row) => formatTime(row.closingTime),
    },
    { name: "AADHAAR", selector: (row) => row.aadhaarNumber, width: "150px" },
    { name: "Service", selector: (row) => row.servicename },
    { name: "Loan Amount", selector: (row) => row?.newLoanAmount },
    { name: "Status", selector: (row) => row.status, width: "120px" },
  ];

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

  const completedCustomStyles = {
    ...customStyles,
    headRow: {
      style: {
        backgroundColor: "#065F46",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
        padding: "12px",
      },
    },
  };

  return (
    <div className="bg-slate-800 pb-10 w-full min-h-screen">
      <ToastContainerComponent />
      <button
        className="fixed top-5 right-5 bg-red-700 z-50 px-4 py-2 text-white rounded-md"
        onClick={() => {
          localStorage.removeItem("rank");
          window.location.reload();
        }}
      >
        Log Out
      </button>
      {adminRank == 1 && <AdminSidebar />}

      {/* Forward Modal */}
      {forwardboxopen && (
        <div className="absolute z-50 ml-[45%] w-[30%] px-4 py-2 bg-gray-400 shadow-gray-300 shadow-md top-[32vh] rounded-lg">
          <CloseIcon />
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
          <button
            onClick={handleForward}
            className="w-[100%] mt-4 text-white rounded-sm py-2 bg-[#1E293B]"
          >
            Forward
          </button>
        </div>
      )}

      {/* Complete Confirmation Modal */}
      {confirmCompleteOpen && (
        <div className="absolute z-50 ml-[40%] w-[35%] px-6 py-4 bg-white shadow-lg shadow-gray-500 top-[35vh] rounded-lg border border-gray-300">
          <div className="flex justify-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              width={20}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => {
                setConfirmCompleteOpen(false);
                setApplicationToComplete("");
              }}
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </div>
          <h2 className="text-center font-bold text-xl text-[#1E293B] mb-4">
            Complete Application
          </h2>
          <p className="text-center text-gray-700 mb-6">
            Are you sure you want to complete this application?
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setConfirmCompleteOpen(false);
                setApplicationToComplete("");
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleComplete(applicationToComplete)}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Yes, Complete
            </button>
          </div>
        </div>
      )}

      {/* Appraisal Edit Modal */}
      {appraisalModalOpen && (
        <div className="absolute z-50 ml-[35%] w-[40%] px-6 py-4 bg-white shadow-lg shadow-gray-500 top-[25vh] rounded-lg border border-gray-300">
          <div className="flex justify-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              width={20}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => {
                setAppraisalModalOpen(false);
                setAppraisalApplicationId("");
                setCurrentAppraisal("");
              }}
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </div>
          <h2 className="text-center font-bold text-xl text-[#1E293B] mb-4">
            Edit Appraisal
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appraisal:
            </label>
            <textarea
              value={currentAppraisal}
              onChange={(e) => setCurrentAppraisal(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              placeholder="Enter appraisal details..."
            />
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setAppraisalModalOpen(false);
                setAppraisalApplicationId("");
                setCurrentAppraisal("");
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAppraisalSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className={`${adminRank == 1 ? "ml-[22%]" : ""} pt-[10vh] px-[5%]`}>
        {loading ? (
          <div className="text-center py-4">
            <span className="animate-spin inline-block w-6 h-6 border-4 border-t-transparent border-orange-500 rounded-full"></span>
          </div>
        ) : (
          <>
            {/* Processing Applications Table */}
            <div className="mb-8">
              <h2 className="text-white text-2xl font-bold mb-4">
                Processing Applications ({processingApplications.length})
              </h2>
              <DataTable
                columns={processingColumns}
                data={processingApplications}
                pagination
                //@ts-expect-error ignore
                customStyles={customStyles}
                noDataComponent={
                  <div className="text-center py-4 text-gray-500">
                    No processing applications found
                  </div>
                }
              />
            </div>

            {/* Completed Applications Table - Only render if there are completed applications */}
            {completedApplications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white text-2xl font-bold mb-4">
                  Completed Applications ({completedApplications.length})
                </h2>
                <DataTable
                  columns={completedColumns}
                  data={completedApplications}
                  pagination
                  //@ts-expect-error ignore
                  customStyles={completedCustomStyles}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;

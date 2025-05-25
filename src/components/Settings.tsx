import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import DataTable from "react-data-table-component";
import { toast } from "sonner";

const Settings = () => {
  const [adminsrequestlist, setAdminsRequestList] = useState([]);

  const [adminlist, setAdminList] = useState([]);
  const [addBoxOpen, setAddBoxOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formdata, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    servicename: "",
  });

  const [currentData, setCurrentData] = useState({});

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrentChange = (e) => {
    const { name, value } = e.target;

    if (value != "") {
      setCurrentData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const CloseIcon = () => {
    return (
      <svg
        onClick={() => setAddBoxOpen(false)}
        width={20}
        fill="#fff"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        className="ml-auto"
      >
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>
    );
  };

  const handledelete = async (id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}deleteemloyeepartner`,
        {
          id: id,
        }
      );

      if (response.status != 200) {
        alert(response.data.message);
        return;
      }

      loadData();
      alert(response.data.message);
    } catch (error) {
      alert("Something Went Wrong!");
    }
  };

  const assigndata = (applicationId) => {
    const filtered = adminsrequestlist.filter(
      (item) => item.applicationId == applicationId
    );

    setCurrentData(filtered[0]);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };


  const columns = [
    {
      name: "",
      cell: (row) => (
        <button
          className="px-4 py-2 bg-red-800 rounded text-white"
          onClick={() => handledelete(row.applicationId)}
        >
          Reject
        </button>
      ),
      width: "50px",
    },
    {
      name: "",
      cell: (row) => (
        <button
          className="px-4 py-2 bg-green-800 rounded text-white"
          onClick={() => {
            setAddBoxOpen(true);
            assigndata(row.applicationId);
          }}
        >
          Accept
        </button>
      ),
      width: "50px",
    },
    {
      name: "Date",
      cell: (row) => (
        <p>
          {formatDate(row.createdAt)}
        </p>
      ),
      width: "100px",
    },
    {
      name: "Name",
      cell: (row) => (
        <a
          className="underline text-blue-600"
          target="_blank"
          href={`/applicationform?update=false&type=${row.servicetype}`}
        >
          {row.fullName}
        </a>
      ),
      width: "150px",
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      width: "120px",
    },
    { name: "Email ID", selector: (row) => row.email, width: "220px" },
    {
      name: "Request",
      selector: (row) => row.servicename,
      width: "250px",
    },
  ];

  const admincolumns = [
    { name: "Name", selector: (row) => row.adminname, width: "150px" },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      width: "120px",
    },
    { name: "Email ID", selector: (row) => row.email, width: "220px" },
    {
      name: "Rank",
      selector: (row) =>
        row.rank == 2 ? "Employee" : row.rank == 3 ? "Partner" : "Guest",
      width: "250px",
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
        // padding: "12px",
        marginLeft: column.index === 0 ? "-100px" : "50px", // No margin for first column
      }),
    },
    rows: {
      style: {
        backgroundColor: "#f9fafb",
        color: "#374151",
        fontSize: "14px",
        // padding: "10px",
        marginLeft: "-20px",
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
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}getpartnerandemployeeapplcations`
      );

      const adminresponse = await axios.get(
        `${import.meta.env.VITE_API_URI}getadmins`
      );

      const payload = response.data.payload;
      const adminpayload = adminresponse.data.payload;

      const filtered = payload.filter(
        (item) => item.servicetype == 4 || item.servicetype == "4"
      );

      setAdminsRequestList(filtered);
      setAdminList(adminpayload);

      if (Array.isArray(payload)) {
        setAdminsRequestList(payload);
      } else {
        setAdminsRequestList([]); // fallback to empty array
      }
    } catch (error) {
      console.error("Error loading users", error);
      setAdminsRequestList([]);
      setAdminList([]); // fallback if error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}addadmin`,
        {
          payload: currentData,
        }
      );

      // Check if status is in success range
      if (!response.data.status) {
        toast.error(response.data?.message || "Something went wrong");
        return;
      }

      toast.success(response.data.message);
      loadData();
      setAddBoxOpen(false);
    } catch (error) {
      console.error(error);

      toast.error("Error Adding");
    }
  };

  return (
    <div className="bg-slate-800 w-full min-h-screen">
      <AdminSidebar />
      <div className="ml-[22%] px-[5%] pt-[10vh]">
        {/* <button
          className="right-0  px-6 py-2 bg-green-600 rounded-md text-white mb-[5vh]"
          onClick={() => setAddBoxOpen(true)}
        >
          Add Employee / Add Partner
        </button> */}
        <h1 className="mb-[5vh] text-2xl text-yellow-400">
          Employee and Partner Requests :
        </h1>
        <DataTable
          columns={columns}
          data={adminsrequestlist}
          pagination
          //@ts-expect-error gun
          customStyles={customStyles}
        />

        <h1 className="my-[5vh] text-2xl text-yellow-400">
          Admins in the System :
        </h1>

        <DataTable
          columns={admincolumns}
          data={adminlist}
          pagination
          //@ts-expect-error gun
          customStyles={customStyles}
        />
      </div>
      {addBoxOpen && (
        <div className="bg-slate-900 rounded-lg border-2 border-[#fff] absolute w-[30%] px-[2%] py-6 left-[46%] top-[20vh] flex flex-col gap-4">
          <CloseIcon />

          <div className="flex flex-col gap-2">
            <span className="text-white">Full Name :</span>
            <input
              type="text"
              name="fullName"
              onChange={handleFormChange}
              // @ts-expect-error err
              value={currentData.fullName}
              required
              className="border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-white">Email :</span>
            <input
              type="text"
              name="email"
              onChange={handleFormChange}
              // @ts-expect-error err
              value={currentData.email}
              required
              className="border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-white">Mobile :</span>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              onChange={handleFormChange}
              // @ts-expect-error err
              value={currentData.mobile}
              required
              className="border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-white">Rank :</span>
            <select
              name="rank"
              id=""
              className="border border-gray-300 rounded-md p-2"
              onChange={handleCurrentChange}
            >
              <option value="">Select a option</option>
              <option value="2">Employee</option>
              <option value="3">Partner</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white py-2 rounded-md"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;

import React, { useState, useEffect, useCallback } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PersonalFormSection from "@/components/PersonalFormSection";
import ToastContainerComponent from "@/components/ToastContainerComponent";
import { toast } from "react-toastify";



const Customerdashboard = () => {
  const cookie = Cookie.get("finvest");
  const emailcookie = cookie ? cookie.split("$")[0] : "";
  const mobilecookie = cookie ? cookie.split("$")[1] : "";

  const [formopen, setFormOpen] = useState(false);
  const [customer, setCustomer] = useState({
    fullName: "",
    panNumber: "",
    aadhaarNumber: "",
    fatherName: "",
    motherName: "",
    dob: "",
    email: "",
    customer_id: "",
    servicename: "",
  });

  const [applications, setApplications] = useState(null);

  const navigate = useNavigate();

  const [selectedservice, setSelectedService] = useState({
    type: "",
    servicename: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    panNumber: "",
    aadhaarNumber: "",
    fatherName: "",
    motherName: "",
    dob: "",
    email: emailcookie || "",
    mobile: mobilecookie || "",
  });

  const services = [
    {
      type: 1,
      servicename: "Home Loan",
    },
    {
      type: 1,
      servicename: "Mortgage Loan",
    },
    {
      type: 1,
      servicename: "Personal Loan",
    },
    {
      type: 1,
      servicename: "Business Loan",
    },
    {
      type: 1,
      servicename: "NRI Loan",
    },
    {
      type: 1,
      servicename: "CGTMSE Loan",
    },
    {
      type: 1,
      servicename: "Working Capital",
    },
    {
      type: 1,
      servicename: "SME Loan",
    },
    {
      type: 2,
      servicename: "Life Insurance",
    },
    {
      type: 2,
      servicename: "Health Insurance",
    },
    {
      type: 3,
      servicename: "Stock Investing",
    },
    {
      type: 3,
      servicename: "Mutual Fund",
    },
    {
      type: 3,
      servicename: "Smart SIP",
    },
    {
      type: 4,
      servicename: "Become a Partner",
    },
    {
      type: 4,
      servicename: "Become an Employee",
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const loadData = useCallback(async () => {
    try {
      // Fetch customer data
      const customerRes = await axios.get(
        `${import.meta.env.VITE_API_URI}getsinglecustomer`,
        {
          params: { email: emailcookie },
        }
      );

      if (customerRes.status === 200 && customerRes.data?.payload) {
        setCustomer(customerRes.data.payload);
      } else {
        console.warn("Failed to load customer data", customerRes);
      }

      // Fetch application data
      const applicationRes = await axios.get(
        `${import.meta.env.VITE_API_URI}getapplication`,
        {
          params: { email: emailcookie },
        }
      );

      if (applicationRes.status === 200 && applicationRes.data?.payload) {
        setApplications(applicationRes.data.payload);
      } else {
        console.warn("Failed to load application data", applicationRes);
      }
    } catch (error) {
      console.error("An error occurred while loading data:", error);
    }
  }, [emailcookie]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        formData.aadhaarNumber == "" ||
        formData.fullName == "" ||
        formData.dob == ""
      ) {
        toast.error("Required fields are missing !!");
        return;
      }
      if (formData.panNumber?.length != 10) {
        toast.error("PanNumber is incorrect !!");
        return;
      }

      if (formData.aadhaarNumber?.length != 12) {
        toast.error("Aadhaar Number is incorrect !!");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}createcustomer`,
        {
          payload: formData,
        }
      );

      if (response.status != 200) {
        toast.error(response.data.message);
        return;
      }

      toast.success(response.data.message);
      setFormData({
        fullName: "",
        aadhaarNumber: "",
        panNumber: "",
        fatherName: "",
        motherName: "",
        dob: "",
        email: emailcookie || "",
        mobile: mobilecookie || "",
      });
      setFormOpen(false);
      setCustomer(response.data.payload);
    } catch (error) {
      toast.error("Something Went Wrong");
      console.error(error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  

  return (
    <div className="bg-[#EBECEC] min-h-screen">
      <ToastContainerComponent />
      <nav
        className={`fixed top-0 flex justify-between items-center px-4 gap-2 bg-[#0F172A] h-[8vh] lg:h-[10vh] lg:border-b-2 w-full  border-[#D4AF37]`}
      >
        <div
          className="flex gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={15}
            fill="#D4AF37"
            viewBox="0 0 512 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z" />
          </svg>
          <h1 className="text-lg text-[#D4AF37]">Back to Home</h1>
        </div>
      </nav>
      <div className="px-[5%] mt-[8vh] lg:mt-[10vh] p-6">
        <h2 className="text-lg font-semibold mb-6">
          <span className="text-xl">Welcome,</span> <br />{" "}
          {customer.fullName || emailcookie || "User"}
        </h2>
        {customer.customer_id ? (
          <>
            <table>
              <tr>
                <th className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                  Customer&nbsp;ID
                </th>
                <th className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                  Name
                </th>
                <th className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                  DOB
                </th>
                <th className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                  PAN N0.
                </th>
                <th className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                  AADHAAR N0.
                </th>
              </tr>
              <tr>
                <td className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                  {customer.customer_id}
                </td>
                <td className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                  {customer.fullName}
                </td>
                <td className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                  {customer.dob}
                </td>
                <td className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                  {customer.panNumber}
                </td>
                <td className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                  {customer.aadhaarNumber}
                </td>
              </tr>
            </table>
            {/* // @ts-expect-error err */}
            <div className="mt-[2vh] flex gap-4">
              <a
                href={`/applicationform?update=false&type=1&servicename=${customer.servicename}`}
                target="_blank"
              >
                <button className="text-xs md:text-sm lg:text-lg px-2 py-2 bg-green-500 text-white rounded-md">
                  View Documents & Details
                </button>
              </a>
              <a
                href={`/applicationform?update=false&type=1&servicename=${customer.servicename}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="text-xs md:text-sm lg:text-lg px-2 py-2 bg-green-500 text-white rounded-md">
                  Upload Documents &&nbsp;Details
                </button>
              </a>
            </div>

            {applications?.length > 0 && (
              <div className="max-h-[60vh] overflow-x-scroll my-4 py-2 rounded-sm px-2 overflow-y-scroll border-2 border-black">
                <h1 className="font-semibold text-lg mt-2 ">
                  Your Applications :
                </h1>

                {/* Application Box  */}
                {applications?.length > 0 &&
                  applications.map((item, index) => (
                    <div className="mt-4" key={index}>
                      <table className="text-center">
                        <tr>
                          <th className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            S.No
                          </th>
                          <th className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            Application ID
                          </th>
                          <th className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            Date
                          </th>
                          <th className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            Customer Name
                          </th>{" "}
                          <th className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            Service
                          </th>
                          <th className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            Status
                          </th>
                        </tr>
                        <tr>
                          <td className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            {index + 1}
                          </td>
                          <td className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            {item.applicationId}
                          </td>
                          <td className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            {item.fullName}
                          </td>
                          <td className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            {item.servicename}
                          </td>
                          <td className="border-2 border-[#0F172A] p-2 text-xs md:text-sm lg:text-lg">
                            {item.status}
                          </td>
                        </tr>
                        <a
                          href={`/applicationform?applicationId=${item.applicationId}`}
                          target="_blank"
                        >
                          <button className="bg-green-500 text-sm mt-4 py-2 px-4 rounded-md text-white">
                            View&nbsp;Application
                          </button>
                        </a>
                      </table>
                    </div>
                  ))}
              </div>
            )}

            <div className="mt-[4vh] flex flex-col gap-2 border-2 p-2 border-black">
              <h1 className="font-bold text-xl p-2 block text-black w-full  text-center rounded-md ">
                Apply for Services
              </h1>

              <label className="text-xl">Select a Service :</label>
              <div>
                <select
                  className="bg-transparent w-full border-[#0F172A] border-2"
                  value={selectedservice.servicename}
                  onChange={(e) => {
                    const selected = services.find(
                      (item) => item.servicename === e.target.value
                    );
                    setSelectedService(
                      // @ts-expect-error fff

                      selected || { type: "", servicename: "" }
                    );
                  }}
                >
                  <option className="bg-transparent" value="">
                    Select a Service
                  </option>
                  {services.map((item, index) => (
                    <option key={index} value={item.servicename}>
                      {item.servicename}
                    </option>
                  ))}
                </select>
              </div>

              <button className="w-full py-2 bg-[#0F172A] text-[#D4AF37] rounded-md">
                {selectedservice.type != "" ? (
                  <a
                    href={`applicationform?type=${selectedservice.type}&servicename=${selectedservice.servicename}&update=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full text-center"
                  >
                    Apply...
                  </a>
                ) : (
                  <p>Apply...</p>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-0">
            <span>No Data Found ☹️</span>

            <span className="text-gray-500 mt-2">
              Fill your basic information & upload your documents to get our
              services in just one click whenever required.
            </span>

            {!formopen && (
              <button
                onClick={() => setFormOpen(true)}
                className="bg-[#252C3D] text-white px-4 py-2 mt-2 rounded max-w-[20%]"
              >
                Start
              </button>
            )}
          </div>
        )}

        {formopen && (
          <form>
            <PersonalFormSection
              handleChange={handleChange}
              formData={formData}
              handleSubmit={handleSubmit}
            />
          </form>
        )}
      </div>
      {/* <Sidebar /> */}
    </div>
  );
};

export default Customerdashboard;
